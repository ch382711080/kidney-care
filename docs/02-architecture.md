# 技术架构

## 总体

```text
微信内置浏览器 / 手机浏览器 / 桌面浏览器
        │ HTTPS（未来托管）
        ▼
Vue 3 + TypeScript + Vite + Vant 4
        │
        ├── Vue Router（hash 模式）
        ├── Pinia（UI 与页面状态）
        └── 领域服务（后续）
                │
                ▼
        Repository 接口（后续）
                │
                ├── LocalDexieAdapter（第一阶段）
                └── CloudApiAdapter（未来）
```

第一阶段没有服务器。构建产物是纯静态文件，未来可以放到任意静态托管；健康数据始终在用户浏览器的 IndexedDB 中。

## 技术选型

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | Vue 3 + TypeScript | 组合式 API，模板类型检查 |
| 构建 | Vite 8 | `base: './'`，构建产物可放子路径 |
| UI | Vant 4 | 移动端表单、弹窗、日期选择；按需自动引入 |
| 路由 | Vue Router 5，hash 模式 | 微信/静态托管刷新不 404 |
| 状态 | Pinia | 只放跨页 UI 状态，后续不长期缓存全量健康数据 |
| 存储 | IndexedDB + Dexie（后续） | 结构化、支持索引/事务/版本迁移 |
| 校验 | Zod（后续） | 表单与备份文件校验 |
| 图表 | ECharts（后续） | 按需引入，窄屏适配 |
| 日期 | dayjs | 本地打包 |
| 测试 | Vitest + fake-indexeddb | 数据层与领域服务单测 |

## 前端分层

当前 M1 已建立页面与组件层。后续按以下依赖方向扩展：

```text
views / components
        │ 只能调用
stores / domain services
        │ 依赖接口
data/repositories/types.ts
        │ 实现
data/repositories/local/*  ←→  Dexie / IndexedDB
data/repositories/cloud/*  ←→  未来业务 API（不直连数据库）
```

约束：

- 页面和组件不直接 import Dexie。
- 领域服务不依赖浏览器文件 API，只依赖 Repository、Clock 等接口。
- 所有数据访问带 `profileId`；本地固定 `local`，未来云端用登录用户 ID，服务端再次校验所有权。
- 记录保留 `rev`、`updatedAt`、`isDeleted`、`outbox` 等字段，为未来同步预留。
- 云端阶段前端只调用业务 API，不直连云数据库，不把健康数据交给第三方 SDK。

## 当前目录

```text
src/
├── components/
│   ├── layout/       # AppShell、TabBar、SideNav、PageHeader
│   ├── common/       # EmptyState、LoadingState、ErrorState、Disclaimer、MetricCard 等
│   └── charts/       # 趋势图占位（后续替换为 ECharts）
├── constants/        # 应用常量、指标字典
├── router/           # 路由表
├── stores/           # app store（隐私模式等）
├── styles/           # tokens、base、Vant 主题
├── types/            # RouteMeta 等类型扩展
├── utils/            # 平台检测
└── views/            # 首页、检查、趋势、档案、设置、未开放页
```

## 路由

主 Tab：

- `#/home`
- `#/exams`
- `#/trends`
- `#/profile`

子页面：

- `#/exams/new`、`#/exams/:id`
- `#/medications`、`#/daily`、`#/followups`、`#/biopsy`
- `#/profile/edit`
- `#/settings/backup`、`#/settings/privacy`、`#/settings/about`

当前子功能入口使用统一的“未开放”说明页，明确标注阶段，不伪造功能。

## 响应式

- `< 600px`：手机布局，底部四 Tab，安全区适配。
- `600–899px`：内容加宽，仍使用底部 Tab。
- `≥ 900px`：左侧 240px 导航，隐藏底部 Tab，首页三列指标卡。
- 表单与档案页最大宽度 720px；首页宽内容最大 1120px。
- 输入框字号不小于 16px，避免 iOS 聚焦缩放。
- 高度使用 `100dvh`，底部使用 `env(safe-area-inset-bottom)`。

## 设计系统

- 主色 `#1677FF`，背景 `#F5F7FA`，卡片白色。
- 检验值不使用红色渲染；异常用琥珀色中性提示。
- 卡片圆角 15–16px，轻阴影；不使用复杂动画。
- 字体使用系统字体栈，不加载外部字体。
- 无外部 CDN、统计 SDK、第三方请求。
- 生产构建由 Vite 插件注入 CSP：默认只允许同源脚本/连接；字体允许 `data:`（Vant 图标字体），样式允许内联。

## 未来云端升级

1. 用 `CloudApiAdapter` 替换 `LocalDexieAdapter`，页面与领域服务不变。
2. 增加会话/登录抽象；服务端按登录用户强制过滤数据。
3. 增加 outbox 同步、冲突处理、软删除墓碑。
4. 备份由服务端生成同一份 JSON schema，继续支持导出/迁移。
5. 报告图片使用私有对象存储 + 短期签名 URL，不生成公开链接。
