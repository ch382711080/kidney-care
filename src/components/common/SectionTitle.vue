<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  actionText?: string
  actionTo?: string
}>()
</script>

<template>
  <div class="section-title">
    <div class="section-title__text">
      <h2>{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <RouterLink v-if="actionText && actionTo" :to="actionTo" class="section-title__action">
      {{ actionText }}
      <van-icon name="arrow" />
    </RouterLink>
    <slot v-else name="action" />
  </div>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 11px;
}

.section-title h2 {
  font-size: 16px;
  font-weight: 650;
  line-height: 1.3;
}

.section-title p {
  margin-top: 3px;
  color: var(--kc-color-text-tertiary);
  font-size: 11.5px;
}

.section-title__action {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex: none;
  min-height: 30px;
  color: var(--kc-color-primary);
  font-size: 12.5px;
  font-weight: 500;
}

.section-title__action .van-icon {
  font-size: 12px;
}
</style>
