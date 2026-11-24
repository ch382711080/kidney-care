import { describe, expect, it } from 'vitest'
import { computeFlag, normalizeUnit, parseLabValue } from '@/domain/labValue'

describe('parseLabValue', () => {
  it('parses plain numbers', () => {
    expect(parseLabValue('88')).toEqual({ valueText: '88', valueNumber: 88 })
    expect(parseLabValue(' 0.15 ')).toEqual({ valueText: '0.15', valueNumber: 0.15 })
  })

  it('parses inequality values and keeps the original text', () => {
    expect(parseLabValue('<0.15')).toEqual({
      valueText: '<0.15',
      valueNumber: 0.15,
      valueOperator: 'lt',
    })
    expect(parseLabValue('≤0.15')).toMatchObject({ valueNumber: 0.15, valueOperator: 'lte' })
    expect(parseLabValue('＞3.5')).toMatchObject({ valueNumber: 3.5, valueOperator: 'gt' })
    expect(parseLabValue('>=10')).toMatchObject({ valueNumber: 10, valueOperator: 'gte' })
  })

  it('strips lab arrows for numeric parsing but keeps them in valueText', () => {
    expect(parseLabValue('1.2↑')).toEqual({ valueText: '1.2↑', valueNumber: 1.2 })
    expect(parseLabValue('0.8↓')).toEqual({ valueText: '0.8↓', valueNumber: 0.8 })
  })

  it('keeps qualitative text without valueNumber', () => {
    expect(parseLabValue('1+')).toEqual({ valueText: '1+' })
    expect(parseLabValue('阴性')).toEqual({ valueText: '阴性' })
    expect(parseLabValue('')).toEqual({ valueText: '' })
    expect(parseLabValue('<0.15mg/L')).toEqual({ valueText: '<0.15mg/L' })
  })
})

describe('computeFlag', () => {
  it('compares exact values against the report reference range only', () => {
    expect(computeFlag({ valueNumber: 88, refLow: 57, refHigh: 97 })).toBe('normal')
    expect(computeFlag({ valueNumber: 120, refLow: 57, refHigh: 97 })).toBe('high')
    expect(computeFlag({ valueNumber: 40, refLow: 57, refHigh: 97 })).toBe('low')
    expect(computeFlag({ valueNumber: 120, refHigh: 97 })).toBe('high')
  })

  it('returns unknown without enough information or for inequality values', () => {
    expect(computeFlag({ valueNumber: 88 })).toBe('unknown')
    expect(computeFlag({})).toBe('unknown')
    expect(computeFlag({ valueNumber: 0.15, valueOperator: 'lt', refHigh: 0.15 })).toBe('unknown')
  })
})

describe('normalizeUnit', () => {
  it('matches known units case-insensitively', () => {
    expect(normalizeUnit('g/l', ['g/L', 'g/dL'])).toBe('g/L')
    expect(normalizeUnit('mg/L', ['g/L'])).toBe('mg/L')
    expect(normalizeUnit('', ['g/L'])).toBe('')
  })
})
