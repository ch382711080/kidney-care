<script setup lang="ts">
import { computed } from 'vue'
import BrandMark from '@/components/common/BrandMark.vue'
import Disclaimer from '@/components/common/Disclaimer.vue'
import MetricCard from '@/components/common/MetricCard.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import { APP_NAME, APP_SUBTITLE } from '@/constants/app'
import { useAppStore } from '@/stores/app'

const app = useAppStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const metrics = [
  {
    label: '血肌酐',
    value: '—',
    unit: 'μmol/L',
    icon: 'bar-chart-o',
    tone: 'blue',
    to: '/trends?item=scr',
  },
  {
    label: 'eGFR',
    value: '—',
    unit: 'mL/min/1.73m²',
    icon: 'chart-trending-o',
    tone: 'green',
    to: '/trends?item=egfr',
  },
  {
    label: '24h 尿蛋白',
    value: '—',
    unit: 'g/24h',
    icon: 'records-o',
    tone: 'amber',
    to: '/trends?item=urine_protein_24h',
  },
  {
    label: '血压',
    value: '—',
    unit: 'mmHg',
    icon: 'clock-o',
    tone: 'violet',
    to: '/daily',
  },
  {
    label: '体重',
    value: '—',
    unit: 'kg',
    icon: 'balance-o',
    tone: 'rose',
    to: '/daily',
  },
  {
    label: '最近检查',
    value: '—',
    unit: '',
    icon: 'calendar-o',
    tone: 'gray',
    to: '/exams',
  },
] as const
</script>

<template>
  <div class="home-page">
    <header class="home-hero">
      <div class="home-hero__inner">
        <div class="home-hero__top">
          <div class="home-hero__brand">
            <BrandMark :size="46" />
            <div class="home-hero__brand-text">
              <p class="home-hero__greeting">{{ greeting }}</p>
              <h1>{{ APP_NAME }}</h1>
              <p class="home-hero__subtitle">{{ APP_SUBTITLE }}</p>
            </div>
          </div>

          <button
            class="icon-button home-hero__privacy"
            type="button"
            :aria-label="app.privacyMode ? '关闭隐私模式' : '开启隐私模式'"
            @click="app.togglePrivacyMode()"
          >
            <van-icon :name="app.privacyMode ? 'closed-eye' : 'eye-o'" />
          </button>
        </div>

        <div class="home-hero__chips">
          <span class="chip">本地模式</span>
          <span class="chip chip--neutral">数据仅存本机</span>
          <span v-if="app.isWeChat" class="chip chip--neutral">微信浏览器</span>
        </div>

        <p class="home-hero__lead">记录每一次检查，复诊时更从容。</p>
      </div>
    </header>

    <div class="page home-page__body">
      <section class="page-section">
        <SectionTitle
          title="健康摘要"
          subtitle="最近一次记录"
          action-text="查看趋势"
          action-to="/trends"
        />

        <div class="metric-grid">
          <MetricCard
            v-for="metric in metrics"
            :key="metric.label"
            :label="metric.label"
            :value="metric.value"
            :unit="metric.unit"
            :icon="metric.icon"
            :tone="metric.tone"
            :to="metric.to"
            :masked="app.privacyMode"
          />
        </div>
      </section>

      <section class="page-section">
        <SectionTitle title="近期安排" subtitle="检查与复查一目了然" />

        <div class="schedule-card card">
          <div class="schedule-row">
            <span class="schedule-row__icon schedule-row__icon--blue">
              <van-icon name="calendar-o" />
            </span>
            <span class="schedule-row__text">
              <strong>最近一次检查</strong>
              <small>尚未记录</small>
            </span>
            <span class="schedule-row__value num">—</span>
          </div>

          <div class="schedule-row">
            <span class="schedule-row__icon schedule-row__icon--green">
              <van-icon name="clock-o" />
            </span>
            <span class="schedule-row__text">
              <strong>距离上次检查</strong>
              <small>记录后自动计算</small>
            </span>
            <span class="schedule-row__value num">—</span>
          </div>

          <div class="schedule-row schedule-row--last">
            <span class="schedule-row__icon schedule-row__icon--amber">
              <van-icon name="underway-o" />
            </span>
            <span class="schedule-row__text">
              <strong>下次复查</strong>
              <small>暂无复查计划</small>
            </span>
            <RouterLink to="/followups" class="schedule-row__link">去设置</RouterLink>
          </div>
        </div>
      </section>

      <section class="page-section">
        <SectionTitle title="快捷记录" subtitle="常用操作放在手边" />

        <div class="quick-actions">
          <RouterLink to="/exams/new" class="quick-action quick-action--primary">
            <span class="quick-action__icon">
              <van-icon name="add-o" />
            </span>
            <span class="quick-action__text">
              <strong>记录检查</strong>
              <small>血肌酐、eGFR、尿蛋白</small>
            </span>
            <van-icon name="arrow" class="quick-action__arrow" />
          </RouterLink>

          <RouterLink to="/daily" class="quick-action">
            <span class="quick-action__icon">
              <van-icon name="clock-o" />
            </span>
            <span class="quick-action__text">
              <strong>记录血压 / 体重</strong>
              <small>日常数据快速记录</small>
            </span>
            <van-icon name="arrow" class="quick-action__arrow" />
          </RouterLink>
        </div>
      </section>

      <RouterLink to="/settings/privacy" class="notice-card card">
        <span class="notice-card__icon">
          <van-icon name="shield-o" />
        </span>
        <span class="notice-card__text">
          <strong>数据只保存在当前浏览器</strong>
          <small>当前版本尚未提供备份功能，请勿录入真实健康数据。备份将在第四阶段接入。</small>
        </span>
        <van-icon name="arrow" class="notice-card__arrow" />
      </RouterLink>

      <Disclaimer />
    </div>
  </div>
</template>

<style scoped>
.home-hero {
  padding: calc(env(safe-area-inset-top) + 22px) var(--kc-page-gutter) 24px;
  background:
    radial-gradient(circle at 88% 0%, rgba(22, 119, 255, 0.14), transparent 34%),
    radial-gradient(circle at 0% 20%, rgba(122, 90, 248, 0.07), transparent 30%),
    linear-gradient(180deg, #eaf3ff 0%, #f5f7fa 100%);
}

.home-hero__inner {
  width: 100%;
  max-width: var(--kc-max-width);
  margin: 0 auto;
}

.home-hero__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.home-hero__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.home-hero__brand-text {
  min-width: 0;
}

.home-hero__greeting {
  color: var(--kc-color-primary-dark);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.home-hero__brand-text h1 {
  margin-top: 1px;
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.2;
}

.home-hero__subtitle {
  margin-top: 2px;
  color: var(--kc-color-text-secondary);
  font-size: 11.5px;
}

.home-hero__privacy {
  margin-top: 2px;
}

.home-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
}

.home-hero__lead {
  margin-top: 12px;
  color: var(--kc-color-text-secondary);
  font-size: 13px;
}

.home-page__body {
  padding-top: 20px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.schedule-card {
  padding: 2px 16px;
}

.schedule-row {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 64px;
  border-bottom: 1px solid var(--kc-color-border-soft);
}

.schedule-row--last {
  border-bottom: 0;
}

.schedule-row__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  font-size: 17px;
}

.schedule-row__icon--blue {
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary);
}

.schedule-row__icon--green {
  background: var(--kc-color-success-soft);
  color: var(--kc-color-success);
}

.schedule-row__icon--amber {
  background: var(--kc-color-warning-soft);
  color: var(--kc-color-warning);
}

.schedule-row__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.schedule-row__text strong {
  font-size: 13.5px;
  font-weight: 600;
}

.schedule-row__text small {
  margin-top: 1px;
  overflow: hidden;
  color: var(--kc-color-text-tertiary);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.schedule-row__value {
  flex: none;
  color: var(--kc-color-text-secondary);
  font-size: 13px;
}

.schedule-row__link {
  flex: none;
  color: var(--kc-color-primary);
  font-size: 12px;
  font-weight: 500;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.quick-action {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 13px 15px;
  border: 1px solid var(--kc-color-border-soft);
  border-radius: 16px;
  background: var(--kc-color-surface);
  box-shadow: var(--kc-shadow-card);
}

.quick-action__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 13px;
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary);
  font-size: 21px;
}

.quick-action__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.quick-action__text strong {
  font-size: 14px;
  font-weight: 600;
}

.quick-action__text small {
  margin-top: 2px;
  color: var(--kc-color-text-tertiary);
  font-size: 11px;
}

.quick-action__arrow {
  flex: none;
  color: var(--kc-color-text-tertiary);
  font-size: 14px;
}

.quick-action--primary {
  border-color: transparent;
  background:
    radial-gradient(circle at 100% 0%, rgba(255, 255, 255, 0.2), transparent 38%),
    linear-gradient(135deg, #2b8bff 0%, #1677ff 100%);
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.22);
  color: #fff;
}

.quick-action--primary .quick-action__icon {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.quick-action--primary .quick-action__text small {
  color: rgba(255, 255, 255, 0.72);
}

.quick-action--primary .quick-action__arrow {
  color: rgba(255, 255, 255, 0.8);
}

.notice-card {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 18px;
  padding: 13px 14px;
}

.notice-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary);
  font-size: 18px;
}

.notice-card__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.notice-card__text strong {
  font-size: 12.5px;
  font-weight: 600;
}

.notice-card__text small {
  margin-top: 2px;
  color: var(--kc-color-text-tertiary);
  font-size: 10.5px;
  line-height: 1.5;
}

.notice-card__arrow {
  flex: none;
  color: var(--kc-color-text-tertiary);
  font-size: 13px;
}

@media (min-width: 600px) {
  .metric-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .quick-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 900px) {
  .home-hero {
    padding: 34px 32px 30px;
  }

  .home-hero__brand-text h1 {
    font-size: 27px;
  }

  .home-hero__lead {
    font-size: 14px;
  }

  .home-page__body {
    max-width: var(--kc-max-width);
    padding: 24px 32px 40px;
  }

  .metric-grid {
    gap: 14px;
  }

  .schedule-card {
    padding: 4px 20px;
  }

  .quick-action {
    min-height: 84px;
    padding: 16px 18px;
  }
}
</style>
