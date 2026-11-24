<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import { goBackOrHome } from '@/utils/navigation'

const route = useRoute()
const router = useRouter()

const title = computed(() => route.meta.title ?? '功能')
const description = computed(
  () => route.meta.description ?? '该功能将在后续阶段开放，当前先完成页面骨架。',
)

function goBack() {
  goBackOrHome(router)
}
</script>

<template>
  <div class="coming-soon-page">
    <PageHeader :title="title" back />

    <div class="page">
      <section class="card coming-soon-card">
        <div class="coming-soon-card__icon">
          <van-icon :name="route.meta.icon ?? 'underway-o'" />
        </div>
        <h1>{{ title }}正在开发中</h1>
        <p>{{ description }}</p>

        <div class="coming-soon-card__actions">
          <RouterLink to="/home">
            <van-button type="primary" round>回到首页</van-button>
          </RouterLink>
          <button type="button" class="text-button text-button--muted" @click="goBack">
            返回上一页
          </button>
        </div>
      </section>

      <p class="coming-soon-note">
        当前为第一阶段：页面骨架与本地版结构。不会用模拟数据冒充已完成功能。
      </p>
    </div>
  </div>
</template>

<style scoped>
.coming-soon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 34px 22px 28px;
  text-align: center;
}

.coming-soon-card__icon {
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

.coming-soon-card h1 {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 650;
}

.coming-soon-card p {
  max-width: 330px;
  margin-top: 7px;
  color: var(--kc-color-text-secondary);
  font-size: 12.5px;
  line-height: 1.7;
}

.coming-soon-card__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
}

.coming-soon-card__actions :deep(.van-button) {
  min-width: 150px;
}

.coming-soon-note {
  margin-top: 16px;
  padding: 0 12px;
  color: var(--kc-color-text-tertiary);
  font-size: 10.5px;
  line-height: 1.6;
  text-align: center;
}
</style>
