<script setup lang="ts">
import { RouterLink } from 'vue-router'

withDefaults(
  defineProps<{
    label: string
    value?: string
    unit?: string
    date?: string
    icon?: string
    tone?: 'blue' | 'green' | 'amber' | 'violet' | 'rose' | 'gray'
    to?: string
    masked?: boolean
  }>(),
  {
    value: '—',
    unit: '',
    date: '',
    icon: 'chart-trending-o',
    tone: 'blue',
    to: '',
    masked: false,
  },
)
</script>

<template>
  <component
    :is="to ? RouterLink : 'div'"
    v-bind="to ? { to } : {}"
    class="metric-card"
    :class="`metric-card--${tone}`"
  >
    <div class="metric-card__top">
      <span class="metric-card__label">{{ label }}</span>
      <span class="metric-card__icon">
        <van-icon :name="icon" />
      </span>
    </div>

    <div class="metric-card__value num">
      <template v-if="masked">•••</template>
      <template v-else>{{ value }}</template>
      <small v-if="!masked && unit && value !== '—'">{{ unit }}</small>
    </div>

    <div class="metric-card__meta">{{ date || '暂无记录' }}</div>
  </component>
</template>

<style scoped>
.metric-card {
  display: block;
  min-height: 112px;
  padding: 13px 14px 12px;
  border: 1px solid var(--kc-color-border-soft);
  border-radius: 15px;
  background: var(--kc-color-surface);
  box-shadow: var(--kc-shadow-card);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.metric-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.07);
}

.metric-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.metric-card__label {
  overflow: hidden;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  font-size: 15px;
}

.metric-card__value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 10px;
  color: var(--kc-color-text);
  font-size: 22px;
  font-weight: 680;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.metric-card__value small {
  color: var(--kc-color-text-tertiary);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0;
}

.metric-card__meta {
  margin-top: 5px;
  overflow: hidden;
  color: var(--kc-color-text-tertiary);
  font-size: 10.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-card--blue .metric-card__icon {
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary);
}

.metric-card--green .metric-card__icon {
  background: var(--kc-color-success-soft);
  color: var(--kc-color-success);
}

.metric-card--amber .metric-card__icon {
  background: var(--kc-color-warning-soft);
  color: var(--kc-color-warning);
}

.metric-card--violet .metric-card__icon {
  background: #f1edff;
  color: #7a5af8;
}

.metric-card--rose .metric-card__icon {
  background: #fff0f5;
  color: #e84a7a;
}

.metric-card--gray .metric-card__icon {
  background: #f2f4f7;
  color: #667085;
}
</style>
