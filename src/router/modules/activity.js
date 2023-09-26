// 存放所有商户共有的活动路由，商户独有的路由(如10001/10029独有的activity/huobiInfo) 放到子库路由
// 新增ag系专题活动路由
export default () => [
  {
    path: '/activity',
    components: {
      default: () => import('@/components/Layout/index.vue'),
      header: () => import('$/components/Layout/header/index.vue'),
      footer: () => import('$/components/Layout/footer/index.vue'),
    },
    children: [
      // 借贷宝
      {
        path: 'loanTreasure',
        name: 'loanTreasure',
        component: () => import('@/views/index/activity/loanTreasure/index.vue'),
      },
      // 好友推荐
      {
        path: 'invitation',
        name: 'invitation',
        component: () => import('@/views/index/activity/invitation/index.vue'),
      },
      // 存款六重礼
      {
        path: 'sixGift',
        name: 'sixGift',
        component: () => import('@/views/index/activity/sixGift/index.vue'),
      },
      // 模特
      {
        path: 'welfare',
        name: 'welfare',
        component: () => import('@/views/index/activity/welfare/index.vue'),
      },
      // 虚拟币教程入口
      {
        path: 'usdtInfo',
        name: 'usdtInfo',
        component: () => import('@/views/index/activity/usdtInfo/index.vue'),
      },
      // 虚拟币活动
      {
        path: 'usdt',
        name: 'usdt',
        component: () => import('@/views/index/activity/usdt/index.vue'),
      },
      // ag系专题活动：
      // 一对一
      {
        path: 'past_appointments',
        name: 'pastAppointments',
        component: () => import('@/views/index/activity/pastAppointments/index.vue'),
      },
      // 鱼乐无限
      {
        path: 'fishHappyUnlimited',
        name: 'fishHappyUnlimited',
        component: () => import('@/views/index/activity/fishHappyUnlimited/index.vue'),
      },
      // 下载签到
      {
        path: 'downAppInfo',
        name: 'downAppInfo',
        component: () => import('@/views/index/activity/downAppInfo/index.vue'),
      },
      // 新手注册累计存款送
      {
        path: 'newerTotalDeposit',
        name: 'newerTotalDeposit',
        component: () => import('@/views/index/activity/newerTotalDeposit/index.vue'),
      },
      // 好礼三重送
      {
        path: 'spreadinfo',
        name: 'spreadinfo',
        component: () => import('@/views/index/activity/spreadinfo/index.vue'),
      },
      // 线下活动
      {
        path: 'specialDetail',
        name: 'specialDetail',
        component: () => import('@/views/index/activity/specialDetail/index.vue'),
      },
    ]
  }
];
