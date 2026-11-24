import { describe, expect, it } from 'vitest'
import {
  addDays,
  daysBetween,
  isValidDateOnly,
  isValidTimeOnly,
  toDateOnly,
} from '@/utils/date'

describe('date utilities', () => {
  it('validates real calendar dates only', () => {
    expect(isValidDateOnly('2026-01-02')).toBe(true)
    expect(isValidDateOnly('2024-02-29')).toBe(true)
    expect(isValidDateOnly('2026-02-29')).toBe(false)
    expect(isValidDateOnly('2026-02-30')).toBe(false)
    expect(isValidDateOnly('2026-1-2')).toBe(false)
  })

  it('formats dates in local time without UTC drift', () => {
    const lateNight = new Date(2026, 0, 2, 23, 30, 0)
    expect(toDateOnly(lateNight)).toBe('2026-01-02')
  })

  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29')
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('counts whole days between date-only values', () => {
    expect(daysBetween('2026-01-01', '2026-01-31')).toBe(30)
    expect(daysBetween('2026-02-01', '2026-01-01')).toBe(-31)
    expect(daysBetween('2026-01-01', '2026-01-01')).toBe(0)
  })

  it('validates time-only values', () => {
    expect(isValidTimeOnly('00:00')).toBe(true)
    expect(isValidTimeOnly('23:59')).toBe(true)
    expect(isValidTimeOnly('24:00')).toBe(false)
    expect(isValidTimeOnly('8:30')).toBe(false)
  })
})
