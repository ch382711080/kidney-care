/** 本地单用户固定档案 ID；未来云端替换为登录用户 ID。 */
export const PROFILE_ID = 'local'

export const DB_NAME = 'kidney-care'
export const DEMO_DB_NAME = 'kidney-care-demo'

/** 回收站保留天数。 */
export const TRASH_RETENTION_DAYS = 30

/** 每个检查最多保留的修改快照数量。 */
export const EXAM_REVISION_LIMIT = 20

/** 首页健康摘要展示的指标。 */
export const HOME_SUMMARY_ITEM_CODES = [
  'scr',
  'egfr',
  'urine_protein_24h',
  'uric_acid',
  'albumin',
] as const
