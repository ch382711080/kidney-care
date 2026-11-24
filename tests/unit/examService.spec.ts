import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { PROFILE_ID } from '@/constants/data'
import { KidneyCareDB } from '@/data/db'
import { LocalExamRepository } from '@/data/repositories/local/examRepository'
import { LocalProfileRepository } from '@/data/repositories/local/profileRepository'
import { LocalSettingsRepository } from '@/data/repositories/local/settingsRepository'
import type { Clock } from '@/domain/clock'
import { ExamValidationError } from '@/domain/examDraft'
import type { Exam, ExamInput, ExamItem } from '@/domain/models'
import { ExamService } from '@/domain/services/examService'

let sequence = 0
let db: KidneyCareDB
let service: ExamService
let profileRepository: LocalProfileRepository
let clockNow: Date

const clock: Clock = {
  now: () => clockNow,
  nowIso: () => clockNow.toISOString(),
  today: () => '2026-01-02',
}

function examInput(overrides: Partial<ExamInput> = {}): ExamInput {
  return {
    examDate: '2026-01-02',
    items: [
      {
        itemCode: 'scr',
        valueText: '88',
        unit: 'μmol/L',
        refLow: 57,
        refHigh: 97,
      },
    ],
    ...overrides,
  }
}

beforeEach(async () => {
  sequence += 1
  db = new KidneyCareDB(`kidney-care-test-${sequence}`)
  clockNow = new Date('2026-01-02T03:04:05.000Z')
  service = new ExamService(new LocalExamRepository(db, clock))
  profileRepository = new LocalProfileRepository(db, clock)
  await db.open()
})

afterEach(async () => {
  await db.delete()
})

describe('exam service', () => {
  it('creates an exam with parsed items and derived categories', async () => {
    const { exam, items } = await service.create(PROFILE_ID, examInput())

    expect(exam.rev).toBe(1)
    expect(exam.isDeleted).toBe(0)
    expect(exam.categoryCodes).toEqual(['kidney'])
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      itemCode: 'scr',
      itemName: '血肌酐',
      categoryCode: 'kidney',
      valueNumber: 88,
      unit: 'μmol/L',
      flag: 'normal',
      isDeleted: 0,
    })
    expect(await db.exams.count()).toBe(1)
    expect(await db.examItems.count()).toBe(1)
  })

  it('keeps inequality values honest', async () => {
    const { items } = await service.create(
      PROFILE_ID,
      examInput({
        items: [
          {
            itemCode: 'urine_protein_24h',
            valueText: '<0.15',
            unit: 'g/24h',
            refHigh: 0.15,
          },
        ],
      }),
    )

    expect(items[0]).toMatchObject({
      valueText: '<0.15',
      valueNumber: 0.15,
      valueOperator: 'lt',
      flag: 'unknown',
    })
  })

  it('does not assign numbers to qualitative indicators', async () => {
    const { items } = await service.create(
      PROFILE_ID,
      examInput({
        items: [{ itemCode: 'urine_protein_qual', valueText: '1+', unit: '' }],
      }),
    )

    expect(items[0]!.valueNumber).toBeUndefined()
    expect(items[0]!.valueText).toBe('1+')
    expect(items[0]!.flag).toBe('unknown')
  })

  it('allows multiple exams on the same day and sorts newest first', async () => {
    const first = await service.create(PROFILE_ID, examInput({ notes: '上午' }))
    clockNow = new Date('2026-01-02T05:00:00.000Z')
    const second = await service.create(PROFILE_ID, examInput({ notes: '下午' }))

    const exams = await service.list(PROFILE_ID)
    expect(exams).toHaveLength(2)
    expect(exams[0]!.id).toBe(second.exam.id)
    expect(exams[1]!.id).toBe(first.exam.id)
  })

  it('is idempotent when clientRequestId repeats', async () => {
    const first = await service.create(PROFILE_ID, examInput({ clientRequestId: 'request-1' }))
    const second = await service.create(PROFILE_ID, examInput({ clientRequestId: 'request-1' }))

    expect(second.exam.id).toBe(first.exam.id)
    expect(await db.exams.count()).toBe(1)
  })

  it('writes a revision and replaces items on update', async () => {
    const created = await service.create(PROFILE_ID, examInput())
    clockNow = new Date('2026-01-02T04:00:00.000Z')

    const updated = await service.update(
      PROFILE_ID,
      created.exam.id,
      examInput({
        items: [{ itemCode: 'scr', valueText: '95', refLow: 57, refHigh: 97 }],
      }),
    )

    expect(updated.exam.rev).toBe(2)
    expect(updated.items[0]!.valueNumber).toBe(95)
    expect(await db.examItems.count()).toBe(1)

    const revisions = await service.listRevisions(PROFILE_ID, created.exam.id)
    expect(revisions).toHaveLength(1)
    expect(revisions[0]).toMatchObject({ rev: 1, reason: 'edit' })

    const snapshot = JSON.parse(revisions[0]!.snapshot) as { exam: Exam; items: ExamItem[] }
    expect(snapshot.exam.rev).toBe(1)
    expect(snapshot.items[0]!.valueText).toBe('88')
  })

  it('keeps at most 20 revisions per exam', async () => {
    const created = await service.create(PROFILE_ID, examInput())

    for (let index = 0; index < 25; index += 1) {
      clockNow = new Date(Date.UTC(2026, 0, 2, 4, index, 0))
      await service.update(PROFILE_ID, created.exam.id, examInput())
    }

    const revisions = await service.listRevisions(PROFILE_ID, created.exam.id)
    expect(revisions).toHaveLength(20)
  })

  it('soft deletes and restores the exam with its items', async () => {
    const created = await service.create(PROFILE_ID, examInput())

    await service.softDelete(PROFILE_ID, created.exam.id)
    expect(await service.list(PROFILE_ID)).toHaveLength(0)
    expect(await service.listDeleted(PROFILE_ID)).toHaveLength(1)

    const deleted = await service.get(PROFILE_ID, created.exam.id)
    expect(deleted?.exam.isDeleted).toBe(1)
    expect(deleted?.items.every((item) => item.isDeleted === 1)).toBe(true)

    const revisions = await service.listRevisions(PROFILE_ID, created.exam.id)
    expect(revisions[0]!.reason).toBe('before-delete')

    await service.restore(PROFILE_ID, created.exam.id)
    expect(await service.list(PROFILE_ID)).toHaveLength(1)
    const restored = await service.get(PROFILE_ID, created.exam.id)
    expect(restored?.exam.isDeleted).toBe(0)
    expect(restored?.items.every((item) => item.isDeleted === 0)).toBe(true)
  })

  it('purges deleted exams permanently', async () => {
    const created = await service.create(PROFILE_ID, examInput())
    await service.softDelete(PROFILE_ID, created.exam.id)
    await service.purge(PROFILE_ID, created.exam.id)

    expect(await db.exams.count()).toBe(0)
    expect(await db.examItems.count()).toBe(0)
    expect(await db.examRevisions.count()).toBe(0)
  })

  it('purges only trash older than the retention window', async () => {
    const created = await service.create(PROFILE_ID, examInput())
    await service.softDelete(PROFILE_ID, created.exam.id)

    clockNow = new Date('2026-01-20T00:00:00.000Z')
    expect(await service.purgeExpiredTrash(PROFILE_ID)).toBe(0)
    expect(await db.exams.count()).toBe(1)

    clockNow = new Date('2026-02-10T00:00:00.000Z')
    expect(await service.purgeExpiredTrash(PROFILE_ID)).toBe(1)
    expect(await db.exams.count()).toBe(0)
  })

  it('returns the latest non-deleted value for the home summary', async () => {
    await service.create(
      PROFILE_ID,
      examInput({
        examDate: '2026-01-01',
        items: [{ itemCode: 'scr', valueText: '100' }],
      }),
    )
    const newer = await service.create(
      PROFILE_ID,
      examInput({
        examDate: '2026-02-01',
        items: [{ itemCode: 'scr', valueText: '90' }],
      }),
    )

    const summary = await service.getSummary(PROFILE_ID)
    expect(summary.totalExams).toBe(2)
    expect(summary.lastExam?.id).toBe(newer.exam.id)
    expect(summary.latestItems.scr?.valueNumber).toBe(90)

    await service.softDelete(PROFILE_ID, newer.exam.id)
    const afterDelete = await service.getSummary(PROFILE_ID)
    expect(afterDelete.latestItems.scr?.valueNumber).toBe(100)
    expect(afterDelete.totalExams).toBe(1)
  })

  it('rejects invalid exam input before writing', async () => {
    await expect(
      service.create(PROFILE_ID, { examDate: '2026-02-30', items: [] }),
    ).rejects.toMatchObject({ code: 'invalid-date' })
    expect(await db.exams.count()).toBe(0)

    await expect(
      service.create(PROFILE_ID, examInput({ items: [] })),
    ).rejects.toMatchObject({ code: 'empty-items' })

    await expect(
      service.create(
        PROFILE_ID,
        examInput({
          items: [
            { itemCode: 'scr', valueText: '88' },
            { itemCode: 'scr', valueText: '90' },
          ],
        }),
      ),
    ).rejects.toMatchObject({ code: 'duplicate-item' })

    await expect(
      service.create(
        PROFILE_ID,
        examInput({
          items: [{ itemCode: 'scr', valueText: '88', refLow: 100, refHigh: 50 }],
        }),
      ),
    ).rejects.toMatchObject({ code: 'invalid-ref-range' })
    expect(await db.exams.count()).toBe(0)
  })

  it('exposes validation errors as ExamValidationError', async () => {
    await expect(service.create(PROFILE_ID, examInput({ items: [] }))).rejects.toBeInstanceOf(
      ExamValidationError,
    )
  })
})

describe('profile repository', () => {
  it('creates and updates the local profile', async () => {
    const created = await profileRepository.ensure(PROFILE_ID)
    expect(created.id).toBe(PROFILE_ID)

    const updated = await profileRepository.update(PROFILE_ID, {
      birthYear: 1990,
      sex: 'female',
      kidneyType: 'IgA 肾病',
    })
    expect(updated).toMatchObject({ birthYear: 1990, sex: 'female' })

    expect(await profileRepository.get(PROFILE_ID)).toMatchObject({
      birthYear: 1990,
      kidneyType: 'IgA 肾病',
    })
  })
})

describe('settings repository', () => {
  it('returns defaults and persists updates', async () => {
    const settingsRepository = new LocalSettingsRepository(db)

    const defaults = await settingsRepository.get(PROFILE_ID)
    expect(defaults).toMatchObject({
      id: PROFILE_ID,
      backupReminderDays: 7,
      activeProfileId: PROFILE_ID,
    })

    const updated = await settingsRepository.update(PROFILE_ID, { backupReminderDays: 14 })
    expect(updated.backupReminderDays).toBe(14)
    expect(await settingsRepository.get(PROFILE_ID)).toMatchObject({ backupReminderDays: 14 })
  })
})

describe('schema regressions', () => {
  it('indexes biopsies without a date under profileId+isDeleted', async () => {
    const now = clock.nowIso()
    await db.biopsies.put({
      id: 'biopsy-without-date',
      profileId: PROFILE_ID,
      mestC: { m: 'unknown', e: 'unknown', s: 'unknown', t: 'unknown', c: 'unknown' },
      rev: 1,
      isDeleted: 0,
      createdAt: now,
      updatedAt: now,
    })

    const rows = await db.biopsies
      .where('[profileId+isDeleted]')
      .equals([PROFILE_ID, 0])
      .toArray()
    expect(rows).toHaveLength(1)
  })
})
