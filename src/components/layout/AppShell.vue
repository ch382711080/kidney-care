<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SideNav from '@/components/layout/SideNav.vue'
import TabBar from '@/components/layout/TabBar.vue'

const route = useRoute()
const showTabbar = computed(() => route.meta.tab !== false)
</script>

<template>
  <div class="app-shell">
    <SideNav />

    <div class="app-shell__body">
      <main
        class="app-shell__main"
        :class="{ 'app-shell__main--with-tabbar': showTabbar }"
      >
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>

      <TabBar v-if="showTabbar" />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  min-height: 100dvh;
}

.app-shell__body {
  min-height: 100vh;
  min-height: 100dvh;
}

.app-shell__main {
  min-height: 100vh;
  min-height: 100dvh;
}

.app-shell__main--with-tabbar {
  padding-bottom: calc(var(--kc-tabbar-height) + env(safe-area-inset-bottom) + 14px);
}

@media (min-width: 900px) {
  .app-shell__body {
    margin-left: var(--kc-sidebar-width);
  }

  .app-shell__main--with-tabbar {
    padding-bottom: 0;
  }
}
</style>
