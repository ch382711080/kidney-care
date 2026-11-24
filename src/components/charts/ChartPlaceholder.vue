<template>
  <div class="chart-placeholder">
    <svg
      class="chart-placeholder__grid"
      viewBox="0 0 320 150"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="#eaf0f7" stroke-width="1">
        <line x1="0" y1="20" x2="320" y2="20" />
        <line x1="0" y1="52" x2="320" y2="52" />
        <line x1="0" y1="84" x2="320" y2="84" />
        <line x1="0" y1="116" x2="320" y2="116" />
      </g>
      <polyline
        points="8,118 52,100 96,107 140,76 184,86 228,55 272,66 312,43"
        fill="none"
        stroke="#c4dcff"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="6 7"
      />
      <g fill="#ffffff" stroke="#a9ccff" stroke-width="2">
        <circle cx="52" cy="100" r="3.5" />
        <circle cx="140" cy="76" r="3.5" />
        <circle cx="228" cy="55" r="3.5" />
        <circle cx="312" cy="43" r="3.5" />
      </g>
    </svg>

    <div class="chart-placeholder__empty">
      <span class="chart-placeholder__icon">
        <van-icon name="chart-trending-o" />
      </span>
      <strong>暂无趋势数据</strong>
      <span>记录检查后，这里会自动生成变化曲线</span>
    </div>
  </div>
</template>

<style scoped>
.chart-placeholder {
  position: relative;
  min-height: 214px;
  overflow: hidden;
  border-radius: 14px;
  background: linear-gradient(180deg, #fbfdff 0%, #f7faff 100%);
}

.chart-placeholder::after {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 52%,
    rgba(255, 255, 255, 0.96) 0%,
    rgba(255, 255, 255, 0.78) 30%,
    rgba(255, 255, 255, 0) 62%
  );
  content: '';
  pointer-events: none;
}

.chart-placeholder__grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;
}

.chart-placeholder__empty {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 20px;
  text-align: center;
}

.chart-placeholder__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin-bottom: 5px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 5px 16px rgba(22, 119, 255, 0.1);
  color: var(--kc-color-primary);
  font-size: 23px;
}

.chart-placeholder__empty strong {
  font-size: 14px;
  font-weight: 650;
}

.chart-placeholder__empty span:last-child {
  color: var(--kc-color-text-tertiary);
  font-size: 11.5px;
}
</style>
