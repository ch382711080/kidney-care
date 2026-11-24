export function getUserAgent(): string {
  return typeof navigator === 'undefined' ? '' : navigator.userAgent
}

export function isWeChatBrowser(): boolean {
  return /MicroMessenger/i.test(getUserAgent())
}

export function isIOS(): boolean {
  const ua = getUserAgent()
  return /iPad|iPhone|iPod/i.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document)
}

export function isAndroid(): boolean {
  return /Android/i.test(getUserAgent())
}

export function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(min-width: 900px)').matches
}
