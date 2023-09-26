export default () => [
  {
    path: '/',
    redirect: { name: 'index' },
    components: {
      default: () => import('@/components/Layout/index.vue'),
      header: () => import('$/components/Layout/header/index.vue'),
      footer: () => import('$/components/Layout/footer/index.vue'),
    },
    children: [
      {
        path: '/',
        name: 'index',
        meta: {
          title: '主页',
        },
        component: () => import('@/views/index/home/index.vue'),
      },
      {
        path: '/sport',
        name: 'sport',
        meta: {
          title: '体育',
        },
        component: () => import('@/views/index/sport/index.vue'),
      },
      {
        path: '/esport',
        name: 'esport',
        meta: {
          title: '电竞',
        },
        component: () => import('@/views/index/esport/index.vue'),
      },

      {
        path: '/casino',
        name: 'casino',
        meta: {
          title: '真人',
        },
        component: () => import('@/views/index/casino/index.vue'),
      },
      {
        path: '/slot',
        name: 'slot',
        meta: {
          title: '电子',
        },
        component: () => import('@/views/index/slot/index.vue'),
      },
      {
        path: '/lottery',
        name: 'lottery',
        meta: {
          title: '彩票',
        },
        component: () => import('@/views/index/lottery/index.vue'),
      },
      // {
      //   path: '/fishing',
      //   name: 'fishing',
      //   meta: {
      //     title: '捕鱼',
      //   },
      //   component: () => import('@/views/index/fishing/index.vue'),
      // },
      {
        path: '/promos',
        name: 'promos',
        meta: {
          title: '优惠',
        },
        component: () => import('@/views/index/promos/index.vue'),
      },

    ],
  },
  {
    path: '/',
    redirect: { name: 'index' },
    components: {
      default: () => import('@/components/Layout/index.vue'),
      header: () => import('$/components/Layout/header/index.vue'),
      footer: () => import('$/components/Layout/footer/index.vue'),
    },
    children: [
      {
        path: '/vip',
        name: 'vip',
        meta: {
          title: 'VIP',
        },
        component: () => import('@/views/index/vip/index.vue'),
      },
      {
        path: '/landing',
        name: 'landing',
        meta: {
          title: '落地页',
          layout: false,
        },
        component: () => import('@/views/index/landing/index.vue'),
      },
      {
        path: '/appDownload',
        name: 'appDownload',
        meta: {
          title: 'APP下载',
        },
        component: () => import('@/views/index/appDownload/index.vue'),
      },
      {
        path: '/restricted',
        name: 'restricted',
        meta: {
          title: '访问受限',
          layout: false,
        },
        component: () => import('@/views/index/restricted/index.vue'),
      },
      {
        path: '/trans/rank',
        name: 'transRank',
        meta: {
          title: '取款榜单',
        },
        component: () => import('@/views/index/transRank/index.vue'),
      },
    ],
  },
  {
    path: '/play',
    name: 'gamePlay',
    meta: {
      title: '游戏',
      layout: false,
      scroll: false,
    },
    component: () => import('@/views/play.vue'),
  },
  {
    path: '/',
    redirect: { name: 'index' },
    components: {
      default: () => import('@/components/Layout/index.vue'),
      header: () => import('$/components/Layout/header/index.vue'),
      footer: () => import('$/components/Layout/footer/index.vue'),
    },
    children: [
      {
        path: '/activity/redEnvelopeRain',
        name: 'redEnvelopeRain',
        meta: {
          index: 'redEnvelopeRain',
        },
        component: () => import('@/views/index/activity/redEnvelopeRain/index.vue'),
      },
    ],
  },
];
