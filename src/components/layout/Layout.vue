<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar :items="menuItems"></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <section>
              <div class="content">
                <div class="crumbs">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
                      <i :class="item.icon"></i>
                      <span>{{ item.title }}</span>
                    </el-breadcrumb-item>
                  </el-breadcrumb>
                </div>

                <div v-bind:class="{ container: !$route.meta.noBorder }">
                  <router-view></router-view>
                </div>
              </div>
            </section>
          </keep-alive>
        </transition>
        <el-backtop target=".content"></el-backtop>
      </div>
    </div>
  </div>
</template>

<script>
  import vHead from './Header';
  import vSidebar from './Sidebar';
  import bus from '../common/bus';

  export default {
    data() {
      return {
        breadcrumb: [],
        tagsList: [],
        collapse: false,
        movieHref: '',
        allMenuItems: [
          {
            index: '/',
            title: '首页',
            icon: 'el-icon-s-home'
          },
          {
              index: '1',
              title: 'APP管理',
              icon: 'el-icon-mobile',
              subs: [
                // {
                //   index: '/app/index-banner',
                //   title: '首页轮播图管理'
                // },
                {
                  index: '/app/service-banner',
                  title: '服务轮播图管理'
                },
                {
                  index: '/app/community-banner',
                  title: '社区播图管理'
                },
                {
                  index: '/community',
                  title: '社区管理',
                  subs: [
                    {
                      index: '/community/info',
                      title: '社区信息列表',
                    },
                    {
                      index: '/community/category',
                      title: '社区分类',
                    },
                  ]
                },

                {
                  index: '/store',
                  title: '商家管理',
                  subs: [
                    {
                      index: '/store',
                      title: '商家信息列表',
                    },
                    {
                      index: '/store/category',
                      title: '商家分类管理',
                    }
                  ]
                },


                {
                  index: '/comment',
                  title: '评价管理',
                  subs: [
                    {
                      index: '/comment/store',
                      title: '商家评价管理',
                    },
                    {
                      index: '/comment/community',
                      title: '社区评价管理',
                    }
                  ]
                },

                {
                  index: '/care',
                  title: '关怀管理',
                  subs: [
                    {
                      index: '/care/template',
                      title: '关怀管理',
                    },
                    {
                      index: '/care/birthday',
                      title: '生日祝福',
                    }
                  ]

                },

                {
                  index: '/health/commonSense',
                  title: '健康常识',
                },

              ]
          },

          {
            icon: 'el-icon-user',
            index: '2',
            title: '用户管理',
            subs: [
              {
                index: '/user/children',
                title: '子女信息'
              },
              {
                index: '/village',
                title: '村庄管理',
              },
              {
                index: '/user/aged',
                title: '老人信息列表'
              },
              {
                index: '/user/aged-archives',
                title: '老人档案',
              },
              {
                index: '/user/post-station',
                title: '驿站管理'
              },
              {
                index: '/user/social-worker',
                title: '社工信息管理'
              },
              {
                index: '/user/doctor',
                title: '医生管理',
              }
            ]
          },

          // {
          //   icon: 'el-icon-service',
          //   title: '志愿者管理',
          //   index: '3',
          //   subs: [
          //     {
          //       index: '/volunteer/activity',
          //       title: '活动管理'
          //     },
          //     {
          //       index: '/volunteer/activity-approval',
          //       title: '活动审核'
          //     },
          //     {
          //       index: '/volunteer',
          //       title: '志愿者信息'
          //     }
          //   ]
          // },
          // {
          //   icon: 'el-icon-service',
          //   title: '呼叫中心',
          //   index: '/call/center',
          // },

          // {
          //   icon: 'el-icon-view',
          //   title: '驿站监控',
          //   index: '/post-station/monitor'
          // },

          // {
          //   icon: 'el-icon-tickets',
          //   title: '电子围栏',
          //   index: '/electronic/fence'
          // },

          // {
          //   icon: 'el-icon-document',
          //   title: '城市大脑',
          //   index: '/city/brain'
          // },
          // {
          //   icon: 'el-icon-info',
          //   title: '统计分析',
          //   index: '/system/statistics'
          // },
          //
          // {
          //   icon: 'el-icon-picture',
          //   title: '胸牌管理',
          //   index: '/breastpiece'
          // },
          {
            icon: 'el-icon-setting',
            title: '系统管理',
            index: '10',
            subs: [
              {
                index: '/system/administration',
                title: '管理员'
              }
            ]
          }
        ]
      }
    },
    computed: {
      menuItems () {
        // const roleId = this.getRoleId()
        const roleId = 1; //临时使用
        const allMenus = Object.assign([], this.allMenuItems)
        if (roleId == 1) {
          // allMenus.splice(-1, 0, {
          //   icon: 'el-icon-film',
          //   href: this.movieHref,
          //   title: '电影票管理'
          // })
          //
          return allMenus
        } else if (roleId == 4) {
          // return [{
          //   icon: 'el-icon-film',
          //   href: this.movieHref,
          //   title: '电影票管理'
          // }]
        } else if(roleId == 5) {
          // return [{
          //   icon: 'el-icon-s-ticket',
          //   href: this.movieHref,
          //   index: '7',
          //   title: '线下票务',
          //   subs: [
          //     {
          //       index: '/offline/sell',
          //       title: '售票'
          //     }, {
          //       index: '/offline/order',
          //       title: '线下预约门票订单'
          //     }
          //   ]
          // }]
        } else {
          return allMenus.filter(m => {
            return m.index == roleId
          })
        }
      }
    },
    components: {
      vHead,
      vSidebar
    },
    watch: {
      '$route' (to, from) {
        this.processBreadcrumb(to.path)
      }
    },
    methods: {
      getRoleId () {
        return JSON.parse(localStorage.getItem('auth-user-info')).admin_permissions
      },
      processBreadcrumb (path) {

        this.breadcrumb = []
        this.menuItems.forEach(levelOne => {
          if(levelOne.subs && levelOne.subs.length) {

            levelOne.subs.forEach(levelTwo => {
              if(levelTwo.subs && levelTwo.subs.length) {
                levelTwo.subs.forEach(levelThree => {
                  if(levelThree.index === path) {
                    this.breadcrumb = []

                    this.breadcrumb.push(
                      {
                        icon: levelOne.icon,
                        title: levelOne.title
                      },
                      {
                        icon: levelTwo.icon,
                        title: levelTwo.title
                      },
                      {
                        icon: levelThree.icon,
                        title: levelThree.title
                      },
                    )
                  }
                })
              } else {

                if(levelTwo.index === path) {
                  this.breadcrumb = []

                  this.breadcrumb.push({
                    icon: levelOne.icon,
                    title: levelOne.title
                  },{
                    icon: levelTwo.icon,
                    title: levelTwo.title
                  })
                }
              }
            });
          } else {
            this.breadcrumb = []

            this.breadcrumb.push({
              icon: levelOne.icon,
              title: levelOne.title
            },)
          }
        })
      }
    },
    created() {
      bus.$on('collapse-content', msg => {
        this.collapse = msg;
      })

      // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
      bus.$on('tags', msg => {
        let arr = [];
        for (let i = 0, len = msg.length; i < len; i++) {
          msg[i].name && arr.push(msg[i].name);
        }
        this.tagsList = arr;
      })

      this.processBreadcrumb(this.$route.path)
    },
    mounted() {
      // this.$http('/apis/admin/movieTicketsLogin').then(res => {
      //   this.movieHref = res.data.data
      // })
    }
  };
</script>
