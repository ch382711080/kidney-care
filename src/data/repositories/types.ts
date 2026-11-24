import type {
  AppSettings,
  Exam,
  ExamDraft,
  ExamItem,
  ExamRevision,
  Profile,
} from '@/domain/models'

export type RepositoryErrorCode = 'exam-not-found' | 'profile-not-found' | 'write-failed'

export class RepositoryError extends Error {
  readonly code: RepositoryErrorCode

  constructor(code: RepositoryErrorCode, message: string) {
    super(message)
    this.name = 'RepositoryError'
    this.code = code
  }
}

export interface ExamWithItems {
  exam: Exam
  items: ExamItem[]
}

export interface ExamListOptions {
  includeDeleted?: boolean
  categoryCode?: string
  limit?: number
}

export interface ExamSummary {
  lastExam?: Exam
  latestItems: Record<string, ExamItem | undefined>
  totalExams: number
}

export interface ExamRepository {
  list(profileId: string, options?: ExamListOptions): Promise<Exam[]>
  listDeleted(profileId: string): Promise<Exam[]>
  get(profileId: string, examId: string): Promise<ExamWithItems | undefined>
  create(profileId: string, draft: ExamDraft): Promise<ExamWithItems>
  update(profileId: string, examId: string, draft: ExamDraft): Promise<ExamWithItems>
  softDelete(profileId: string, examId: string): Promise<void>
  restore(profileId: string, examId: string): Promise<void>
  purge(profileId: string, examId: string): Promise<void>
  listRevisions(profileId: string, examId: string): Promise<ExamRevision[]>
  getLatestItems(
    profileId: string,
    itemCodes: string[],
  ): Promise<Record<string, ExamItem | undefined>>
  count(profileId: string, includeDeleted?: boolean): Promise<number>
  purgeExpiredTrash(profileId: string, retentionDays: number): Promise<number>
}

export type ProfilePatch = Partial<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>

export interface ProfileRepository {
  get(profileId: string): Promise<Profile | undefined>
  ensure(profileId: string): Promise<Profile>
  update(profileId: string, patch: ProfilePatch): Promise<Profile>
}

export type SettingsPatch = Partial<Omit<AppSettings, 'id'>>

export interface SettingsRepository {
  get(profileId: string): Promise<AppSettings>
  ensure(profileId: string): Promise<AppSettings>
  update(profileId: string, patch: SettingsPatch): Promise<AppSettings>
}
