<script setup lang="ts">
import { computed, ref } from 'vue'
import ChartPlaceholder from '@/components/charts/ChartPlaceholder.vue'
import Disclaimer from '@/components/common/Disclaimer.vue'
import SectionTitle from '@/components/common/SectionTitle.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { getIndicator, TREND_INDICATOR_CODES } from '@/constants/indicators'

interface TrendOption {
  code: string
  label: string
}

const indicatorOptions: TrendOption[] = []

for (const code of TREND_INDICATOR_CODES) {
  const indicator = getIndicator(code)
  if (indicator) {
    indicatorOptions.push({ code, label: indicator.shortName })
  }
}

indicatorOptions.push({ code: 'bp', label: '血压' }, { code: 'weight', label: '体重' })

const ranges = [
  { code: '3m', label: '近 3 个月' },
  { code: '6m', label: '近 6 个月' },
  { code: '1y', label: '近 1 年' },
  { code: 'all', label: '全部' },
]

const activeIndicator = ref('scr')
const activeRange = ref('6m')

const activeLabel = computed(
  () =>
    indicatorOptions.find((option) => option.code === activeIndicator.value)?.label ?? '趋势',
)
</script>

<template>
  <div class="trends-page">
    <PageHeader title="趋势分析" subtitle="同一指标、同一单位分开展示">
      <template #actions>
        <RouterLink to="/exams/new" class="icon-button" aria-label="新增检查">
          <van-icon name="add-o" />
        </RouterLink>
      </template>
    </PageHeader>

    <div class="page">
      <div class="indicator-scroll" aria-label="指标选择">
        <button
          v-for="option in indicatorOptions"
          :key="option.code"
          type="button"
          class="indicator-chip"
          :class="{ 'indicator-chip--active': activeIndicator === option.code }"
          @click="activeIndicator = option.code"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="card range-card">
        <button
          v-for="range in ranges"
          :key="range.code"
          type="button"
          class="range-button"
          :class="{ 'range-button--active': activeRange === range.code }"
          @click="activeRange = range.code"
        >
          {{ range.label }}
        </button>
      </div>

      <section class="card chart-card">
        <div class="chart-card__head">
          <div>
            <h2>{{ activeLabel }}</h2>
            <p>按化验单单位分开显示，不混合不同单位</p>
          </div>
          <span class="chip chip--neutral">暂无单位</span>
        </div>

        <ChartPlaceholder />

        <p class="chart-card__footnote">
          同日多次检查会保留为多个数据点；缺失日期不补零、不插值。
        </p>
      </section>

      <section class="card data-card">
        <SectionTitle title="数据点" subtitle="记录后可在此查看原始数值" />
        <div class="data-card__empty">
          <van-icon name="records-o" />
          <span>暂无数据点</span>
        </div>
      </section>

      <section class="insight-card card">
        <h2>关于趋势解读</h2>
        <ul>
          <li>本工具只展示已记录的数据，不自动判断“好转”或“恶化”。</li>
          <li>不同医院、不同试剂的参考范围可能不同，请以当次化验单为准。</li>
          <li>尿蛋白定性（如 1+、2+）不参与数值折线图，将单独以时间线展示。</li>
        </ul>
      </section>

      <Disclaimer />
    </div>
  </div>
</template>

<style scoped>
.indicator-scroll {
  display: flex;
  gap: 8px;
  margin: 0 calc(var(--kc-page-gutter) * -1) 14px;
  padding: 2px var(--kc-page-gutter) 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.indicator-scroll::-webkit-scrollbar {
  display: none;
}

.indicator-chip {
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

.indicator-chip--active {
  border-color: transparent;
  background: var(--kc-color-primary);
  color: #fff;
  box-shadow: 0 5px 14px rgba(22, 119, 255, 0.2);
}

.range-card {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
  padding: 4px;
}

.range-button {
  min-height: 34px;
  padding: 0 4px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--kc-color-text-secondary);
  font-size: 11.5px;
  font-weight: 500;
}

.range-button--active {
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary-dark);
}

.chart-card {
  margin-top: 14px;
  padding: 16px;
}

.chart-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 13px;
}

.chart-card__head h2 {
  font-size: 15px;
  font-weight: 650;
}

.chart-card__head p {
  margin-top: 3px;
  color: var(--kc-color-text-tertiary);
  font-size: 11px;
}

.chart-card__footnote {
  margin-top: 12px;
  color: var(--kc-color-text-tertiary);
  font-size: 10.5px;
  line-height: 1.6;
}

.data-card {
  margin-top: 14px;
  padding: 16px;
}

.data-card__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 92px;
  border-radius: 12px;
  background: var(--kc-color-surface-soft);
  color: var(--kc-color-text-tertiary);
  font-size: 12px;
}

.data-card__empty .van-icon {
  font-size: 17px;
}

.insight-card {
  margin-top: 14px;
  padding: 16px 18px;
}

.insight-card h2 {
  font-size: 14px;
  font-weight: 650;
}

.insight-card ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.insight-card li {
  position: relative;
  padding-left: 12px;
  color: var(--kc-color-text-secondary);
  font-size: 11.5px;
  line-height: 1.65;
}

.insight-card li::before {
  position: absolute;
  top: 0.72em;
  left: 1px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #b8c3d3;
  content: '';
}
</style>
