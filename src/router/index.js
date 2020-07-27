import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/Layout'
import Home from '@/components/Home'
import Page404 from '@/components/layout/404'
import Login from '@/components/Login'
import ServiceBanner from "@/components/app/ServiceBanner";
import CommunityBanner from "@/components/app/CommunityBanner";
import Administrator from "@/components/admin/Administrator";

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: Layout,
    meta: { title: '首页' },
    children: [
      {
        path: '/',
        meta: { title: '首页' },
        component: Home
      },

      {
        path: '/app/service-banner',
        meta: {title: '服务轮播图'},
        component: ServiceBanner,
        props: {
          type: 1
        }
      },
      {
        path: '/app/community-banner',
        meta: {title: '社区轮播图'},
        component: CommunityBanner,
        props: {
          type: 2
        }
      },

      {
        path: '/system/administration',
        meta: {title: '管理员'},
        component: Administrator
      },

      // {
      //   path: '/museum/traffic',
      //   meta: { title: '地理交通' },
      //   component: RichContent,
      //   props: {
      //     fetchActionUrl: '/apis/admin/geographicTraffic',
      //     editActionUrl: '/apis/admin/geographicTraffic',
      //     label: '地理交通'
      //   }
      // },

      {
        path: '404',
        meta: {
          noBorder: true,
          title: '页面找不到'
        },
        component: Page404
      }
    ]
  }, {
    path: '/login',
    meta: {
      title: '登录'
    },
    component: Login
  }, {
    path: '*',
    redirect: '/'
  }]
})
