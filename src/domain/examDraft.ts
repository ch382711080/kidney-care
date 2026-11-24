import { getIndicator } from '@/constants/indicators'
import { isValidDateOnly, isValidTimeOnly } from '@/utils/date'
import { computeFlag, normalizeUnit, parseLabValue } from './labValue'
import type { ExamDraft, ExamInput, ExamItemDraft } from './models'

const MAX_ITEMS = 200
const MAX_VALUE_LENGTH = 100

/** 去掉不可见控制字符，但保留换行与制表符，便于备注多行输入。 */
function stripControlCharacters(value: string): string {
  let result = ''
  for (const character of value) {
    const code = character.charCodeAt(0)
    const isAllowed = code === 9 || code === 10 || (code >= 32 && code !== 127)
    if (isAllowed) result += character
  }
  return result
}

export type ExamValidationCode =
  | 'invalid-date'
  | 'invalid-time'
  | 'empty-items'
  | 'too-many-items'
  | 'duplicate-item'
  | 'invalid-item'
  | 'invalid-value'
  | 'invalid-ref-range'
  | 'text-too-long'

export class ExamValidationError extends Error {
  readonly code: ExamValidationCode

  constructor(code: ExamValidationCode, message: string) {
    super(message)
    this.name = 'ExamValidationError'
    this.code = code
  }
}

function cleanText(
  value: string | undefined,
  maxLength: number,
  fieldLabel: string,
): string | undefined {
  if (value === undefined) return undefined

  const cleaned = stripControlCharacters(value).trim()
  if (!cleaned) return undefined
  if (cleaned.length > maxLength) {
    throw new ExamValidationError(
      'text-too-long',
      `${fieldLabel}最多 ${maxLength} 个字符`,
    )
  }
  return cleaned
}

function normalizeOptionalNumber(
  value: number | null | undefined,
  fieldLabel: string,
): number | undefined {
  if (value === null || value === undefined) return undefined
  if (!Number.isFinite(value)) {
    throw new ExamValidationError('invalid-value', `${fieldLabel}必须是数字`)
  }
  return value
}

function buildItem(input: ExamInput['items'][number]): ExamItemDraft {
  const itemCode = input.itemCode.trim()
  if (!itemCode) {
    throw new ExamValidationError('invalid-item', '指标代码不能为空')
  }

  const indicator = getIndicator(itemCode)
  const rawValueText = stripControlCharacters(input.valueText).trim()
  if (!rawValueText) {
    throw new ExamValidationError('invalid-value', '请填写检验结果')
  }
  if (rawValueText.length > MAX_VALUE_LENGTH) {
    throw new ExamValidationError(
      'invalid-value',
      `检验结果最多 ${MAX_VALUE_LENGTH} 个字符`,
    )
  }

  const refLow = normalizeOptionalNumber(input.refLow, '参考下限')
  const refHigh = normalizeOptionalNumber(input.refHigh, '参考上限')
  if (refLow !== undefined && refHigh !== undefined && refLow > refHigh) {
    throw new ExamValidationError('invalid-ref-range', '参考下限不能高于参考上限')
  }

  const unit = indicator
    ? normalizeUnit(input.unit || indicator.defaultUnit, indicator.units)
    : normalizeUnit(input.unit, [])

  const parsed = indicator && indicator.valueType !== 'numeric'
    ? { valueText: rawValueText }
    : parseLabValue(rawValueText)

  return {
    itemCode,
    itemName: indicator?.name ?? cleanText(input.itemName, 60, '指标名称') ?? itemCode,
    categoryCode: indicator?.categoryCode ?? cleanText(input.categoryCode, 40, '指标类别') ?? 'other',
    valueText: parsed.valueText,
    valueNumber: parsed.valueNumber,
    valueOperator: parsed.valueOperator,
    unit,
    refLow,
    refHigh,
    refText: cleanText(input.refText, 100, '参考范围'),
    flag: computeFlag({
      valueNumber: parsed.valueNumber,
      valueOperator: parsed.valueOperator,
      refLow,
      refHigh,
    }),
  }
}

/** 把页面输入归一化成可落库的检查草稿；不做任何医学推断。 */
export function buildExamDraft(input: ExamInput): ExamDraft {
  const examDate = input.examDate.trim()
  if (!isValidDateOnly(examDate)) {
    throw new ExamValidationError('invalid-date', '请选择有效的检查日期')
  }

  const examTime = input.examTime?.trim()
  if (examTime && !isValidTimeOnly(examTime)) {
    throw new ExamValidationError('invalid-time', '检查时间格式应为 HH:mm')
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new ExamValidationError('empty-items', '至少填写一个指标才能保存')
  }
  if (input.items.length > MAX_ITEMS) {
    throw new ExamValidationError('too-many-items', `一次最多记录 ${MAX_ITEMS} 个指标`)
  }

  const seen = new Set<string>()
  const items = input.items.map((item) => {
    const draft = buildItem(item)
    if (seen.has(draft.itemCode)) {
      throw new ExamValidationError('duplicate-item', `指标「${draft.itemName}」重复录入`)
    }
    seen.add(draft.itemCode)
    return draft
  })

  return {
    examDate,
    examTime: examTime || undefined,
    hospital: cleanText(input.hospital, 100, '医院名称'),
    notes: cleanText(input.notes, 1000, '备注'),
    clientRequestId: cleanText(input.clientRequestId, 100, '请求标识'),
    items,
  }
}
