# 数据模型

本文是 IndexedDB / Dexie 的**实施前设计基线**。M2 实现数据层时，如需调整字段，先更新本文再改 schema。

## 约定

- 主键：客户端生成 UUID 字符串，不使用自增数字。
- `profileId`：本地固定为 `local`；未来云端为登录用户 ID。所有业务表都带此字段。
- 日期：业务日期用 `YYYY-MM-DD`（避免时区漂移）；时间戳用 ISO UTC 字符串。
- 软删除：`isDeleted: 0 | 1` 参与索引；`deletedAt` 仅用于展示/清理。
- 同步预留：`rev`（本机递增版本）、`updatedAt`、`deviceId`；后续增加 `syncState`。
- 演示数据：建议使用**独立数据库** `kidney-care-demo`，与真实库物理隔离；如复用同库，必须使用独立 `profileId = 'demo'` 且导出排除。
- 不存姓名、身份证号、手机号、住址等非必要身份信息。

## 关系概览

```text
profiles (1)
   │
   ├── exams (N) ── examItems (N)
   │        └── examRevisions (N，编辑快照)
   ├── medications (N，按时间段/方案)
   ├── dailyRecords (N)
   ├── followUps (N) ── 可选关联 exams
   └── biopsies (N)

backupMeta (1) / settings (1) / snapshots (N) / outbox (N)  — 本地辅助表
```

## 表：profiles

患者基本档案。单用户本地版只有一条。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | 固定 `local`（多用户时为用户 ID） |
| displayName | string? | 否 | 昵称，可空；不要求真实姓名 |
| birthYear | number? | 否 | 出生年份，不存完整生日 |
| sex | `'female' \| 'male' \| 'unknown'`? | 否 | 可选 |
| heightCm | number? | 否 | 身高，cm |
| diagnosisDate | `YYYY-MM-DD`? | 否 | 确诊日期 |
| kidneyType | string? | 否 | 肾病类型，如“IgA 肾病” |
| diagnosisHospital | string? | 否 | 确诊医院 |
| medicalHistory | string? | 否 | 过往病史 |
| allergies | string? | 否 | 过敏史 |
| createdAt / updatedAt | ISO string | 是 | 时间戳 |

索引：`id`。

## 表：exams

一次检查记录。同一天允许多条。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | UUID |
| profileId | string | 是 | 所有者 |
| examDate | `YYYY-MM-DD` | 是 | 检查日期 |
| examTime | `HH:mm`? | 否 | 同一天多次时用于排序/展示 |
| hospital | string? | 否 | 医院 |
| categoryCodes | string[] | 是 | 本次涉及的指标类别 |
| notes | string? | 否 | 备注 |
| source | `'manual' \| 'import' \| 'demo'` | 是 | 来源 |
| clientRequestId | string? | 否 | 幂等键，防重复提交 |
| rev | number | 是 | 修改版本，从 1 开始 |
| isDeleted | 0 \| 1 | 是 | 软删除 |
| createdAt / updatedAt | ISO string | 是 | 时间戳 |
| deletedAt | ISO string? | 否 | 删除时间 |

索引：`[profileId+isDeleted+examDate]`、`[profileId+isDeleted]`、`updatedAt`、`clientRequestId`。

## 表：examItems

检查指标明细。趋势查询的主要数据源。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | UUID |
| profileId | string | 是 | 所有者 |
| examId | string | 是 | 关联 exams.id |
| examDate | `YYYY-MM-DD` | 是 | 冗余，服务趋势范围查询 |
| categoryCode | string | 是 | 指标类别 |
| itemCode | string | 是 | 内置指标 code 或 `custom:*` |
| itemName | string | 是 | 指标名称快照 |
| valueText | string | 是 | 化验单原文，如 `<0.15`、`1+`、`阴性` |
| valueNumber | number? | 否 | 仅当文本可解析为数值时填写 |
| unit | string | 是 | 单位；定性/文本指标为空字符串 |
| refLow | number? | 否 | 本次化验单参考下限 |
| refHigh | number? | 否 | 本次化验单参考上限 |
| refText | string? | 否 | 参考范围原文，如 `<0.15`、`阴性` |
| flag | `'low' \| 'high' \| 'normal' \| 'unknown'` | 是 | 仅相对本次参考范围；不表示病情 |
| isDeleted | 0 \| 1 | 是 | 随检查级联软删除 |
| createdAt / updatedAt | ISO string | 是 | 时间戳 |

索引：`[profileId+itemCode+isDeleted+examDate]`、`[profileId+examId]`、`examId`。

规则：

- 不自动补零、不插值、不跨单位换算。
- 定性指标不参与数值折线图。
- 参考范围按每次检查保存，不设全院/全局固定范围。

## 表：examRevisions

检查编辑前的快照，满足“保留原始检查结果”。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | UUID |
| profileId | string | 是 | 所有者 |
| examId | string | 是 | 关联检查 |
| rev | number | 是 | 被替换的版本号 |
| snapshot | string | 是 | 检查 + 指标的 JSON 快照 |
| reason | `'edit' \| 'before-delete'` | 是 | 原因 |
| createdAt | ISO string | 是 | 时间 |

索引：`examId`、`createdAt`。每个检查最多保留最近 20 份，超出按时间清理。

## 表：medications

用药方案。每次剂量调整是新记录，不覆盖旧记录。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | UUID |
| profileId | string | 是 | 所有者 |
| groupId | string | 是 | 同一药物的稳定分组 |
| drugName | string | 是 | 药物名称 |
| category | string | 是 | ARB / ACEI / SGLT2i / 激素 / 免疫抑制剂 / 布地奈德 / 其他 |
| specification | string? | 否 | 规格 |
| dosePerTake | number? | 否 | 单次剂量 |
| doseUnit | string? | 否 | mg / g / 片 / 粒 / 袋 / ml / IU |
| timesPerDay | number? | 否 | 每日次数 |
| intakeTimes | string[] | 否 | 早/中/晚/睡前或具体时间 |
| startDate | `YYYY-MM-DD` | 是 | 开始日期 |
| endDate | `YYYY-MM-DD`? | 否 | 结束日期；空表示仍在用 |
| hospital | string? | 否 | 开药医院 |
| changeReason | string? | 否 | 调整原因 |
| adverseReactions | string? | 否 | 不良反应 |
| notes | string? | 否 | 备注 |
| previousId | string? | 否 | 上一条方案 |
| status | `'active' \| 'ended' \| 'stopped'` | 是 | 状态 |
| rev | number | 是 | 版本 |
| isDeleted | 0 \| 1 | 是 | 软删除（仅用于纠错） |
| createdAt / updatedAt | ISO string | 是 | 时间戳 |

索引：`[profileId+groupId+startDate]`、`[profileId+startDate]`、`[profileId+status]`。

规则：

- 调整剂量：旧记录 `endDate = 新开始日期 - 1 天`，`status = 'ended'`；新建记录 `previousId = 旧 id`。
- 停药：只更新 `endDate`、`status = 'stopped'`、停止原因，不删除、不改剂量。
- 同一 `groupId` 的时间段不得重叠；保存前校验。
- 不提供任何剂量或换药建议。

## 表：dailyRecords

日常健康记录。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | UUID |
| profileId | string | 是 | 所有者 |
| recordDate | `YYYY-MM-DD` | 是 | 日期 |
| recordTime | `HH:mm`? | 否 | 同一天多次 |
| systolic | number? | 否 | 收缩压 mmHg |
| diastolic | number? | 否 | 舒张压 mmHg |
| heartRate | number? | 否 | 心率 |
| weightKg | number? | 否 | 体重 kg |
| edema | `'none' \| 'mild' \| 'moderate' \| 'severe' \| 'unknown'`? | 否 | 水肿 |
| urineAppearance | `'clear' \| 'cloudy' \| 'foamy' \| 'red' \| 'brown' \| 'other' \| 'unknown'`? | 否 | 尿液外观 |
| notes | string? | 否 | 备注 |
| rev | number | 是 | 版本 |
| isDeleted | 0 \| 1 | 是 | 软删除 |
| createdAt / updatedAt | ISO string | 是 | 时间戳 |

索引：`[profileId+recordDate]`、`[profileId+isDeleted+recordDate]`、`updatedAt`。

校验：收缩压 > 舒张压；体重、心率非负；明显异常值只做“请确认是否录入正确”提示，不阻断。

## 表：followUps

复查计划。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | UUID |
| profileId | string | 是 | 所有者 |
| plannedDate | `YYYY-MM-DD` | 是 | 计划复查日期 |
| items | string[] | 是 | 检查项目/指标 code |
| hospital | string? | 否 | 医院 |
| notes | string? | 否 | 备注 |
| status | `'planned' \| 'completed' \| 'cancelled'` | 是 | 状态 |
| completedExamId | string? | 否 | 关联检查 |
| completedAt | ISO string? | 否 | 完成时间 |
| rev | number | 是 | 版本 |
| isDeleted | 0 \| 1 | 是 | 软删除 |
| createdAt / updatedAt | ISO string | 是 | 时间戳 |

索引：`[profileId+isDeleted+plannedDate]`、`[profileId+status]`。

逾期 = `plannedDate < 今天 && status === 'planned'`，不写定时任务；仅页面内提醒。

## 表：biopsies

肾穿刺文字档案。允许未知/未报告，不自动推断。

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | string | 是 | UUID |
| profileId | string | 是 | 所有者 |
| biopsyDate | `YYYY-MM-DD`? | 否 | 穿刺日期 |
| hospital | string? | 否 | 医院 |
| leeGrade | `'I' \| 'II' \| 'III' \| 'IV' \| 'V' \| 'unknown'`? | 否 | Lee 分级 |
| mestC | `{ m,e,s,t,c }` | 是 | 每项 `0 \| 1 \| 2 \| 'unknown' \| 'not_reported'`；T/C 可为 0/1/2 |
| reportNotes | string? | 否 | 病理报告备注 |
| rev | number | 是 | 版本 |
| isDeleted | 0 \| 1 | 是 | 软删除 |
| createdAt / updatedAt | ISO string | 是 | 时间戳 |

索引：`[profileId+biopsyDate]`。不做评分推断；页面提示“以原报告为准”。

## 辅助表

### backupMeta

| 字段 | 说明 |
|---|---|
| id | 固定 `local` |
| lastExportAt | 最近一次生成备份的时间 |
| lastConfirmedBackupAt | 用户确认“已保存”的时间；提醒以此为准 |
| changesSinceBackup | 自上次确认备份后的变更计数 |
| lastRestoreAt | 最近恢复时间 |
| lastSnapshotAt | 最近快照时间 |

### settings

| 字段 | 说明 |
|---|---|
| id | 固定 `local` |
| privacyMode | 首页/列表数值打码 |
| backupReminderDays | 默认 7 |
| onboardingAcceptedAt | 首次使用说明确认时间 |
| demoMode | 是否处于演示模式（如采用独立库，可省略） |
| activeProfileId | 当前档案（本地为 `local`） |
| appVersion | 版本号 |

### snapshots

| 字段 | 说明 |
|---|---|
| id | UUID |
| createdAt | 创建时间 |
| reason | `'pre-import' \| 'manual' \| 'pre-migration'` |
| schemaVersion | 备份格式版本 |
| payload | 完整备份 JSON 对象 |
| counts / size | 统计信息 |

只保留最近 3 份；快照不参与常规导出。

### outbox

未来同步预留：`id`、`entityType`、`entityId`、`action`、`updatedAt`、`syncedAt`。第一阶段可不写入或只写元数据。

## Dexie schema 草案

```ts
db.version(1).stores({
  profiles: 'id, updatedAt',
  exams: 'id, [profileId+isDeleted+examDate], [profileId+isDeleted], updatedAt, clientRequestId',
  examItems: 'id, examId, [profileId+itemCode+isDeleted+examDate], [profileId+examId]',
  examRevisions: 'id, examId, createdAt',
  medications: 'id, [profileId+groupId+startDate], [profileId+startDate], [profileId+status], updatedAt',
  dailyRecords: 'id, [profileId+recordDate], [profileId+isDeleted+recordDate], updatedAt',
  followUps: 'id, [profileId+isDeleted+plannedDate], [profileId+status], updatedAt',
  biopsies: 'id, [profileId+biopsyDate], updatedAt',
  backupMeta: 'id',
  settings: 'id',
  snapshots: 'id, createdAt',
  outbox: 'id, [syncedAt+updatedAt]',
})
```

## 迁移策略

1. 只追加 Dexie `version(n)`，不修改旧 version 块。
2. 新字段优先可选 + 默认值。
3. 破坏性变更走“新表 + 迁移 + 标记旧表”，不原地强改。
4. `upgrade()` 内只做数据搬运，不弹窗、不发网络请求。
5. 备份格式版本与 Dexie 版本独立；导入时先把旧备份迁移到当前格式。
6. 每次发版用 `fake-indexeddb` 从旧版本 fixture 升级到最新版做回归测试。
