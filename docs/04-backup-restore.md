# 备份与恢复

本地数据可能被微信/浏览器清理，备份是唯一可靠保障。备份与恢复在 M4 实现，本文先固定设计。

## 备份文件格式 v1

```json
{
  "format": "kidney-care-backup",
  "schemaVersion": 1,
  "exportedAt": "2026-11-22T10:00:00.000Z",
  "appVersion": "0.1.0",
  "profile": {},
  "data": {
    "exams": [],
    "examItems": [],
    "examRevisions": [],
    "medications": [],
    "dailyRecords": [],
    "followUps": [],
    "biopsies": []
  },
  "counts": {
    "exams": 0,
    "examItems": 0,
    "medications": 0,
    "dailyRecords": 0,
    "followUps": 0,
    "biopsies": 0
  }
}
```

规则：

- 文件名 `kidney-care-backup-YYYYMMDD-HHmm.json`，不含姓名、医院等 PII。
- 不导出 `snapshots`、`outbox`、`backupMeta`、`settings`、演示数据。
- 数组按 `id` 排序；导出时写入 `counts`，导入时与实际数量比对。
- 预留 `encryption` 字段，MVP 固定不加密；加密备份后续提供。
- 备份文件是明文敏感数据，UI 必须显著警告。

## 导出流程

1. 从 Repository 读取当前档案全部真实数据。
2. 生成 JSON、统计数量和日期范围、估算文件大小。
3. 展示摘要、敏感提示和平台能力按钮。
4. 用户保存后点击“我已保存”，才更新 `lastConfirmedBackupAt` 并清零变更计数。
5. `lastExportAt` 在生成时记录，但备份提醒以“确认保存”为准。

## 平台策略

| 环境 | 主路径 | 兜底 |
|---|---|---|
| 桌面 Chrome/Edge | Blob + `<a download>` | 复制 JSON 文本 |
| Android Chrome | Blob 下载 | 复制 JSON 文本 |
| Android 微信 | 尝试下载（不保证） | 复制 JSON 文本为主 |
| iOS Safari | Web Share 分享文件 / 存储到“文件” | 复制 JSON 文本 |
| iOS 微信 | **复制 JSON 文本为第一优先** | 打开 Blob 预览后手动存储；引导系统浏览器 |
| 所有环境 | 只读文本域展示完整 JSON，可全选复制 | — |

实现要点：

- 备份数据在进入导出页时预构建，点击“复制”时立即写剪贴板，避免 iOS 手势失效。
- 优先 `navigator.clipboard.writeText`；失败用 textarea + `execCommand('copy')`；再失败提示长按复制。
- 复制后提示“剪贴板可能被系统同步，粘贴到私密备忘录后请清理剪贴板”。
- 文件分享会经过微信服务器，优先保存到本机；不建议发群聊。
- 超过 1MB 提示“建议在电脑端导出”；超过 5MB 建议先清理旧数据（MVP 无附件，通常不会触发）。

## 导入校验

输入：文件选择（`accept=".json,application/json,text/plain"`）+ 粘贴文本框（Android 微信兜底）。

顺序：

1. 文件大小 ≤ 20MB，记录数 ≤ 50,000。
2. JSON 解析成功。
3. Zod 校验 `format`、`schemaVersion`、字段类型、日期格式、枚举、数值有限、字符串长度。
4. 版本策略：低于当前版本先迁移；高于当前版本拒绝并提示升级应用。
5. 引用完整性：`examItems.examId` 必须存在；`followUps.completedExamId` 可为空或指向存在/已删除检查；ID 不重复。
6. `counts` 与实际数组长度一致。
7. 演示标记检测：演示备份不得导入真实库。
8. 业务软校验：日期范围、单位非空、数值硬范围、用药时间段重叠；只警告，不阻断（明显损坏除外）。

任何一步失败都不写库，错误信息定位到字段路径，不把健康数值打印到控制台。

## 合并 / 替换

策略由用户显式选择，不能静默覆盖。

### 合并（默认）

- 新 ID：新增。
- 同 ID：默认保留现有记录，跳过导入记录。
- 用户显式勾选“同 ID 以较新的记录为准”后，才比较 `updatedAt` 并覆盖。
- 合并也在单个 Dexie 事务内完成；失败整体回滚。
- 结果报告：新增 / 跳过 / 覆盖 / 失败数量。

### 覆盖恢复

- 第一次确认：展示当前数据量与备份数据量。
- 第二次确认：勾选“我了解现有数据将被清空”，可要求输入“覆盖”。
- 导入前自动创建 `pre-import` 快照；快照失败则禁止覆盖。
- 清空 + 写入在同一事务；失败自动回滚。
- 快照保留最近 3 份，可在备份中心恢复。

## 备份提醒

`BackupService.getStatus()` 返回最近备份、距今天数、是否有变更、提醒级别。

| 条件 | 行为 |
|---|---|
| 无真实数据 | 不提醒 |
| 有数据但从未确认备份 | 首页黄色横幅 |
| 距上次确认备份 ≥ 7 天且有变更 | 黄色提醒 |
| 距上次确认备份 ≥ 30 天 | 强提醒 |
| 用户点“稍后提醒” | 3 天内不再提示；档案页仍显示状态 |
| 成功导出并确认 | 清零变更计数、清除稍后提醒 |

其他：

- 首次保存后尝试 `navigator.storage.persist()`，但不承诺结果。
- 档案页展示 `navigator.storage.estimate()` 的占用/配额。
- localStorage 只存非敏感标记（如 `kc_has_data=1`）；标记存在但数据库为空时提示“本地数据可能被清理，请从备份恢复”。
- 清除全部数据前二次确认，并建议先导出；可选择是否同时删除快照。
