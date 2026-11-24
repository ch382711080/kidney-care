/**
 * 生成 UUID v4 字符串。
 *
 * `crypto.randomUUID` 只在安全上下文可用（LAN HTTP 下不可用），
 * 因此必须保留降级实现，导出数据的主键也依赖它稳定可靠。
 */
export function createId(): string {
  const cryptoObject = globalThis.crypto

  if (typeof cryptoObject?.randomUUID === 'function') {
    try {
      return cryptoObject.randomUUID()
    } catch {
      // 某些旧 WebView 暴露了方法但会抛错，继续走降级实现
    }
  }

  const bytes = new Uint8Array(16)

  if (typeof cryptoObject?.getRandomValues === 'function') {
    cryptoObject.getRandomValues(bytes)
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256)
    }
  }

  // RFC 4122: version 4 + variant 10xx
  bytes[6] = (bytes[6]! & 0x0f) | 0x40
  bytes[8] = (bytes[8]! & 0x3f) | 0x80

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
