/** 首次成功写库后申请持久化存储；失败或浏览器不支持时静默忽略。 */
export async function requestPersistentStorage(): Promise<boolean | undefined> {
  try {
    if (typeof navigator === 'undefined' || !navigator.storage) return undefined
    if (typeof navigator.storage.persisted === 'function') {
      if (await navigator.storage.persisted()) return true
    }
    if (typeof navigator.storage.persist === 'function') {
      return await navigator.storage.persist()
    }
    return undefined
  } catch {
    return undefined
  }
}
