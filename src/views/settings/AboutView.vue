<script setup lang="ts">
import BrandMark from '@/components/common/BrandMark.vue'
import Disclaimer from '@/components/common/Disclaimer.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { APP_DESCRIPTION, APP_NAME, APP_SUBTITLE, APP_VERSION } from '@/constants/app'
</script>

<template>
  <div class="about-page">
    <PageHeader title="关于肾友档案" back />

    <div class="page">
      <section class="about-hero card">
        <BrandMark :size="64" />
        <h1>{{ APP_NAME }}</h1>
        <p class="about-hero__subtitle">{{ APP_SUBTITLE }}</p>
        <p class="about-hero__version">v{{ APP_VERSION }} · 本地版</p>
        <p class="about-hero__description">{{ APP_DESCRIPTION }}</p>
      </section>

      <section class="about-card card">
        <h2>当前阶段</h2>
        <p>
          数据层已接入本地数据库，检查记录的录入与编辑页面正在开发。备份功能尚未提供，
          在备份上线前请勿录入真实健康数据。
        </p>
      </section>

      <section class="about-card card">
        <h2>设计原则</h2>
        <ul>
          <li>数据优先保存在本机，不依赖账号和服务器；</li>
          <li>不收集不必要的身份信息，不接入第三方统计；</li>
          <li>不自动判断病情，不提供诊断或调药建议；</li>
          <li>备份功能上线后，备份文件由你自行保管，可导出、可恢复、可迁移。</li>
        </ul>
      </section>

      <section class="about-card card">
        <h2>数据说明</h2>
        <p>
          当前没有云端同步。同一网页在不同设备或浏览器打开时，数据默认不互通；换设备需要通过备份文件恢复。
        </p>
        <RouterLink to="/settings/privacy" class="about-card__link">
          查看隐私与本地存储说明
          <van-icon name="arrow" />
        </RouterLink>
      </section>

      <Disclaimer />
    </div>
  </div>
</template>

<style scoped>
.about-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px 24px;
  text-align: center;
}

.about-hero h1 {
  margin-top: 14px;
  font-size: 22px;
  font-weight: 700;
}

.about-hero__subtitle {
  margin-top: 3px;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
}

.about-hero__version {
  margin-top: 8px;
  padding: 3px 10px;
  border-radius: var(--kc-radius-pill);
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary-dark);
  font-size: 10.5px;
}

.about-hero__description {
  max-width: 330px;
  margin-top: 14px;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.about-card {
  margin-top: 12px;
  padding: 17px 18px;
}

.about-card h2 {
  font-size: 14px;
  font-weight: 650;
}

.about-card p {
  margin-top: 6px;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.about-card ul {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.about-card li {
  position: relative;
  padding-left: 12px;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
  line-height: 1.65;
}

.about-card li::before {
  position: absolute;
  top: 0.72em;
  left: 1px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #b8c3d3;
  content: '';
}

.about-card__link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 11px;
  color: var(--kc-color-primary);
  font-size: 12px;
  font-weight: 500;
}
</style>
