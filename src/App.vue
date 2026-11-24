<script setup lang="ts">
import { onMounted } from 'vue'
import DatabaseUnavailable from '@/components/common/DatabaseUnavailable.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import AppShell from '@/components/layout/AppShell.vue'
import { useDataStore } from '@/stores/data'

const data = useDataStore()

onMounted(() => {
  void data.init()
})
</script>

<template>
  <DatabaseUnavailable
    v-if="data.status === 'unavailable'"
    :reason="data.failureReason"
    @retry="data.init()"
  />
  <AppShell v-else-if="data.status === 'ready'" />
  <div v-else class="app-boot">
    <LoadingState text="正在准备本地数据…" />
  </div>
</template>

<style scoped>
.app-boot {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--kc-color-bg);
}
</style>
