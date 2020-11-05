import Vue from 'vue'
import Router from 'vue-router'
// import Layout from '@/components/layout/Layout'
// import Home from '@/components/Home'
// import Page404 from '@/components/layout/404'
// import Login from '@/components/Login'
// import ServiceBanner from "@/components/app/ServiceBanner";
// import CommunityBanner from "@/components/app/CommunityBanner";
// import Administrator from "@/components/admin/Administrator";
// import CommunityCategory from "../components/app/CommunityCategory";
// import Community from "../components/app/Community";
// import StoreCategory from "../components/store/StoreCategory";
// import Store from "../components/store/Store";
// import Village from "../components/app/Village";
// import StoreComment from "../components/comment/Store";
// import CommunityComment from "../components/comment/Community";
// import ChildrenComment from "../components/comment/Children";
// import Template from "../components/care/Template";
// import Birthday from "../components/care/Birthday";
// import CommonSense from "../components/health/CommonSense";
// import Children from "../components/user/Children";
// import Elders from "../components/user/Elders";
// import ChestCard from "../components/device/ChestCard";
// import ElderFile from "../components/user/ElderFile";
// import Stage from "../components/user/Stage";
// import Doctor from "../components/user/Doctor";
// import SocialWorker from "../components/user/SocialWorker";
// import Chart from "../components/statistics/Chart";
// import Activity from "../components/volunteer/Activity";
// import Approval from "../components/volunteer/Approval";
// import Brain from "../components/city/Brain";
// import ElectronicFence from "../components/device/ElectronicFence";
// import Monitor from "../components/device/Monitor";
// import Center from "../components/call/Center";
// import IndexBanner from "../components/app/IndexBanner";
// import Company from "../components/user/Company";
// import SocialWorkerAssessment from "../components/user/SocialWorkerAssessment";
// import BannerLink from "../components/mobile/BannerLink";
// import Agreement from "../components/mobile/Agreement";
// import CommunityDetail from "../components/mobile/Community";
// import About from "../components/mobile/About";
// import VolunteerDetail from "../components/mobile/VolunteerDetail";
// import HealthDetail from "../components/mobile/HealthDetail";
// import Merchant from "../components/mobile/Merchant";
// import Download from "../components/mobile/Download";
// import CommunityCommentDetail from "../components/mobile/CommunityCommentDetail";
// import Index from "../components/log/Index";

// const Vue = () => import('vue');
// const Router  = () => import('vue-router')
const Layout = () => import( '@/components/layout/Layout')
const Home = () => import( '@/components/Home')
const Page404 = () => import( '@/components/layout/404')
const Login = () => import( '@/components/Login')
const ServiceBanner = () => import( "@/components/app/ServiceBanner");
const CommunityBanner = () => import( "@/components/app/CommunityBanner");
const Administrator = () => import( "@/components/admin/Administrator");
const CommunityCategory = () => import( "../components/app/CommunityCategory");
const Community = () => import( "../components/app/Community");
const StoreCategory = () => import( "../components/store/StoreCategory");
const Store = () => import( "../components/store/Store");
const Village = () => import( "../components/app/Village");
const StoreComment = () => import( "../components/comment/Store");
const CommunityComment = () => import( "../components/comment/Community");
const ChildrenComment = () => import( "../components/comment/Children");
const Template = () => import( "../components/care/Template");
const Birthday = () => import( "../components/care/Birthday");
const CommonSense = () => import( "../components/health/CommonSense");
const Children = () => import( "../components/user/Children");
const Elders = () => import( "../components/user/Elders");
const ChestCard = () => import( "../components/device/ChestCard");
const ElderFile = () => import( "../components/user/ElderFile");
const Stage = () => import( "../components/user/Stage");
const Doctor = () => import( "../components/user/Doctor");
const SocialWorker = () => import( "../components/user/SocialWorker");
const Chart = () => import( "../components/statistics/Chart");
const Activity = () => import( "../components/volunteer/Activity");
const Approval = () => import( "../components/volunteer/Approval");
const Brain = () => import( "../components/city/Brain");
const ElectronicFence = () => import( "../components/device/ElectronicFence");
const Monitor = () => import( "../components/device/Monitor");
const Center = () => import( "../components/call/Center");
const IndexBanner = () => import( "../components/app/IndexBanner");
const Company = () => import( "../components/user/Company");
const SocialWorkerAssessment = () => import( "../components/user/SocialWorkerAssessment");
const BannerLink = () => import( "../components/mobile/BannerLink");
const Agreement = () => import( "../components/mobile/Agreement");
const CommunityDetail = () => import( "../components/mobile/Community");
const About = () => import( "../components/mobile/About");
const VolunteerDetail = () => import( "../components/mobile/VolunteerDetail");
const HealthDetail = () => import( "../components/mobile/HealthDetail");
const Merchant = () => import( "../components/mobile/Merchant");
const Download = () => import( "../components/mobile/Download");
const CommunityCommentDetail = () => import( "../components/mobile/CommunityCommentDetail");
const Index = () => import( "../components/log/Index");


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

      {
        path: '/company',
        meta: {title: '公司管理'},
        component: Company
      },

      {
        path: '/user/social-worker-assessment',
        meta: {title: '公司管理'},
        component: SocialWorkerAssessment
      },

      {
        path: '/log',
        meta: {title: '操作日志'},
        component: Index,
        props: true
      },
        
      {
        path: '404',
        meta: {
          noBorder: true,
          title: '页面找不到'
        },
        component: Page404
      }
    ]
  },{
      path: '/app/banner',
      meta: {title: '轮播图详情'},
      component: BannerLink
    },{
      path: '/app/agreement',
      meta: {title: '注册协议'},
      component: Agreement
    },{
      path: '/app/community',
      meta: {title: '社区详情'},
      component: CommunityDetail
    },{
    path: '/app/about',
    meta: {title: '关于软件'},
    component: About
  },{
    path: '/app/volunteer',
    meta: {title: '志愿者服务详情'},
    component: VolunteerDetail
  },{
    path: '/app/healthy',
    meta: {title: '健康详情'},
    component: HealthDetail
  },{
    path: '/app/merchant',
    meta: {title: '商家详情'},
    component: Merchant
  },
    {
      path: '/app/download',
      meta: {title: '下载'},
      component: Download
    },{
          path: '/app/community-comment-detail',
          meta: {title: '社区评价详情'},
          component: CommunityCommentDetail
      },{
    path: '/login',
    meta: {
      title: '登录'
    },
    component: Login
  },{
    path: '*',
    redirect: '/'
  }]
})
