import { systemClock } from '@/domain/clock'
import { ExamService } from '@/domain/services/examService'
import { KidneyCareDB } from './db'
import { LocalExamRepository } from './repositories/local/examRepository'
import { LocalProfileRepository } from './repositories/local/profileRepository'
import { LocalSettingsRepository } from './repositories/local/settingsRepository'

export const db = new KidneyCareDB()

export const profileRepository = new LocalProfileRepository(db, systemClock)
export const examRepository = new LocalExamRepository(db, systemClock)
export const settingsRepository = new LocalSettingsRepository(db)

export const examService = new ExamService(examRepository)
