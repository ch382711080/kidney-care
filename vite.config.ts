import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { VantResolver } from '@vant/auto-import-resolver'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

const contentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
  "connect-src 'self'",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
].join('; ')

function productionCsp() {
  return {
    name: 'kidney-care-production-csp',
    apply: 'build' as const,
    transformIndexHtml(html: string) {
      return html.replace(
        '<head>',
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}" />`,
      )
    },
  }
}

/**
 * Vant 的图标 @font-face 内置了 woff2 data URI，同时附带阿里 CDN 的 woff 兜底。
 * 本应用承诺无第三方请求，构建时去掉这个外部兜底地址，只保留本地内联字体。
 */
function stripExternalVantFont() {
  return {
    name: 'kidney-care-strip-external-font',
    enforce: 'pre' as const,
    transform(code: string) {
      if (!code.includes('at.alicdn.com')) return null
      return code.replace(
        /,\s*url\(\s*['"]?(?:https?:)?\/\/at\.alicdn\.com[^)]*['"]?\s*\)(?:\s*format\([^)]*\))?/g,
        '',
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    stripExternalVantFont(),
    vue(),
    Components({
      resolvers: [VantResolver()],
      dts: 'src/components.d.ts',
    }),
    productionCsp(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2018',
  },
})
