<template>
  <van-tabbar route fixed :border="false" safe-area-inset-bottom class="kc-tabbar">
    <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item replace to="/exams" icon="records-o">检查</van-tabbar-item>
    <van-tabbar-item replace to="/trends" icon="chart-trending-o">趋势</van-tabbar-item>
    <van-tabbar-item replace to="/profile" icon="user-o">档案</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
.kc-tabbar {
  z-index: 50;
}

@media (min-width: 900px) {
  .kc-tabbar {
    display: none;
  }
}
</style>
