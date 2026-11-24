<script setup lang="ts">
withDefaults(defineProps<{ text?: string }>(), {
  text: '加载中…',
})
</script>

<template>
  <div class="loading-state">
    <van-loading size="24" color="#1677ff" />
    <span>{{ text }}</span>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--kc-color-text-secondary);
  font-size: 13px;
}
</style>
