<script setup lang="ts">
import { computed } from 'vue'
import BrandMark from '@/components/common/BrandMark.vue'
import { APP_NAME } from '@/constants/app'
import type { DatabaseFailureReason } from '@/data/check'

const props = defineProps<{
  reason: DatabaseFailureReason | null
}>()

defineEmits<{
  retry: []
}>()

const description = computed(() => {
  if (props.reason === 'unsupported') {
    return '当前浏览器不支持 IndexedDB。请把微信升级到最新版本，或改用系统浏览器（Safari / Chrome）打开本页面。'
  }
  return '本地数据库无法打开，可能是无痕模式、存储被禁用或存储空间不足。请关闭无痕模式、清理空间后重试。'
})
</script>

<template>
  <div class="db-unavailable">
    <section class="db-unavailable__card card">
      <BrandMark :size="54" />
      <h1>无法使用本地存储</h1>
      <p>{{ description }}</p>

      <van-button round type="primary" class="db-unavailable__retry" @click="$emit('retry')">
        重试
      </van-button>

      <p class="db-unavailable__note">
        {{ APP_NAME }} 不会改用 localStorage 保存健康数据：那里的容量和可靠性都不足以承载档案。
        在存储恢复之前，请勿录入真实健康数据。
      </p>
    </section>
  </div>
</template>

<style scoped>
.db-unavailable {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 24px var(--kc-page-gutter);
  background: var(--kc-color-bg);
}

.db-unavailable__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 32px 24px 26px;
  text-align: center;
}

.db-unavailable__card h1 {
  margin-top: 16px;
  font-size: 19px;
  font-weight: 650;
}

.db-unavailable__card > p {
  max-width: 320px;
  margin-top: 9px;
  color: var(--kc-color-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.db-unavailable__retry {
  min-width: 140px;
  margin-top: 20px;
}

.db-unavailable__note {
  margin-top: 20px !important;
  padding-top: 16px;
  border-top: 1px solid var(--kc-color-border-soft);
  color: var(--kc-color-text-tertiary) !important;
  font-size: 11px !important;
  line-height: 1.65 !important;
}
</style>
