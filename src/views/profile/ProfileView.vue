<script setup lang="ts">
import Disclaimer from '@/components/common/Disclaimer.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { APP_VERSION } from '@/constants/app'

const managementLinks = [
  {
    to: '/medications',
    title: '用药管理',
    description: '当前用药与历史剂量调整',
    icon: 'notes-o',
    tone: 'blue',
  },
  {
    to: '/daily',
    title: '日常记录',
    description: '血压、心率、体重与身体情况',
    icon: 'clock-o',
    tone: 'green',
  },
  {
    to: '/followups',
    title: '复查计划',
    description: '下次复查时间与检查项目',
    icon: 'calendar-o',
    tone: 'amber',
  },
  {
    to: '/biopsy',
    title: '肾穿刺档案',
    description: 'Lee 分级、MEST-C 与病理备注',
    icon: 'medal-o',
    tone: 'violet',
  },
]

const dataLinks = [
  {
    to: '/settings/backup',
    title: '备份与恢复',
    description: '导出 JSON 备份，换设备时恢复',
    icon: 'shield-o',
    tone: 'blue',
  },
  {
    to: '/settings/privacy',
    title: '隐私与本地存储',
    description: '数据存在哪里、可能丢失的情况',
    icon: 'lock',
    tone: 'green',
  },
]

const aboutLinks = [
  {
    to: '/settings/about',
    title: '关于肾友档案',
    description: '版本信息与免责声明',
    icon: 'info-o',
    tone: 'gray',
  },
]
</script>

<template>
  <div class="profile-page">
    <PageHeader title="我的档案" subtitle="基本资料与健康管理入口" />

    <div class="page">
      <section class="card profile-card">
        <div class="profile-card__avatar">
          <van-icon name="user-o" />
        </div>
        <div class="profile-card__text">
          <h2>未填写基本资料</h2>
          <p>补充出生年份、确诊信息后，复诊整理更方便。</p>
        </div>
        <RouterLink to="/profile/edit" class="profile-card__edit">
          <van-icon name="edit" />
          编辑
        </RouterLink>
      </section>

      <div class="local-banner">
        <span class="local-banner__icon"><van-icon name="shield-o" /></span>
        <div>
          <strong>本地模式</strong>
          <p>数据仅保存在当前浏览器，不会上传到服务器。</p>
        </div>
      </div>

      <section class="page-section">
        <h2 class="group-title">健康管理</h2>
        <div class="menu-card card">
          <RouterLink
            v-for="link in managementLinks"
            :key="link.to"
            :to="link.to"
            class="menu-row"
          >
            <span class="menu-row__icon" :class="`menu-row__icon--${link.tone}`">
              <van-icon :name="link.icon" />
            </span>
            <span class="menu-row__text">
              <strong>{{ link.title }}</strong>
              <small>{{ link.description }}</small>
            </span>
            <van-icon name="arrow" class="menu-row__arrow" />
          </RouterLink>
        </div>
      </section>

      <section class="page-section">
        <h2 class="group-title">数据与备份</h2>
        <div class="menu-card card">
          <RouterLink v-for="link in dataLinks" :key="link.to" :to="link.to" class="menu-row">
            <span class="menu-row__icon" :class="`menu-row__icon--${link.tone}`">
              <van-icon :name="link.icon" />
            </span>
            <span class="menu-row__text">
              <strong>{{ link.title }}</strong>
              <small>{{ link.description }}</small>
            </span>
            <van-icon name="arrow" class="menu-row__arrow" />
          </RouterLink>
        </div>
      </section>

      <section class="page-section">
        <h2 class="group-title">关于</h2>
        <div class="menu-card card">
          <RouterLink v-for="link in aboutLinks" :key="link.to" :to="link.to" class="menu-row">
            <span class="menu-row__icon" :class="`menu-row__icon--${link.tone}`">
              <van-icon :name="link.icon" />
            </span>
            <span class="menu-row__text">
              <strong>{{ link.title }}</strong>
              <small>{{ link.description }}</small>
            </span>
            <van-icon name="arrow" class="menu-row__arrow" />
          </RouterLink>
        </div>
      </section>

      <p class="version-line">肾友档案 v{{ APP_VERSION }} · 本地版</p>

      <Disclaimer />
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px 16px;
}

.profile-card__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 56px;
  height: 56px;
  border-radius: 19px;
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.35), transparent 45%),
    linear-gradient(145deg, #e7f2ff, #d8e9ff);
  color: var(--kc-color-primary);
  font-size: 27px;
}

.profile-card__text {
  min-width: 0;
  flex: 1;
}

.profile-card__text h2 {
  font-size: 15.5px;
  font-weight: 650;
}

.profile-card__text p {
  margin-top: 3px;
  color: var(--kc-color-text-tertiary);
  font-size: 11px;
  line-height: 1.55;
}

.profile-card__edit {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex: none;
  min-height: 32px;
  padding: 0 10px;
  border-radius: var(--kc-radius-pill);
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary-dark);
  font-size: 11.5px;
  font-weight: 500;
}

.local-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 12px;
  margin-bottom: 24px;
  padding: 12px 14px;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  background: #f4f9ff;
}

.local-banner__icon {
  display: flex;
  flex: none;
  margin-top: 1px;
  color: var(--kc-color-primary);
  font-size: 17px;
}

.local-banner strong {
  font-size: 12px;
  font-weight: 650;
}

.local-banner p {
  margin-top: 1px;
  color: var(--kc-color-text-secondary);
  font-size: 10.5px;
  line-height: 1.55;
}

.group-title {
  margin-bottom: 9px;
  padding-left: 2px;
  color: var(--kc-color-text-secondary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.menu-card {
  overflow: hidden;
  padding: 0 16px;
}

.menu-row {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 66px;
  border-bottom: 1px solid var(--kc-color-border-soft);
}

.menu-row:last-child {
  border-bottom: 0;
}

.menu-row__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  font-size: 17px;
}

.menu-row__icon--blue {
  background: var(--kc-color-primary-soft);
  color: var(--kc-color-primary);
}

.menu-row__icon--green {
  background: var(--kc-color-success-soft);
  color: var(--kc-color-success);
}

.menu-row__icon--amber {
  background: var(--kc-color-warning-soft);
  color: var(--kc-color-warning);
}

.menu-row__icon--violet {
  background: #f1edff;
  color: #7a5af8;
}

.menu-row__icon--gray {
  background: #f2f4f7;
  color: #667085;
}

.menu-row__text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.menu-row__text strong {
  font-size: 13.5px;
  font-weight: 600;
}

.menu-row__text small {
  margin-top: 1px;
  overflow: hidden;
  color: var(--kc-color-text-tertiary);
  font-size: 10.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-row__arrow {
  flex: none;
  color: var(--kc-color-text-tertiary);
  font-size: 13px;
}

.version-line {
  margin-top: 18px;
  color: var(--kc-color-text-tertiary);
  font-size: 10.5px;
  text-align: center;
}

@media (min-width: 900px) {
  .profile-card {
    padding: 22px 20px;
  }

  .menu-row {
    min-height: 72px;
  }
}
</style>
