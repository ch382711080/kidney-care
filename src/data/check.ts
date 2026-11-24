import type { KidneyCareDB } from './db'
import { db } from './provider'

export type DatabaseFailureReason = 'unsupported' | 'open-failed'

export type DatabaseCheckResult =
  | { ok: true }
  | { ok: false; reason: DatabaseFailureReason }

/**
 * 启动时检测 IndexedDB 是否可用。
 * 不可用时必须阻断业务页面，不能退化为 localStorage 保存健康数据。
 */
export async function checkDatabase(database: KidneyCareDB = db): Promise<DatabaseCheckResult> {
  if (typeof indexedDB === 'undefined') {
    return { ok: false, reason: 'unsupported' }
  }

  try {
    await database.open()
    return { ok: true }
  } catch {
    try {
      database.close()
    } catch {
      // 关闭失败不影响阻断结果
    }
    return { ok: false, reason: 'open-failed' }
  }
}
