/*
 * @Author: your name
 * @Date: 2020-03-17 16:42:40
 * @LastEditTime: 2020-04-01 14:41:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Bi_quasar\src\router\routes.js
 */
// import Index from 'pages/Index.vue'
export const leftRouter = [
  {
    path: '/', name: 'base', meta: { title: '基础信息', access: true }, component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/user', name: 'userlist', meta: { title: '用户管理', access: true }, component: () => import('pages/base/user.vue') },
      { path: '/role', name: 'rolelist', meta: { title: '角色管理', access: true }, component: () => import('pages/base/role.vue') },
      { path: '/device', name: 'devicelist', meta: { title: '检测设备管理', access: true }, component: () => import('pages/base/device.vue') }
    ]
  },
  { path: '/data-source', name: 'data-source', meta: { title: '数据源设计', access: true }, component: () => import('pages/source/index.vue') },
  {
    path: '/', name: 'report', meta: { title: '报表设计', access: true }, component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/excel', name: 'excel', meta: { title: 'excel', access: true }, component: () => import('pages/report/excel.vue') },
      { path: '/web', name: 'web', meta: { title: 'web', access: true }, component: () => import('pages/report/web.vue') },
      { path: '/mobile', name: 'mobile', meta: { title: 'mobile', access: true }, component: () => import('pages/report/mobile.vue') },
      { path: '/charts', name: 'charts', meta: { title: '图表', access: true }, component: () => import('pages/report/chart.vue') },
      { path: '/datavdesign', name: 'datavdesign', meta: { title: '大屏设计', access: true }, component: () => import('pages/report/datavdesign.vue') },
    ]
  },
  { path: '/report-view', name: 'report', meta: { title: '报表查询', access: true }, component: () => import('pages/report-view/index.vue') },
  // { path: '/datav', name: 'datav', meta: { title: '大屏模板', access: true }, component: () => import('pages/datav/ynltest.vue') },
]

// 格式化路由
const formatRouter = (list) => {
  let res = []
  list.forEach(o => {
    if (o.children && o.children.length > 0) {
      let childList = formatRouter(o.children)
      res.push(...childList)
    } else {
      res.push(o)
    }
  })
  return res
}
const navRouter = formatRouter(leftRouter)
const routes = [
  {
    path: '/login',
    component: () => import('pages/Login/login.vue')
  },
  {
    path: '/',
    redirect: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/home', component: () => import('pages/Index.vue') },
      ...navRouter
    ]
  },
  {
    path: '/Work',
    component: () => import('pages/source/Work.vue')
  },
  // {
  //   path: '/Datavv',
  //   name: 'Datavv',
  //   component: () => import('pages/datav/ynltest.vue')
  // },
  {
    path: "/datavdesign/ynltest",
    name: "datavdesignynltest" ,
    component: () => import("pages/datav/ynltest.vue")
  },
  {
    path: "/datavdesign/lyhtest",
    name: "datavdesignlyhtest" ,
    component: () => import("pages/datav/lyhtest.vue")
  }
]
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    name: '404',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
