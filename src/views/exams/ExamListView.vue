<script setup lang="ts">
import { ref } from 'vue'
import Disclaimer from '@/components/common/Disclaimer.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { INDICATOR_CATEGORIES } from '@/constants/indicators'

const activeCategory = ref('all')

const filters = [
  { code: 'all', shortName: '全部' },
  ...INDICATOR_CATEGORIES.map((category) => ({
    code: category.code,
    shortName: category.shortName,
  })),
]
</script>

<template>
  <div class="exam-list-page">
    <PageHeader title="检查记录" subtitle="按类别记录化验与影像检查">
      <template #actions>
        <RouterLink to="/exams/new" class="icon-button" aria-label="新增检查">
          <van-icon name="add-o" />
        </RouterLink>
      </template>
    </PageHeader>

    <div class="page">
      <div class="filter-scroll" aria-label="检查类别筛选">
        <button
          v-for="filter in filters"
          :key="filter.code"
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip--active': activeCategory === filter.code }"
          @click="activeCategory = filter.code"
        >
          {{ filter.shortName }}
        </button>
      </div>

      <div class="card empty-card">
        <EmptyState
          icon="records-o"
          title="还没有检查记录"
          description="记录血肌酐、eGFR、尿蛋白等指标，趋势会随每次记录自动生成。"
          action-text="新增检查"
          action-to="/exams/new"
        />
      </div>

      <section class="tip-card card">
        <h2>录入建议</h2>
        <ul>
          <li>
            <span class="tip-card__icon"><van-icon name="passed" /></span>
            常用指标优先展示，其他项目按类别折叠，减少每次输入。
          </li>
          <li>
            <span class="tip-card__icon"><van-icon name="passed" /></span>
            单位和参考范围请按本次化验单填写，不同医院可能不同。
          </li>
          <li>
            <span class="tip-card__icon"><van-icon name="passed" /></span>
            支持补录历史检查，同一天也可以记录多次。
          </li>
        </ul>
      </section>

      <Disclaimer />
    </div>
  </div>
</template>

<style scoped>
.filter-scroll {
  display: flex;
  gap: 8px;
  margin: 0 calc(var(--kc-page-gutter) * -1) 14px;
  padding: 2px var(--kc-page-gutter) 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-scroll::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  flex: none;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid var(--kc-color-border-soft);
  border-radius: var(--kc-radius-pill);
  background: var(--kc-color-surface);
  color: var(--kc-color-text-secondary);
  font-size: 12.5px;
  font-weight: 500;
}

.filter-chip--active {
  border-color: transparent;
  background: var(--kc-color-primary);
  color: #fff;
  box-shadow: 0 5px 14px rgba(22, 119, 255, 0.2);
}

.empty-card {
  padding: 6px 0;
}

.tip-card {
  margin-top: 16px;
  padding: 17px 18px;
}

.tip-card h2 {
  font-size: 14px;
  font-weight: 650;
}

.tip-card ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 11px;
}

.tip-card li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.tip-card__icon {
  display: flex;
  flex: none;
  margin-top: 1px;
  color: var(--kc-color-success);
  font-size: 14px;
}
</style>
