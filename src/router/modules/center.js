export default () => [
  {
    path: '/center',
    redirect: { name: 'centerHome' },
    // component: () => import('@/components/Layout/center.vue'),
    components: {
      default: () => import('@/components/Layout/center.vue'),
      header: () => import('@/components/Layout/header/index.vue'),
      footer: () => import('@/components/Layout/footer/index.vue'),
    },
    children: [
      {
        path: 'home',
        name: 'centerHome',
        icon: 'el-icon-s-home',
        meta: {
          title: '会员首页',
        },
        component: () => import('@/views/center/home/index.vue'),
      },
      {
        path: 'fund-management',
        icon: 'el-icon-s-finance',
        meta: {
          title: '资金管理',
        },
        props: true,
        redirect: { name: 'centerDeposit' },
        component: () => import('@/views/center/components/Wrap.vue'),
        children: [
          {
            path: 'deposit',
            name: 'centerDeposit',
            meta: {
              title: '存款',
            },
            component: () => import('@/views/center/fund-management/deposit/index.vue'),
          },
          {
            path: 'withdraw',
            name: 'centerWithdraw',
            meta: {
              title: '取款',
              renderTitle: false,
              noBg: true,
            },
            component: () => import('@/views/center/fund-management/withdraw/index.vue'),
          },
          // {
          //   path: 'financial',
          //   name: 'centerFinancial',
          //   meta: {
          //     title: '理财小金库',
          //     noBg: true,
          //   },
          //   component: () => import('@/views/center/fund-management/financial/index.vue'),
          // },
          {
            path: 'rebate',
            name: 'centerRebate',
            meta: {
              title: '自助洗码',
              renderTitle: false,
              noBg: true,
            },
            component: () => import('@/views/center/fund-management/rebate/index.vue'),
          },
          {
            path: 'transfer',
            name: 'centerTransfer',
            meta: {
              title: '额度转账',
              noBg: true,
            },
            component: () => import('@/views/center/fund-management/transfer/index.vue'),
          },
        ],
      },
      {
        path: 'account-settings',
        icon: 'el-icon-s-tools',
        meta: {
          title: '账户设置',
        },
        props: true,
        redirect: { name: 'centerSubscription' },
        component: () => import('@/views/center/components/Wrap.vue'),
        children: [
          {
            path: 'account-safe',
            name: 'centerAccountSafe',
            meta: {
              title: '账号安全',
            },
            component: () => import('@/views/center/account-settings/account-safe/index.vue'),
          },
          {
            path: 'bank-card',
            name: 'centerBankCard',
            meta: {
              title: '银行卡管理',
            },
            component: () => import('@/views/center/fund-management/bank-card/index.vue'),
          },
          {
            path: 'subscription',
            name: 'centerSubscription',
            meta: {
              title: '服务订阅',
            },
            component: () => import('@/views/center/account-settings/subscription/index.vue'),
          },
          {
            path: 'profile',
            name: 'centerProfile',
            meta: {
              title: '联系方式',
            },
            component: () => import('@/views/center/account-settings/profile/index.vue'),
          },
          {
            path: 'site-mail',
            name: 'centerSiteMail',
            meta: {
              title: '站内信',
            },
            component: () => import('@/views/center/account-settings/site-mail/index.vue'),
          },
          {
            path: 'notice',
            name: 'centerNotice',
            meta: {
              title: '最新公告',
            },
            component: () => import('@/views/center/account-settings/notice/index.vue'),
          },
        ],
      },
      {
        path: 'transaction-record',
        icon: 'el-icon-s-order',
        meta: {
          title: '交易记录',
        },
        props: true,
        redirect: { name: 'centerDepositRecord' },
        component: () => import('@/views/center/components/Wrap.vue'),
        children: [
          {
            path: 'deposit-record',
            name: 'centerDepositRecord',
            meta: {
              title: '存款记录',
            },
            component: () => import('@/views/center/transaction-record/deposit-record/index.vue'),
          },
          {
            path: 'withdraw-record',
            name: 'centerWithdrawRecord',
            meta: {
              title: '取款记录',
            },
            component: () => import('@/views/center/transaction-record/withdraw-record/index.vue'),
          },
          {
            path: 'transfer-record',
            name: 'centerTransferRecord',
            meta: {
              title: '转账记录',
            },
            component: () => import('@/views/center/transaction-record/transfer-record/index.vue'),
          },
          {
            path: 'bonus-record',
            name: 'centerBonusRecord',
            meta: {
              title: '红利记录',
            },
            component: () => import('@/views/center/transaction-record/bonus-record/index.vue'),
          },
          {
            path: 'game-record',
            name: 'centerGameRecord',
            meta: {
              title: '投注记录',
            },
            component: () => import('@/views/center/transaction-record/game-record/index.vue'),
          },
          {
            path: 'account-change-record',
            name: 'centerAccountChangeRecord',
            meta: {
              title: '账变记录',
            },
            component: () => import('@/views/center/transaction-record/account-change-record/index.vue'),
          },
        ],
      },
      // {
      //   path: 'my-vip',
      //   hiddenSelf: true,
      //   props: true,
      //   component: () => import('@/views/center/components/Wrap.vue'),
      //   redirect: { name: 'myVip' },
      //   children: [
      //     {
      //       path: 'my-vip',
      //       name: 'myVip',
      //       icon: 'el-icon-star-on',
      //       meta: {
      //         title: 'VIP特权',
      //       },
      //       component: () => import('@/views/center/my-vip/index.vue'),
      //     },
      //   ],
      // },
    ],
  },
];
