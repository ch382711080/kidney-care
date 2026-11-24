import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { isWeChatBrowser } from '@/utils/platform'

const PRIVACY_MODE_KEY = 'kc_privacy_mode'

function readPrivacyMode(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(PRIVACY_MODE_KEY) === '1'
  } catch {
    return false
  }
}

export const useAppStore = defineStore('app', () => {
  const privacyMode = ref(readPrivacyMode())
  const isWeChat = computed(() => isWeChatBrowser())

  function setPrivacyMode(value: boolean) {
    privacyMode.value = value
    try {
      window.localStorage.setItem(PRIVACY_MODE_KEY, value ? '1' : '0')
    } catch {
      // 本地存储不可用时只保留当前会话内的状态
    }
  }

  function togglePrivacyMode() {
    setPrivacyMode(!privacyMode.value)
  }

  return {
    privacyMode,
    isWeChat,
    setPrivacyMode,
    togglePrivacyMode,
  }
})
