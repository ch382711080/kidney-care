<script setup lang="ts">
import { MEDICAL_DISCLAIMER } from '@/constants/app'

withDefaults(defineProps<{ text?: string }>(), {
  text: MEDICAL_DISCLAIMER,
})
</script>

<template>
  <div class="disclaimer">
    <van-icon name="info-o" />
    <p>{{ text }}</p>
  </div>
</template>

<style scoped>
.disclaimer {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 14px 4px 2px;
  color: var(--kc-color-text-tertiary);
  font-size: 11.5px;
  line-height: 1.65;
}

.disclaimer .van-icon {
  flex: none;
  margin-top: 1px;
  font-size: 14px;
}
</style>
