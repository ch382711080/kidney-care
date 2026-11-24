import type { Router } from 'vue-router'

export function goBackOrHome(router: Router) {
  const state =
    typeof window === 'undefined'
      ? null
      : (window.history.state as { back?: string | null } | null)
  if (state?.back) {
    router.back()
  } else {
    void router.push('/home')
  }
}
