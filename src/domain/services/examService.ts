import { HOME_SUMMARY_ITEM_CODES, TRASH_RETENTION_DAYS } from '@/constants/data'
import { buildExamDraft } from '@/domain/examDraft'
import type { ExamInput, ExamRevision } from '@/domain/models'
import type {
  ExamListOptions,
  ExamRepository,
  ExamSummary,
  ExamWithItems,
} from '@/data/repositories/types'

export class ExamService {
  private readonly repository: ExamRepository

  constructor(repository: ExamRepository) {
    this.repository = repository
  }

  async create(profileId: string, input: ExamInput): Promise<ExamWithItems> {
    return this.repository.create(profileId, buildExamDraft(input))
  }

  async update(profileId: string, examId: string, input: ExamInput): Promise<ExamWithItems> {
    return this.repository.update(profileId, examId, buildExamDraft(input))
  }

  get(profileId: string, examId: string): Promise<ExamWithItems | undefined> {
    return this.repository.get(profileId, examId)
  }

  list(profileId: string, options?: ExamListOptions) {
    return this.repository.list(profileId, options)
  }

  listDeleted(profileId: string) {
    return this.repository.listDeleted(profileId)
  }

  softDelete(profileId: string, examId: string): Promise<void> {
    return this.repository.softDelete(profileId, examId)
  }

  restore(profileId: string, examId: string): Promise<void> {
    return this.repository.restore(profileId, examId)
  }

  purge(profileId: string, examId: string): Promise<void> {
    return this.repository.purge(profileId, examId)
  }

  listRevisions(profileId: string, examId: string): Promise<ExamRevision[]> {
    return this.repository.listRevisions(profileId, examId)
  }

  purgeExpiredTrash(
    profileId: string,
    retentionDays: number = TRASH_RETENTION_DAYS,
  ): Promise<number> {
    return this.repository.purgeExpiredTrash(profileId, retentionDays)
  }

  async getSummary(profileId: string): Promise<ExamSummary> {
    const [exams, latestItems, totalExams] = await Promise.all([
      this.repository.list(profileId, { limit: 1 }),
      this.repository.getLatestItems(profileId, [...HOME_SUMMARY_ITEM_CODES]),
      this.repository.count(profileId),
    ])

    return { lastExam: exams[0], latestItems, totalExams }
  }
}
