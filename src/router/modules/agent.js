// todo 匹配帮助中心、个人资料、修改密码的路由匹配h5

export default () => [
  {
    path: '/affiliate',
    name: 'agentLayout',
    redirect: '/affiliate/home',
    components: {
      default: () => import('@/components/Layout/agent.vue'),
      header: () => import('@/components/Layout/header/agent.vue'),
      footer: () => import('@/components/Layout/footer/agent.vue'),
    },
    children: [
      {
        path: 'home',
        name: 'agentHome',
        meta: {
          parent: 'none',
          title: '首页',
          showTitle: false,
          layout: true,
        },
        component: () => import('@/views/agent/home/index.vue'),
      },
      {
        path: 'member-list',
        name: 'agentVipList',
        meta: {
          parent: '会员管理',
          title: '会员列表',
          layout: true,
        },
        component: () => import('@/views/agent/member-list/index.vue'),
      },
      {
        path: 'member-register',
        name: 'agentVipRegister',
        meta: {
          parent: '会员管理',
          title: '会员开户',
          layout: true,
        },
        component: () => import('@/views/agent/member-register/index.vue'),
      },
      {
        path: 'affiliate-list',
        name: 'agentMemberList',
        meta: {
          parent: '代理管理',
          title: '代理列表',
          layout: true,
        },
        component: () => import('@/views/agent/agent-list/index.vue'),
      },
      {
        path: 'affiliate-register',
        name: 'agentMemberRegister',
        meta: {
          parent: '代理管理',
          title: '代理开户',
          layout: true,
        },
        component: () => import('@/views/agent/agent-register/index.vue'),
      },
      {
        path: 'subordinate-charge',
        name: 'agentSubordinateCharge',
        meta: {
          parent: '财务中心',
          title: '下级代充',
          layout: true,
        },
        component: () => import('@/views/agent/subordinate-charge/index.vue'),
      },
      {
        path: 'recharge',
        name: 'agentRecharge',
        meta: {
          parent: '财务中心',
          title: '充值',
          layout: true,
        },
        component: () => import('@/views/agent/recharge/index.vue'),
      },
      {
        path: 'financial-table',
        name: 'agentFinancialTable',
        meta: {
          parent: '财务中心',
          title: '财务报表',
          showTitle: false,
          layout: true,
        },
        component: () => import('@/views/agent/financial-table/index.vue'),
      },
      {
        path: 'commission-table',
        name: 'agentCommissionTable',
        meta: {
          parent: '财务中心',
          title: '佣金报表',
          showTitle: false,
          layout: true,
        },
        component: () => import('@/views/agent/commission-table/index.vue'),
      },
      {
        path: 'popularize-link',
        name: 'agentPopularizeLink',
        meta: {
          parent: '推广中心',
          title: '推广链接',
          layout: true,
        },
        component: () => import('@/views/agent/popularize-link/index.vue'),
      },
      {
        path: 'popularize-material',
        name: 'agentPopularizeMaterial',
        meta: {
          parent: '推广中心',
          title: '推广素材',
          layout: true,
        },
        component: () => import('@/views/agent/popularize-material/index.vue'),
      },
      {
        path: 'omit-application',
        name: 'agentOmitApplication',
        meta: {
          parent: '个人中心',
          title: '遗漏申请',
          layout: true,
        },
        component: () => import('@/views/agent/omit-application/index.vue'),
      },
      {
        path: 'personal-information',
        name: 'agentPersonalInformation',
        meta: {
          parent: '个人中心',
          title: '个人资料',
          layout: true,
        },
        component: () => import('@/views/agent/personal-information/index.vue'),
      },
      {
        path: 'card-management',
        name: 'agentCardManagement',
        meta: {
          parent: '个人中心',
          title: '银行卡管理',
          layout: true,
        },
        component: () => import('@/views/agent/card-management/index.vue'),
      },
      {
        path: 'change-password',
        name: 'agentChangePassword',
        meta: {
          parent: '个人中心',
          title: '修改密码',
          layout: true,
        },
        component: () => import('@/views/agent/change-password/index.vue'),
      },
      {
        path: 'auth/login',
        redirect: '/affiliate#login',
      },
      {
        path: 'auth/register',
        redirect: '/affiliate#register',
      },
      {
        path: '',
        name: 'agentLanding',
        meta: {
          title: '代理中心',
          hide: true,
          layout: false,
        },
        component: () => import('@/views/agent/agentLanding/index.vue'),
      },
    ],
  },
];
