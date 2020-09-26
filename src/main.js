// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './http'
import store from './store'

Vue.prototype.$http = axios
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import common from './assets/js/common'
Vue.use(common)

Vue.config.productionTip = false

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 首善养老管理后台`;
  const role = localStorage.getItem('auth-user-info');
  console.log(to.path.match('/app/'));
  if(to.path.match('/app')) {
    console.log(to.path);
    console.log(to.query);
    next();
    // next({path: to.path, params: to.query});
  } else if (!role && to.path !== '/login') {
    next('/login');
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === 'admin' ? next() : next('/403');
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    } else {
      next();
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
