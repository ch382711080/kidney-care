import { describe, expect, it } from 'vitest'
import {
  COMMON_INDICATOR_CODES,
  getIndicator,
  getIndicatorCategory,
  INDICATOR_CATEGORIES,
  INDICATORS,
  TREND_INDICATOR_CODES,
} from '@/constants/indicators'

describe('indicator catalog', () => {
  it('has unique category codes', () => {
    const codes = INDICATOR_CATEGORIES.map((category) => category.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('has unique indicator codes', () => {
    const codes = INDICATORS.map((indicator) => indicator.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('binds every indicator to an existing category', () => {
    for (const indicator of INDICATORS) {
      expect(getIndicatorCategory(indicator.categoryCode), indicator.code).toBeDefined()
    }
  })

  it('keeps units consistent with value type', () => {
    for (const indicator of INDICATORS) {
      if (indicator.valueType === 'numeric') {
        expect(indicator.defaultUnit, indicator.code).toBeTruthy()
        expect(indicator.units.length, indicator.code).toBeGreaterThan(0)
        expect(indicator.units, indicator.code).toContain(indicator.defaultUnit)
      } else {
        expect(indicator.units, indicator.code).toHaveLength(0)
      }
    }
  })

  it('has resolvable common indicators', () => {
    expect(COMMON_INDICATOR_CODES.length).toBeGreaterThan(0)
    for (const code of COMMON_INDICATOR_CODES) {
      expect(getIndicator(code), code).toBeDefined()
    }
  })

  it('has resolvable trend indicators', () => {
    for (const code of TREND_INDICATOR_CODES) {
      expect(getIndicator(code), code).toBeDefined()
    }
  })
})
