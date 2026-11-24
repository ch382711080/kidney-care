import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ExamListView from '@/views/exams/ExamListView.vue'
import TrendsView from '@/views/trends/TrendsView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'

const ComingSoonView = () => import('@/views/ComingSoonView.vue')
const PrivacyView = () => import('@/views/settings/PrivacyView.vue')
const AboutView = () => import('@/views/settings/AboutView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { title: '首页', tab: true },
    },
    {
      path: '/exams',
      name: 'exams',
      component: ExamListView,
      meta: { title: '检查记录', tab: true },
    },
    {
      path: '/trends',
      name: 'trends',
      component: TrendsView,
      meta: { title: '趋势分析', tab: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { title: '我的档案', tab: true },
    },
    {
      path: '/exams/new',
      name: 'exam-new',
      component: ComingSoonView,
      meta: {
        title: '新增检查',
        tab: false,
        icon: 'edit',
        description: '检查录入会在第二阶段接入：常用指标优先、单位与参考范围按化验单保存。',
      },
    },
    {
      path: '/exams/:id',
      name: 'exam-detail',
      component: ComingSoonView,
      meta: {
        title: '检查详情',
        tab: false,
        icon: 'records-o',
        description: '检查详情与修改历史会在第二阶段接入。',
      },
    },
    {
      path: '/medications',
      name: 'medications',
      component: ComingSoonView,
      meta: {
        title: '用药管理',
        tab: false,
        icon: 'notes-o',
        description: '当前用药、剂量调整和停药记录会在第三阶段接入，历史方案不会被覆盖。',
      },
    },
    {
      path: '/daily',
      name: 'daily',
      component: ComingSoonView,
      meta: {
        title: '日常记录',
        tab: false,
        icon: 'clock-o',
        description: '血压、心率、体重、水肿和尿液外观记录会在第三阶段接入。',
      },
    },
    {
      path: '/followups',
      name: 'followups',
      component: ComingSoonView,
      meta: {
        title: '复查计划',
        tab: false,
        icon: 'calendar-o',
        description: '复查日期、检查项目和完成状态会在第三阶段接入，仅在页面内提醒。',
      },
    },
    {
      path: '/biopsy',
      name: 'biopsy',
      component: ComingSoonView,
      meta: {
        title: '肾穿刺档案',
        tab: false,
        icon: 'medal-o',
        description: 'Lee 分级、MEST-C 和病理备注会在第三阶段接入；评分以原报告为准。',
      },
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: ComingSoonView,
      meta: {
        title: '编辑档案',
        tab: false,
        icon: 'edit',
        description: '基本资料编辑会在第二阶段接入，只收集出生年份、性别等必要信息。',
      },
    },
    {
      path: '/settings/backup',
      name: 'backup',
      component: ComingSoonView,
      meta: {
        title: '备份与恢复',
        tab: false,
        icon: 'shield-o',
        description:
          'JSON 导出/导入、完整性校验、导入前快照和备份提醒会在第四阶段接入。',
      },
    },
    {
      path: '/settings/privacy',
      name: 'privacy',
      component: PrivacyView,
      meta: { title: '隐私与本地存储', tab: false },
    },
    {
      path: '/settings/about',
      name: 'about',
      component: AboutView,
      meta: { title: '关于肾友档案', tab: false },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { title: '页面不存在', tab: false },
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} · 肾友档案` : '肾友档案 · IgA 肾病健康管理助手'
})

export default router
