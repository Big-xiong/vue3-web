export default () => [
  {
    path: '/:catchAll(.*)',
    name: '404',
    meta: {
      layout: false,
    },
    component: () => import('@/views/error/Page404.vue'),
  },
  {
    path: '/403',
    name: '403',
    meta: {
      layout: false,
    },
    component: () => import('@/views/error/Page403.vue'),
  },
  {
    path: '/500',
    name: '500',
    meta: {
      layout: false,
    },
    component: () => import('@/views/error/Page500.vue'),
  },
  {
    path: '/firewall',
    name: 'firewall',
    meta: {
      layout: false,
    },
    component: () => import('@/views/error/Pagefirewall.vue'),
  },
];
