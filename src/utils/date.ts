import type { DateOnly } from '@/domain/models'

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const TIME_ONLY_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export function isValidDateOnly(value: string): value is DateOnly {
  const match = DATE_ONLY_PATTERN.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export function isValidTimeOnly(value: string): boolean {
  return TIME_ONLY_PATTERN.test(value)
}

/** 以本地时区输出 YYYY-MM-DD，避免 toISOString() 的 UTC 偏移导致日期漂移。 */
export function toDateOnly(date: Date): DateOnly {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayDate(date: Date = new Date()): DateOnly {
  return toDateOnly(date)
}

/** 在两个本地日期之间加减天数，使用 UTC 计算以避开夏令时。 */
export function addDays(dateOnly: DateOnly, days: number): DateOnly {
  const match = DATE_ONLY_PATTERN.exec(dateOnly)
  if (!match) return dateOnly

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  date.setUTCDate(date.getUTCDate() + days)

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** 返回 from → to 的整天数，to 晚于 from 时为正数。 */
export function daysBetween(from: DateOnly, to: DateOnly): number {
  const fromTime = Date.parse(`${from}T00:00:00Z`)
  const toTime = Date.parse(`${to}T00:00:00Z`)
  if (Number.isNaN(fromTime) || Number.isNaN(toTime)) return 0
  return Math.round((toTime - fromTime) / 86_400_000)
}
