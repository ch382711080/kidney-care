# 微信 H5 兼容说明

## 存储

- 微信内置浏览器（iOS WKWebView / Android X5）较新版本支持 IndexedDB，但**没有永久存储承诺**。
- Android 清理微信缓存可能删除 IndexedDB；iOS 相对不易，但 iOS 的 ITP 可能在长时间不访问后清理脚本可写存储。
- `navigator.storage.persist()` 可能返回 true，但不能作为可靠承诺。
- 换设备、换浏览器、隐私模式、系统存储压力都可能导致数据不互通或丢失。
- 结论：**备份不是附属功能，而是本地版的必要功能。**

## 能力降级

| 能力 | 风险 | 处理 |
|---|---|---|
| IndexedDB | 旧版/受限 WebView 不可用 | 启动检测；不可用时阻断并提示升级微信或改用系统浏览器；不退化为 localStorage 存健康数据 |
| 文件下载 | iOS 微信 Blob/`<a download>` 不可靠 | 复制 JSON 文本为主；引导系统浏览器打开 |
| 文件选择 | Android 微信可能无法选 `.json` | 始终提供粘贴文本框；`accept` 不可靠时移除并在 JS 校验 |
| 剪贴板 | 非安全上下文/旧 WebView 不可用 | textarea + `execCommand`；再失败提示长按复制 |
| Web Share | 微信内多数不支持 | 检测 `navigator.canShare({ files })`，不支持则隐藏 |
| `storage.persist/estimate` | 可能不支持 | 隐藏状态；仍按时间/变更提醒 |
| `crypto.randomUUID` | 旧系统不支持 | JS UUID v4 兜底 |

## 路由与资源

- 使用 `createWebHashHistory()`；Vite `base: './'`；静态托管子路径刷新不 404。
- 不把健康数据放进 URL；路由只出现页面名和记录 ID。
- 不使用外部 CDN、外部字体、统计 SDK；避免微信内加载失败与数据泄露。
- 生产环境不启用 Service Worker，避免微信缓存旧版本；发版后提示刷新。

## 移动端细节

- `viewport-fit=cover`；底部使用 `env(safe-area-inset-bottom)`。
- 高度优先 `100dvh`，回退 `100vh`。
- 输入框字号 ≥ 16px，避免 iOS 聚焦自动放大；不全局禁用缩放。
- 键盘弹出时，聚焦字段滚动到可视区域；底部固定栏避免遮挡输入。
- 触控目标 ≥ 44px；主操作放在单手可达的下方。
- ECharts 使用 `ResizeObserver`，微信切后台回来、横竖屏切换时 resize；窄屏高度约 220px。
- 文件选择必须由用户手势同步触发，不能在 `await` 之后调用 `input.click()`。

## 发布路径

| 路径 | 能力 | 限制 |
|---|---|---|
| A. 本地开发 | `npm run dev -- --host`，手机同 Wi-Fi | 不能微信分享；HTTP 下剪贴板/持久存储受限 |
| B. 免费静态托管 | 零费用、HTTPS、hash 路由 | 国内访问/微信内稳定性不保证；无备案 |
| C. 腾讯云 CloudBase 免费环境默认域名 | 国内相对稳定、HTTPS | 需实名/账号；默认域名可能显示安全提示；免费额度非永久 |
| D. 自有域名 + ICP 备案 | 长期稳定 | 需要购买域名、备案时间；医疗健康内容备案有门槛 |

“免费 + 免备案 + 微信内长期稳定”不可兼得。第一阶段按 A 开发，托管选型后置；不购买任何付费服务。

## 测试建议

- 开发阶段先用 Safari/Chrome 的设备模拟；能在微信打开同 Wi-Fi 地址时做基础验证。
- 完整的微信内文件/下载/存储测试放到选定静态托管后。
- 至少覆盖：iPhone 微信、Android 微信、iOS Safari、Android Chrome、桌面 Chrome。
- 测试清缓存后用备份恢复（仅假数据）。
