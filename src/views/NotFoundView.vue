<script setup lang="ts">
import PageHeader from '@/components/layout/PageHeader.vue'
</script>

<template>
  <div class="not-found-page">
    <PageHeader title="页面不存在" back />

    <div class="page">
      <section class="card not-found-card">
        <div class="not-found-card__icon">
          <van-icon name="question-o" />
        </div>
        <h1>找不到这个页面</h1>
        <p>链接可能已失效，或页面地址有误。请回到首页继续使用。</p>
        <RouterLink to="/home">
          <van-button type="primary" round>回到首页</van-button>
        </RouterLink>
      </section>
    </div>
  </div>
</template>

<style scoped>
.not-found-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 38px 22px 32px;
  text-align: center;
}

.not-found-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 66px;
  border-radius: 22px;
  background: #f2f4f7;
  color: #667085;
  font-size: 30px;
}

.not-found-card h1 {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 650;
}

.not-found-card p {
  max-width: 300px;
  margin: 7px 0 20px;
  color: var(--kc-color-text-secondary);
  font-size: 12.5px;
  line-height: 1.7;
}
</style>
