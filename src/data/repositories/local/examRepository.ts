import Dexie from 'dexie'
import { EXAM_REVISION_LIMIT, TRASH_RETENTION_DAYS } from '@/constants/data'
import type { Clock } from '@/domain/clock'
import type { Exam, ExamDraft, ExamItem, ExamRevision } from '@/domain/models'
import { createId } from '@/utils/id'
import { requestPersistentStorage } from '@/utils/storage'
import type { KidneyCareDB } from '@/data/db'
import {
  RepositoryError,
  type ExamListOptions,
  type ExamRepository,
  type ExamWithItems,
} from '@/data/repositories/types'

function compareExamDesc(left: Exam, right: Exam): number {
  return (
    right.examDate.localeCompare(left.examDate) ||
    (right.examTime ?? '').localeCompare(left.examTime ?? '') ||
    right.createdAt.localeCompare(left.createdAt) ||
    right.id.localeCompare(left.id)
  )
}

function compareDeletedDesc(left: Exam, right: Exam): number {
  return (right.deletedAt ?? right.updatedAt).localeCompare(left.deletedAt ?? left.updatedAt)
}

export class LocalExamRepository implements ExamRepository {
  private readonly db: KidneyCareDB
  private readonly clock: Clock

  constructor(db: KidneyCareDB, clock: Clock) {
    this.db = db
    this.clock = clock
  }

  async list(profileId: string, options: ExamListOptions = {}): Promise<Exam[]> {
    const exams = options.includeDeleted
      ? await this.db.exams.where('profileId').equals(profileId).toArray()
      : await this.db.exams.where('[profileId+isDeleted]').equals([profileId, 0]).toArray()

    const filtered = options.categoryCode
      ? exams.filter((exam) => exam.categoryCodes.includes(options.categoryCode!))
      : exams

    filtered.sort(compareExamDesc)
    return options.limit === undefined ? filtered : filtered.slice(0, options.limit)
  }

  async listDeleted(profileId: string): Promise<Exam[]> {
    const exams = await this.db.exams
      .where('[profileId+isDeleted]')
      .equals([profileId, 1])
      .toArray()
    return exams.sort(compareDeletedDesc)
  }

  async get(profileId: string, examId: string): Promise<ExamWithItems | undefined> {
    const exam = await this.db.exams.get(examId)
    if (!exam || exam.profileId !== profileId) return undefined

    const items = await this.db.examItems
      .where('[profileId+examId]')
      .equals([profileId, examId])
      .toArray()

    return { exam, items }
  }

  async create(profileId: string, draft: ExamDraft): Promise<ExamWithItems> {
    const now = this.clock.nowIso()

    const result = await this.db.transaction(
      'rw',
      this.db.exams,
      this.db.examItems,
      async () => {
        if (draft.clientRequestId) {
          const existing = await this.db.exams
            .where('[profileId+clientRequestId]')
            .equals([profileId, draft.clientRequestId])
            .first()

          if (existing) {
            const items = await this.db.examItems
              .where('[profileId+examId]')
              .equals([profileId, existing.id])
              .toArray()
            return { exam: existing, items }
          }
        }

        const examId = createId()
        const items = this.buildItemRecords(profileId, examId, draft, now)
        const exam: Exam = {
          id: examId,
          profileId,
          examDate: draft.examDate,
          examTime: draft.examTime,
          hospital: draft.hospital,
          categoryCodes: [...new Set(items.map((item) => item.categoryCode))],
          notes: draft.notes,
          source: 'manual',
          clientRequestId: draft.clientRequestId,
          rev: 1,
          isDeleted: 0,
          createdAt: now,
          updatedAt: now,
        }

        await this.db.exams.add(exam)
        await this.db.examItems.bulkAdd(items)

        return { exam, items }
      },
    )

    this.afterWrite()
    return result
  }

  async update(profileId: string, examId: string, draft: ExamDraft): Promise<ExamWithItems> {
    const now = this.clock.nowIso()

    const result = await this.db.transaction(
      'rw',
      this.db.exams,
      this.db.examItems,
      this.db.examRevisions,
      async () => {
        const existing = await this.db.exams.get(examId)
        if (!existing || existing.profileId !== profileId || existing.isDeleted === 1) {
          throw new RepositoryError('exam-not-found', '检查记录不存在或已删除')
        }

        const previousItems = await this.db.examItems
          .where('[profileId+examId]')
          .equals([profileId, examId])
          .toArray()

        await this.addRevision(profileId, existing, previousItems, 'edit', now)
        await this.db.examItems
          .where('[profileId+examId]')
          .equals([profileId, examId])
          .delete()

        const items = this.buildItemRecords(profileId, examId, draft, now)
        await this.db.examItems.bulkAdd(items)

        const updated: Exam = {
          ...existing,
          examDate: draft.examDate,
          examTime: draft.examTime,
          hospital: draft.hospital,
          categoryCodes: [...new Set(items.map((item) => item.categoryCode))],
          notes: draft.notes,
          rev: existing.rev + 1,
          updatedAt: now,
        }

        await this.db.exams.put(updated)
        return { exam: updated, items }
      },
    )

    this.afterWrite()
    return result
  }

  async softDelete(profileId: string, examId: string): Promise<void> {
    const now = this.clock.nowIso()

    await this.db.transaction(
      'rw',
      this.db.exams,
      this.db.examItems,
      this.db.examRevisions,
      async () => {
        const existing = await this.db.exams.get(examId)
        if (!existing || existing.profileId !== profileId) {
          throw new RepositoryError('exam-not-found', '检查记录不存在')
        }
        if (existing.isDeleted === 1) return

        const items = await this.db.examItems
          .where('[profileId+examId]')
          .equals([profileId, examId])
          .toArray()

        await this.addRevision(profileId, existing, items, 'before-delete', now)
        await this.db.examItems
          .where('[profileId+examId]')
          .equals([profileId, examId])
          .modify({ isDeleted: 1, updatedAt: now })
        await this.db.exams.update(examId, {
          isDeleted: 1,
          deletedAt: now,
          rev: existing.rev + 1,
          updatedAt: now,
        })
      },
    )

    this.afterWrite()
  }

  async restore(profileId: string, examId: string): Promise<void> {
    const now = this.clock.nowIso()

    await this.db.transaction(
      'rw',
      this.db.exams,
      this.db.examItems,
      async () => {
        const existing = await this.db.exams.get(examId)
        if (!existing || existing.profileId !== profileId) {
          throw new RepositoryError('exam-not-found', '检查记录不存在')
        }
        if (existing.isDeleted === 0) return

        await this.db.examItems
          .where('[profileId+examId]')
          .equals([profileId, examId])
          .modify({ isDeleted: 0, updatedAt: now })
        await this.db.exams.update(examId, {
          isDeleted: 0,
          deletedAt: undefined,
          rev: existing.rev + 1,
          updatedAt: now,
        })
      },
    )

    this.afterWrite()
  }

  async purge(profileId: string, examId: string): Promise<void> {
    await this.db.transaction(
      'rw',
      this.db.exams,
      this.db.examItems,
      this.db.examRevisions,
      async () => {
        const existing = await this.db.exams.get(examId)
        if (!existing || existing.profileId !== profileId) return

        await this.db.examItems.where('[profileId+examId]').equals([profileId, examId]).delete()
        await this.db.examRevisions.where('examId').equals(examId).delete()
        await this.db.exams.delete(examId)
      },
    )
  }

  async listRevisions(profileId: string, examId: string): Promise<ExamRevision[]> {
    const revisions = await this.db.examRevisions.where('examId').equals(examId).toArray()
    return revisions
      .filter((revision) => revision.profileId === profileId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  }

  async getLatestItems(
    profileId: string,
    itemCodes: string[],
  ): Promise<Record<string, ExamItem | undefined>> {
    const result: Record<string, ExamItem | undefined> = {}

    for (const itemCode of itemCodes) {
      const items = await this.db.examItems
        .where('[profileId+itemCode+isDeleted+examDate]')
        .between(
          [profileId, itemCode, 0, Dexie.minKey],
          [profileId, itemCode, 0, Dexie.maxKey],
        )
        .toArray()

      items.sort(
        (left, right) =>
          right.examDate.localeCompare(left.examDate) ||
          right.createdAt.localeCompare(left.createdAt) ||
          right.id.localeCompare(left.id),
      )
      result[itemCode] = items[0]
    }

    return result
  }

  async count(profileId: string, includeDeleted = false): Promise<number> {
    if (includeDeleted) {
      return this.db.exams.where('profileId').equals(profileId).count()
    }
    return this.db.exams.where('[profileId+isDeleted]').equals([profileId, 0]).count()
  }

  async purgeExpiredTrash(
    profileId: string,
    retentionDays = TRASH_RETENTION_DAYS,
  ): Promise<number> {
    const cutoff = new Date(
      this.clock.now().getTime() - retentionDays * 86_400_000,
    ).toISOString()

    const deleted = await this.db.exams
      .where('[profileId+isDeleted]')
      .equals([profileId, 1])
      .toArray()

    const expired = deleted.filter((exam) => (exam.deletedAt ?? exam.updatedAt) <= cutoff)
    if (expired.length === 0) return 0

    await this.db.transaction(
      'rw',
      this.db.exams,
      this.db.examItems,
      this.db.examRevisions,
      async () => {
        for (const exam of expired) {
          await this.db.examItems
            .where('[profileId+examId]')
            .equals([profileId, exam.id])
            .delete()
          await this.db.examRevisions.where('examId').equals(exam.id).delete()
          await this.db.exams.delete(exam.id)
        }
      },
    )

    return expired.length
  }

  private buildItemRecords(
    profileId: string,
    examId: string,
    draft: ExamDraft,
    now: string,
  ): ExamItem[] {
    return draft.items.map((item) => ({
      id: createId(),
      profileId,
      examId,
      examDate: draft.examDate,
      categoryCode: item.categoryCode,
      itemCode: item.itemCode,
      itemName: item.itemName,
      valueText: item.valueText,
      valueNumber: item.valueNumber,
      valueOperator: item.valueOperator,
      unit: item.unit,
      refLow: item.refLow,
      refHigh: item.refHigh,
      refText: item.refText,
      flag: item.flag,
      isDeleted: 0,
      createdAt: now,
      updatedAt: now,
    }))
  }

  private async addRevision(
    profileId: string,
    exam: Exam,
    items: ExamItem[],
    reason: ExamRevision['reason'],
    now: string,
  ): Promise<void> {
    const revision: ExamRevision = {
      id: createId(),
      profileId,
      examId: exam.id,
      rev: exam.rev,
      snapshot: JSON.stringify({ exam, items }),
      reason,
      createdAt: now,
    }
    await this.db.examRevisions.add(revision)
    await this.pruneRevisions(exam.id)
  }

  private async pruneRevisions(examId: string): Promise<void> {
    const revisions = await this.db.examRevisions.where('examId').equals(examId).toArray()
    if (revisions.length <= EXAM_REVISION_LIMIT) return

    revisions.sort(
      (left, right) =>
        left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id),
    )
    const excess = revisions.slice(0, revisions.length - EXAM_REVISION_LIMIT)
    await this.db.examRevisions.bulkDelete(excess.map((revision) => revision.id))
  }

  private afterWrite(): void {
    void requestPersistentStorage()
  }
}
