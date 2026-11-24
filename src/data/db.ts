import Dexie, { type EntityTable } from 'dexie'
import { DB_NAME } from '@/constants/data'
import type {
  AppSettings,
  BackupMeta,
  Biopsy,
  DailyRecord,
  Exam,
  ExamItem,
  ExamRevision,
  FollowUp,
  Medication,
  OutboxItem,
  Profile,
  SnapshotRecord,
} from '@/domain/models'

export class KidneyCareDB extends Dexie {
  profiles!: EntityTable<Profile, 'id'>
  exams!: EntityTable<Exam, 'id'>
  examItems!: EntityTable<ExamItem, 'id'>
  examRevisions!: EntityTable<ExamRevision, 'id'>
  medications!: EntityTable<Medication, 'id'>
  dailyRecords!: EntityTable<DailyRecord, 'id'>
  followUps!: EntityTable<FollowUp, 'id'>
  biopsies!: EntityTable<Biopsy, 'id'>
  backupMeta!: EntityTable<BackupMeta, 'id'>
  settings!: EntityTable<AppSettings, 'id'>
  snapshots!: EntityTable<SnapshotRecord, 'id'>
  outbox!: EntityTable<OutboxItem, 'id'>

  constructor(name: string = DB_NAME) {
    super(name)

    this.version(1).stores({
      profiles: 'id, updatedAt',
      exams:
        'id, profileId, [profileId+isDeleted+examDate], [profileId+isDeleted], [profileId+clientRequestId], updatedAt',
      examItems:
        'id, profileId, examId, [profileId+itemCode+isDeleted+examDate], [profileId+examId], updatedAt',
      examRevisions: 'id, profileId, examId, createdAt',
      medications:
        'id, profileId, [profileId+groupId+startDate], [profileId+startDate], [profileId+status], updatedAt',
      dailyRecords: 'id, profileId, [profileId+isDeleted+recordDate], updatedAt',
      followUps: 'id, profileId, [profileId+isDeleted+plannedDate], [profileId+status], updatedAt',
      biopsies: 'id, profileId, [profileId+isDeleted], updatedAt',
      backupMeta: 'id',
      settings: 'id',
      snapshots: 'id, createdAt',
      outbox: 'id, [syncedAt+updatedAt]',
    })
  }
}
