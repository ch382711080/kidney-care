<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title: string
    description?: string
    actionText?: string
    actionTo?: string
  }>(),
  {
    icon: 'notes-o',
    description: '',
    actionText: '',
    actionTo: '',
  },
)

defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <van-icon :name="icon" />
    </div>

    <h2 class="empty-state__title">{{ title }}</h2>
    <p v-if="description" class="empty-state__description">{{ description }}</p>

    <slot />

    <RouterLink v-if="actionTo && actionText" :to="actionTo" class="empty-state__action">
      <van-button type="primary" round>{{ actionText }}</van-button>
    </RouterLink>
    <van-button
      v-else-if="actionText"
      class="empty-state__action"
      type="primary"
      round
      @click="$emit('action')"
    >
      {{ actionText }}
    </van-button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 34px 22px;
  text-align: center;
}

.empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 66px;
  border-radius: 22px;
  background: linear-gradient(145deg, #eef6ff, #e3f0ff);
  color: var(--kc-color-primary);
  font-size: 30px;
}

.empty-state__title {
  margin-top: 16px;
  font-size: 17px;
  font-weight: 650;
}

.empty-state__description {
  max-width: 310px;
  margin-top: 7px;
  color: var(--kc-color-text-secondary);
  font-size: 13px;
  line-height: 1.65;
}

.empty-state__action {
  margin-top: 20px;
}

.empty-state__action :deep(.van-button) {
  min-width: 132px;
}
</style>
