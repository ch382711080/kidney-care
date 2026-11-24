<script setup lang="ts">
import { useRouter } from 'vue-router'
import { goBackOrHome } from '@/utils/navigation'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    back?: boolean
  }>(),
  {
    subtitle: '',
    back: false,
  },
)

const router = useRouter()

function goBack() {
  goBackOrHome(router)
}
</script>

<template>
  <header class="page-header">
    <div class="page-header__bar">
      <button v-if="back" class="page-header__back" type="button" aria-label="返回" @click="goBack">
        <van-icon name="arrow-left" />
      </button>

      <div class="page-header__titles">
        <h1 class="page-header__title">{{ title }}</h1>
        <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
      </div>

      <div class="page-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 20;
  padding-top: calc(env(safe-area-inset-top) + 10px);
  background: rgba(245, 247, 250, 0.9);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.page-header__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: var(--kc-content-width);
  min-height: 44px;
  margin: 0 auto;
  padding: 4px var(--kc-page-gutter) 10px;
}

.page-header__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid var(--kc-color-border-soft);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  color: var(--kc-color-text);
}

.page-header__titles {
  min-width: 0;
  flex: 1;
}

.page-header__title {
  overflow: hidden;
  font-size: 21px;
  font-weight: 650;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-header__subtitle {
  margin-top: 2px;
  overflow: hidden;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
}

@media (min-width: 900px) {
  .page-header {
    padding-top: 22px;
  }

  .page-header__title {
    font-size: 24px;
  }
}
</style>
