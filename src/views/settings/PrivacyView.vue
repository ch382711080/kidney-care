<script setup lang="ts">
import Disclaimer from '@/components/common/Disclaimer.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
</script>

<template>
  <div class="privacy-page">
    <PageHeader title="隐私与本地存储" subtitle="了解数据存在哪里、如何保护" back />

    <div class="page">
      <section class="privacy-card card">
        <span class="privacy-card__icon privacy-card__icon--blue">
          <van-icon name="shield-o" />
        </span>
        <div>
          <h2>数据保存在当前浏览器</h2>
          <p>
            本版本没有服务器和账号系统。检查、用药、血压、体重等记录保存在当前浏览器的
            IndexedDB 中，不会上传到任何服务器，也不会用于广告或模型训练。
          </p>
        </div>
      </section>

      <section class="privacy-card card privacy-card--warning">
        <span class="privacy-card__icon privacy-card__icon--amber">
          <van-icon name="warning-o" />
        </span>
        <div>
          <h2>本地数据不是永久保存</h2>
          <p>以下情况可能导致记录丢失，本工具无法承诺永久保存：</p>
          <ul>
            <li>清理微信缓存、浏览器站点数据或卸载微信；</li>
            <li>系统存储空间不足，浏览器自动清理数据；</li>
            <li>更换手机、更换浏览器或使用隐私模式；</li>
            <li>iOS 长时间不访问网页后，系统清理脚本可写存储。</li>
          </ul>
        </div>
      </section>

      <section class="privacy-card card">
        <span class="privacy-card__icon privacy-card__icon--green">
          <van-icon name="passed" />
        </span>
        <div>
          <h2>建议定期导出备份</h2>
          <p>
            备份文件包含完整健康信息。请保存到自己的私密位置，不要发到群聊、公共网盘或公开链接。
            换设备时，在新设备上打开同一网页并导入备份即可恢复。
          </p>
          <p class="privacy-card__muted">备份与恢复功能将在后续阶段提供。</p>
        </div>
      </section>

      <section class="privacy-card card">
        <span class="privacy-card__icon privacy-card__icon--violet">
          <van-icon name="idcard" />
        </span>
        <div>
          <h2>只收集必要信息</h2>
          <ul>
            <li>出生年份（不保存完整生日或年龄）；</li>
            <li>性别、身高、确诊信息（均可选）；</li>
            <li>你主动填写的检查、用药和日常记录。</li>
          </ul>
          <p>不收集姓名、身份证号、手机号、住址，也不接入统计 SDK。</p>
        </div>
      </section>

      <section class="privacy-card card">
        <span class="privacy-card__icon privacy-card__icon--gray">
          <van-icon name="info-o" />
        </span>
        <div>
          <h2>不提供医疗建议</h2>
          <p>
            本工具只帮助整理个人健康资料，不提供诊断、分级、治疗或调药建议。检验结果请以医院报告和医生解释为准。
          </p>
        </div>
      </section>

      <Disclaimer />
    </div>
  </div>
</template>

<style scoped>
.privacy-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 17px 16px;
}

.privacy-card + .privacy-card {
  margin-top: 12px;
}

.privacy-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  font-size: 18px;
}

.privacy-card__icon--blue {
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary);
}

.privacy-card__icon--amber {
  background: var(--kc-color-warning-soft);
  color: var(--kc-color-warning);
}

.privacy-card__icon--green {
  background: var(--kc-color-success-soft);
  color: var(--kc-color-success);
}

.privacy-card__icon--violet {
  background: #f1edff;
  color: #7a5af8;
}

.privacy-card__icon--gray {
  background: #f2f4f7;
  color: #667085;
}

.privacy-card h2 {
  font-size: 14px;
  font-weight: 650;
}

.privacy-card p {
  margin-top: 5px;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.privacy-card ul {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 7px;
}

.privacy-card li {
  position: relative;
  padding-left: 12px;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
  line-height: 1.65;
}

.privacy-card li::before {
  position: absolute;
  top: 0.72em;
  left: 1px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #b8c3d3;
  content: '';
}

.privacy-card--warning {
  border-color: #ffe7ba;
  background: #fffdf8;
}

.privacy-card__muted {
  color: var(--kc-color-text-tertiary) !important;
  font-size: 11px !important;
}
</style>
