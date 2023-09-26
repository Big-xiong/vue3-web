export default () => [{
  path: '/register',
  redirect: { name: 'register' },
  components: {
    default: () => import('@/components/Layout/index.vue'),
    header: () => import('@/components/Layout/header/index.vue'),
    footer: () => import('@/components/Layout/footer/index.vue'),
  },
  children: [
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册',
      },
      component: () => import('@/views/index/user/register.vue'),
    },
    {
      path: '/success',
      name: 'registerSuccess',
      meta: {
      },
      component: () => import('@/views/index/user/success.vue'),
    },
    // {
    //   path: '/play',
    //   name: 'gamePlay',
    //   meta: {
    //     title: '游戏',
    //     layout: false,
    //     scroll: false
    //   },
    //   component: () => import('@/views/play.vue')
    // },
  ],
}];
