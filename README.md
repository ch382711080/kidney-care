# 肾友档案 · KidneyCare

面向 IgA 肾病患者的个人健康档案 H5，优先适配微信内置浏览器。当前为**第一阶段：本地版页面骨架**。

> 本工具仅用于个人健康资料记录，不提供诊断、治疗建议。用药请遵医嘱，请勿自行调整剂量。

## 当前状态

已完成 M1 页面骨架与 M2-a 数据层：

- Vue 3 + TypeScript + Vite + Vant 4 基础工程。
- 手机底部四 Tab（首页 / 检查 / 趋势 / 档案）与桌面侧边导航。
- 首页健康摘要、检查列表空状态、趋势占位、档案入口。
- 隐私与本地存储说明、关于页、未开放功能说明页。
- 指标字典（8 大类，含常用指标、单位、定性/数值类型）。
- Dexie v1 schema：检查、指标、修改快照、用药、日常、复查、穿刺、设置等表。
- Repository 接口与本地适配器；检查、档案、设置仓储。
- 检查领域服务：输入校验、数值/不等式解析、参考范围标记、事务写入、修改快照、软删除与恢复、回收站清理。
- 启动时 IndexedDB 可用性检测与阻断页；写库后申请持久化存储。
- 36 个单元测试（含 fake-indexeddb 数据层回归）。

尚未完成：

- 档案编辑页、检查录入/列表/详情/修改历史/回收站页面（M2-b）。
- 用药、日常、复查、穿刺的实际页面（M3）。
- 趋势图（ECharts）与实际趋势数据。
- JSON 备份/恢复与备份提醒（M4）。
- 微信内真实分享与托管部署。

> **当前版本尚未提供备份功能，请勿录入真实健康数据。**

## 快速开始

要求 Node.js 20（见 `.nvmrc`）。

```bash
npm install
npm run dev
```

手机同 Wi-Fi 调试：

```bash
npm run dev -- --host 0.0.0.0
```

然后用手机访问终端输出的局域网地址。当前没有后端，数据层已接入 IndexedDB，但录入页面尚未开放；备份上线前请勿录入真实健康数据。

常用命令：

```bash
npm run dev        # 开发服务器
npm run build      # 类型检查 + 生产构建，产物在 dist/
npm run preview    # 预览构建产物
npm run typecheck  # vue-tsc 类型检查
npm run test       # Vitest 单元测试
npm run lint       # ESLint
npm run format     # Prettier
```

## 技术栈

- Vue 3 + TypeScript + Vite
- Vant 4（移动端组件）
- Vue Router（hash 模式，静态托管刷新不 404）
- Pinia
- ECharts（后续接入趋势图）
- Dexie + IndexedDB（已接入本地数据层）
- Zod（后续接入备份导入校验）
- dayjs
- Vitest + fake-indexeddb

## 目录

```text
src/
├── components/     # 布局、通用组件、图表占位
├── constants/      # 应用常量、指标字典、数据常量
├── data/           # Dexie、Repository 接口、本地适配器、启动检测
├── domain/         # 模型、化验值解析、检查校验、领域服务、Clock
├── router/         # hash 路由
├── stores/         # Pinia 状态（UI 偏好、数据库状态）
├── styles/         # 设计 tokens、全局样式、Vant 主题
├── types/          # 类型扩展
├── utils/          # 平台、日期、ID、存储申请等工具
└── views/          # 页面
docs/               # 产品、架构、数据、备份、兼容与测试文档
tests/              # 单元测试
```

## 重要限制

- 本地版没有服务器和账号；每个浏览器是独立档案，数据不跨设备同步。
- IndexedDB 可能被微信/浏览器清理；本工具不承诺永久保存，后续必须提供导出/导入备份。
- iOS 微信内下载文件不可靠，备份将提供“复制 JSON 文本”兜底。
- “免费 + 免备案 + 微信内长期稳定访问”不可兼得；本阶段只做本地开发，托管与备案后置。
- 不购买域名、服务器或付费云服务。

## 文档

- [产品范围](docs/01-product-scope.md)
- [技术架构](docs/02-architecture.md)
- [数据模型](docs/03-data-model.md)
- [备份与恢复](docs/04-backup-restore.md)
- [微信兼容](docs/05-wechat-compat.md)
- [测试计划](docs/06-test-plan.md)

## 免责声明

本项目不是医疗器械，不提供诊断、分级、治疗或用药建议。所有检验结果请以医院报告和医生解释为准。如出现身体不适，请及时就医。
