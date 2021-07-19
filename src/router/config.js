import TabsView from '@/layouts/tabs/TabsView'
// import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'
// let roleState = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).role : false 
// 路由配置
const options = {
  routes: [{
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [{
          path: 'index',
          name: '首页',
          meta: {
            icon: 'bank'
          },
          component: () => import('@/pages/index/home')
        },
        {
          path: 'menu',
          name: '常用功能',
          meta: {
            icon: 'appstore'
          },
          component: PageView,
          children: [{
            path: 'search',
            name: '查询记录',
            component: () => import('@/pages/menu/search')
          }]
        },
        {
          path: 'system',
          name: '系统设置',
          meta: {
            icon: 'setting',
            invisible: false  
          },
          component: PageView,
          children: [{
            path: 'user',
            name: '子账户管理',
            component: () => import('@/pages/system/user')
          }]
        },
      ]

    },
  ]
}
export default options