export default [
  {
    path: '/signin',
    component: 'signin',
  },
  {
    path: '/',
    component: '@/layouts/index', // 和wrapper差不多意思 都是高阶组件，但component必须有且仅有一个，所以放这吧，语义上也代表具体内容非其它特殊逻辑
    wrappers: ['@/wrappers/auth'],
    routes: [
      {
        path: '/',
        component: '@/pages/home',
      },
      {
        path: '/home',
        component: '@/pages/home',
      },
    ],
  },
];
