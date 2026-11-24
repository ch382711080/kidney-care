import { todayDate } from '@/utils/date'
import type { DateOnly, IsoDateTime } from './models'

export interface Clock {
  now(): Date
  nowIso(): IsoDateTime
  today(): DateOnly
}

export const systemClock: Clock = {
  now: () => new Date(),
  nowIso: () => new Date().toISOString(),
  today: () => todayDate(),
}
