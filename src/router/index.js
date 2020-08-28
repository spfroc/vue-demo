import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/Layout'
import Home from '@/components/Home'
import Page404 from '@/components/layout/404'
import Login from '@/components/Login'
import ServiceBanner from "@/components/app/ServiceBanner";
import CommunityBanner from "@/components/app/CommunityBanner";
import Administrator from "@/components/admin/Administrator";
import CommunityCategory from "../components/app/CommunityCategory";
import Community from "../components/app/Community";
import StoreCategory from "../components/store/StoreCategory";
import Store from "../components/store/Store";
import Village from "../components/app/Village";
import StoreComment from "../components/comment/Store";
import CommunityComment from "../components/comment/Community";
import ChildrenComment from "../components/comment/Children";
import Template from "../components/care/Template";
import Birthday from "../components/care/Birthday";
import CommonSense from "../components/health/CommonSense";
import Children from "../components/user/Children";
import Elders from "../components/user/Elders";
import ChestCard from "../components/device/ChestCard";
import ElderFile from "../components/user/ElderFile";
import Stage from "../components/user/Stage";
import Doctor from "../components/user/Doctor";
import SocialWorker from "../components/user/SocialWorker";
import Chart from "../components/statistics/Chart";
import Activity from "../components/volunteer/Activity";
import Approval from "../components/volunteer/Approval";
import Brain from "../components/city/Brain";
import ElectronicFence from "../components/device/ElectronicFence";
import Monitor from "../components/device/Monitor";
import Center from "../components/call/Center";
import IndexBanner from "../components/app/IndexBanner";

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
      },

      {
        path: '/app/index-banner',
        meta: {title: '首页轮播图'},
        component: IndexBanner,
      },
      {
        path: '/app/community-banner',
        meta: {title: '社区轮播图'},
        component: CommunityBanner,

      },

      {
        path: '/system/administration',
        meta: {title: '管理员'},
        component: Administrator
      },

      {
        path: '/community/category',
        meta: {title: '社区分类'},
        component: CommunityCategory
      },

      {
        path: '/community/info',
        meta: {title: '社区信息列表'},
        component: Community
      },

      {
        path: '/store/category',
        meta: {title: '商家分类'},
        component: StoreCategory
      },

      {
        path: '/store',
        meta: {title: '商家信息列表'},
        component: Store
      },

      {
        path: '/village',
        meta: {title: '村庄管理'},
        component: Village
      },
      {
        path: '/comment/store',
        meta: {title: '商家评价'},
        component: StoreComment
      },

      {
        path: '/comment/community',
        meta: {title: '社区评价'},
        component: CommunityComment
      },

      {
        path: '/care/template',
        meta: {title: '关怀管理'},
        component: Template
      },

      {
        path: '/care/birthday',
        meta: {title: '生日祝福'},
        component: Birthday
      },

      {
        path: '/health/commonSense',
        meta: {title: '健康常识'},
        component: CommonSense
      },

      {
        path: '/user/children',
        meta: {title: '子女信息'},
        component: Children
      },

      {
        path: '/user/elders',
        meta: {title: '老人信息列表'},
        component: Elders
      },

      {
        path: '/user/elderFile',
        meta: {title: '老人档案'},
        component: ElderFile
      },

      {
        path: '/user/stage',
        meta: {title: '驿站管理'},
        component: Stage
      },

      {
        path: '/user/doctor',
        meta: {title: '医生管理'},
        component: Doctor
      },

      {
        path: '/user/social-worker',
        meta: {title: '社工管理'},
        component: SocialWorker
      },
      {
        path: '/city/brain',
        meta: {title: '城市大脑'},
        component: Brain
      },
      {
        path: '/statistics',
        meta: {title: '统计分析'},
        component: Chart
      },

      {
        path: '/chest/card',
        meta: {title: '胸牌管理'},
        component: ChestCard
      },

      {
        path: '/volunteer/activity',
        meta: {title: '活动管理'},
        component: Activity
      },

      {
        path: '/volunteer/approval',
        meta: {title: '审核列表'},
        component: Approval
      },

      {
        path: '/electronic/fence',
        meta: {title: '电子围栏'},
        component: ElectronicFence
      },
      {
        path: '/stage/monitor',
        meta: {title: '驿站监控'},
        component: Monitor
      },

      {
        path: '/call/center',
        meta: {title: '呼叫中心'},
        component: Center
      },

      {
        path: '/comment/children',
        meta: {title: '子女评价管理'},
        component: ChildrenComment
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
