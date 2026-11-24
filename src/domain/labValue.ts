import type { Flag, ValueOperator } from '@/domain/models'

export interface ParsedLabValue {
  valueText: string
  valueNumber?: number
  valueOperator?: ValueOperator
}

const NUMBER_PATTERN = /^-?\d+(?:\.\d+)?$/
const OPERATOR_PATTERN = /^(<=|>=|≤|≥|<|>)/
const ARROW_PATTERN = /[↑↓]/g

function normalizeOperators(value: string): string {
  return value
    .replace(/＜/g, '<')
    .replace(/＞/g, '>')
    .replace(/≦/g, '≤')
    .replace(/≧/g, '≥')
}

function toOperator(symbol: string): ValueOperator {
  switch (symbol) {
    case '<=':
    case '≤':
      return 'lte'
    case '>=':
    case '≥':
      return 'gte'
    case '<':
      return 'lt'
    default:
      return 'gt'
  }
}

/**
 * 解析化验单原文。
 *
 * - `valueText` 永远保留用户输入的原文；
 * - 只有“可选不等式 + 数字”的完整文本才写 `valueNumber`；
 * - `1+`、`阴性`、`0.15mg/L（参考）` 等保持文本，不参与折线图。
 */
export function parseLabValue(raw: string): ParsedLabValue {
  const valueText = raw.trim()
  if (!valueText) return { valueText }

  const normalized = normalizeOperators(valueText).replace(ARROW_PATTERN, '').trim()
  const operatorMatch = OPERATOR_PATTERN.exec(normalized)

  if (operatorMatch) {
    const rest = normalized.slice(operatorMatch[0].length).trim()
    if (NUMBER_PATTERN.test(rest)) {
      return {
        valueText,
        valueNumber: Number(rest),
        valueOperator: toOperator(operatorMatch[0]),
      }
    }
    return { valueText }
  }

  if (NUMBER_PATTERN.test(normalized)) {
    return { valueText, valueNumber: Number(normalized) }
  }

  return { valueText }
}

/**
 * 只相对于本次化验单的参考范围计算，不表示病情。
 * 不等式值不判断高低，避免把 `<0.15` 误当成精确值。
 */
export function computeFlag(input: {
  valueNumber?: number
  valueOperator?: ValueOperator
  refLow?: number
  refHigh?: number
}): Flag {
  const { valueNumber, valueOperator, refLow, refHigh } = input

  if (valueNumber === undefined || valueOperator) return 'unknown'
  if (refLow === undefined && refHigh === undefined) return 'unknown'
  if (refLow !== undefined && valueNumber < refLow) return 'low'
  if (refHigh !== undefined && valueNumber > refHigh) return 'high'
  return 'normal'
}

/** 在已知单位表内做大小写归一，未知单位原样保留。 */
export function normalizeUnit(raw: string | undefined, allowed: readonly string[]): string {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return ''
  return allowed.find((unit) => unit.toLowerCase() === trimmed.toLowerCase()) ?? trimmed
}
