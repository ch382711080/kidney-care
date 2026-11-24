import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PROFILE_ID } from '@/constants/data'
import { checkDatabase, type DatabaseFailureReason } from '@/data/check'
import { examService } from '@/data/provider'

export type DataStatus = 'loading' | 'ready' | 'unavailable'

export const useDataStore = defineStore('data', () => {
  const status = ref<DataStatus>('loading')
  const failureReason = ref<DatabaseFailureReason | null>(null)

  let pending: Promise<void> | null = null

  async function init(): Promise<void> {
    if (pending) return pending

    status.value = 'loading'
    pending = (async () => {
      const result = await checkDatabase()
      if (result.ok) {
        status.value = 'ready'
        failureReason.value = null
        // 启动时清理超过保留期的回收站记录，不阻塞首屏
        void examService.purgeExpiredTrash(PROFILE_ID).catch(() => undefined)
      } else {
        status.value = 'unavailable'
        failureReason.value = result.reason
      }
      pending = null
    })()

    return pending
  }

  return { status, failureReason, init }
})
