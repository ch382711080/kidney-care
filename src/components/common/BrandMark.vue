<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), {
  size: 40,
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    role="img"
    aria-label="肾友档案"
    class="brand-mark"
  >
    <defs>
      <linearGradient id="kc-brand-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#4aa3ff" />
        <stop offset="1" stop-color="#1677ff" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="14" fill="url(#kc-brand-gradient)" />
    <path
      d="M24 11.5c-5.9 6.9-9.8 11.1-9.8 16.2a9.8 9.8 0 0 0 19.6 0c0-5.1-3.9-9.3-9.8-16.2Z"
      fill="#fff"
      fill-opacity=".96"
    />
    <path
      d="M24 18.2c-2.9 3.5-4.7 5.6-4.7 8.1a4.7 4.7 0 0 0 9.4 0c0-2.5-1.8-4.6-4.7-8.1Z"
      fill="#1677ff"
      fill-opacity=".22"
    />
  </svg>
</template>

<style scoped>
.brand-mark {
  flex: none;
  border-radius: 14px;
  box-shadow: 0 6px 16px rgba(22, 119, 255, 0.2);
}
</style>
