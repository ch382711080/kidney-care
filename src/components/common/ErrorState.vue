<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    retryText?: string
  }>(),
  {
    title: '加载失败',
    description: '请稍后重试。如果问题持续出现，请尝试重新打开页面。',
    retryText: '重试',
  },
)

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="error-state">
    <div class="error-state__icon">
      <van-icon name="warning-o" />
    </div>
    <h2 class="error-state__title">{{ title }}</h2>
    <p class="error-state__description">{{ description }}</p>
    <van-button round plain type="primary" @click="$emit('retry')">
      {{ retryText }}
    </van-button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 34px 22px;
  text-align: center;
}

.error-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  border-radius: 20px;
  background: var(--kc-color-warning-soft);
  color: var(--kc-color-warning);
  font-size: 28px;
}

.error-state__title {
  margin-top: 14px;
  font-size: 17px;
  font-weight: 650;
}

.error-state__description {
  max-width: 310px;
  margin: 7px 0 18px;
  color: var(--kc-color-text-secondary);
  font-size: 13px;
  line-height: 1.65;
}
</style>
