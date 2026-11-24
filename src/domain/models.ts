export type IsoDateTime = string
export type DateOnly = string
export type TimeOnly = string

export type Flag = 'low' | 'high' | 'normal' | 'unknown'
export type ValueOperator = 'lt' | 'lte' | 'gt' | 'gte'

export interface Profile {
  id: string
  displayName?: string
  birthYear?: number
  sex?: 'female' | 'male' | 'unknown'
  heightCm?: number
  diagnosisDate?: DateOnly
  kidneyType?: string
  diagnosisHospital?: string
  medicalHistory?: string
  allergies?: string
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export interface ExamItemInput {
  itemCode: string
  itemName?: string
  categoryCode?: string
  valueText: string
  unit?: string
  refLow?: number | null
  refHigh?: number | null
  refText?: string
}

export interface ExamInput {
  examDate: DateOnly
  examTime?: TimeOnly
  hospital?: string
  notes?: string
  clientRequestId?: string
  items: ExamItemInput[]
}

/** 服务层归一化后的指标草稿，仓储据此落库。 */
export interface ExamItemDraft {
  itemCode: string
  itemName: string
  categoryCode: string
  valueText: string
  valueNumber?: number
  valueOperator?: ValueOperator
  unit: string
  refLow?: number
  refHigh?: number
  refText?: string
  flag: Flag
}

export interface ExamDraft {
  examDate: DateOnly
  examTime?: TimeOnly
  hospital?: string
  notes?: string
  clientRequestId?: string
  items: ExamItemDraft[]
}

export interface Exam {
  id: string
  profileId: string
  examDate: DateOnly
  examTime?: TimeOnly
  hospital?: string
  categoryCodes: string[]
  notes?: string
  source: 'manual' | 'import' | 'demo'
  clientRequestId?: string
  rev: number
  isDeleted: 0 | 1
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
  deletedAt?: IsoDateTime
}

export interface ExamItem {
  id: string
  profileId: string
  examId: string
  examDate: DateOnly
  categoryCode: string
  itemCode: string
  itemName: string
  valueText: string
  valueNumber?: number
  valueOperator?: ValueOperator
  unit: string
  refLow?: number
  refHigh?: number
  refText?: string
  flag: Flag
  isDeleted: 0 | 1
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export interface ExamRevision {
  id: string
  profileId: string
  examId: string
  rev: number
  /** 被替换的检查 + 指标 JSON 快照。 */
  snapshot: string
  reason: 'edit' | 'before-delete'
  createdAt: IsoDateTime
}

export interface Medication {
  id: string
  profileId: string
  groupId: string
  drugName: string
  category: string
  specification?: string
  dosePerTake?: number
  doseUnit?: string
  timesPerDay?: number
  intakeTimes?: string[]
  startDate: DateOnly
  endDate?: DateOnly
  hospital?: string
  changeReason?: string
  adverseReactions?: string
  notes?: string
  previousId?: string
  status: 'active' | 'ended' | 'stopped'
  rev: number
  isDeleted: 0 | 1
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export interface DailyRecord {
  id: string
  profileId: string
  recordDate: DateOnly
  recordTime?: TimeOnly
  systolic?: number
  diastolic?: number
  heartRate?: number
  weightKg?: number
  edema?: 'none' | 'mild' | 'moderate' | 'severe' | 'unknown'
  urineAppearance?: 'clear' | 'cloudy' | 'foamy' | 'red' | 'brown' | 'other' | 'unknown'
  notes?: string
  rev: number
  isDeleted: 0 | 1
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export interface FollowUp {
  id: string
  profileId: string
  plannedDate: DateOnly
  items: string[]
  hospital?: string
  notes?: string
  status: 'planned' | 'completed' | 'cancelled'
  completedExamId?: string
  completedAt?: IsoDateTime
  rev: number
  isDeleted: 0 | 1
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export type MestCValue = 0 | 1 | 2 | 'unknown' | 'not_reported'

export interface MestC {
  m: MestCValue
  e: MestCValue
  s: MestCValue
  t: MestCValue
  c: MestCValue
}

export interface Biopsy {
  id: string
  profileId: string
  biopsyDate?: DateOnly
  hospital?: string
  leeGrade?: 'I' | 'II' | 'III' | 'IV' | 'V' | 'unknown'
  mestC: MestC
  reportNotes?: string
  rev: number
  isDeleted: 0 | 1
  createdAt: IsoDateTime
  updatedAt: IsoDateTime
}

export interface BackupMeta {
  id: string
  lastExportAt?: IsoDateTime
  lastConfirmedBackupAt?: IsoDateTime
  changesSinceBackup: number
  lastRestoreAt?: IsoDateTime
  lastSnapshotAt?: IsoDateTime
}

export interface AppSettings {
  id: string
  backupReminderDays: number
  onboardingAcceptedAt?: IsoDateTime
  demoMode?: boolean
  activeProfileId: string
  appVersion: string
}

export interface SnapshotRecord {
  id: string
  createdAt: IsoDateTime
  reason: 'pre-import' | 'manual' | 'pre-migration'
  schemaVersion: number
  payload: unknown
  counts?: Record<string, number>
  size?: number
}

export interface OutboxItem {
  id: string
  entityType: string
  entityId: string
  action: string
  updatedAt: IsoDateTime
  syncedAt?: IsoDateTime
}
