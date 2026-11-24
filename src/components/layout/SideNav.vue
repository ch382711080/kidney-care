<script setup lang="ts">
import BrandMark from '@/components/common/BrandMark.vue'
import { APP_NAME, APP_SUBTITLE, APP_VERSION } from '@/constants/app'

const links = [
  { to: '/home', label: '首页', icon: 'home-o' },
  { to: '/exams', label: '检查记录', icon: 'records-o' },
  { to: '/trends', label: '趋势分析', icon: 'chart-trending-o' },
  { to: '/profile', label: '我的档案', icon: 'user-o' },
]
</script>

<template>
  <aside class="side-nav">
    <RouterLink to="/home" class="side-nav__brand">
      <BrandMark :size="40" />
      <span class="side-nav__brand-text">
        <strong>{{ APP_NAME }}</strong>
        <small>{{ APP_SUBTITLE }}</small>
      </span>
    </RouterLink>

    <nav class="side-nav__nav" aria-label="主导航">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="side-nav__link">
        <van-icon :name="link.icon" />
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>

    <div class="side-nav__footer">
      <span class="chip chip--neutral">本地模式</span>
      <p class="side-nav__version">v{{ APP_VERSION }}</p>
      <p>数据仅保存在当前浏览器</p>
    </div>
  </aside>
</template>

<style scoped>
.side-nav {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 60;
  display: none;
  flex-direction: column;
  width: var(--kc-sidebar-width);
  height: 100vh;
  height: 100dvh;
  padding: 26px 18px 22px;
  border-right: 1px solid var(--kc-color-border-soft);
  background:
    radial-gradient(circle at 20% 0%, rgba(22, 119, 255, 0.08), transparent 34%),
    var(--kc-color-surface);
}

.side-nav__brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 6px;
}

.side-nav__brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.side-nav__brand-text strong {
  font-size: 17px;
  font-weight: 650;
  letter-spacing: 0.01em;
}

.side-nav__brand-text small {
  margin-top: 2px;
  overflow: hidden;
  color: var(--kc-color-text-tertiary);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.side-nav__nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 34px;
}

.side-nav__link {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 44px;
  padding: 0 13px;
  border-radius: 11px;
  color: var(--kc-color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.side-nav__link .van-icon {
  font-size: 19px;
}

.side-nav__link:hover {
  background: var(--kc-color-surface-soft);
  color: var(--kc-color-text);
}

.side-nav__link.router-link-active {
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary-dark);
}

.side-nav__footer {
  margin-top: auto;
  padding: 0 6px;
  color: var(--kc-color-text-tertiary);
  font-size: 11px;
  line-height: 1.7;
}

.side-nav__version {
  margin-top: 8px;
  color: var(--kc-color-text-secondary);
  font-variant-numeric: tabular-nums;
}

@media (min-width: 900px) {
  .side-nav {
    display: flex;
  }
}
</style>
