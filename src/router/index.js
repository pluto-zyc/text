import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import store from '../store/index'

// 判断路由独享守卫
// var hasUrl = (url,next) => {
//   console.log(store);
//   var arr = store.state.user.menus_url
//   if (arr.some(i => i == url)) {
//     next()
//   } else {
//     next('/home')
//   }
// }

var router = new Router({
  routes: [{
      path: '/login',
      component: () => import('../pages/login/login.vue')
    },
    {
      path: '/',
      component: () => import('../pages/index/index.vue'),
      name: "index",
      children: [{
          path: 'home',
          component: () => import('../pages/home/home.vue'),
          name: "home"
        },
        {
          path: 'map',
          component: () => import('../pages/map/map.vue'),
          name: "map"

        },
        {
          path: 'impEnter',
          component: () => import('../pages/impEnter/impEnter.vue'),
          name: 'impEnter',
          // beforeEnter(to, from, next) {
          // console.log(to);
          // console.log(from);
          // hasUrl('/impEnter',next)
          // }
        },
        {
          path: 'stati',
          component: () => import('../pages/stati/stati.vue'),
          name: "stati"
        },
        {
          path: 'maps',
          component: () => import('../pages/maps/maps.vue'),
          name: "maps"
        }
      ]
    },
    {
      path: '*',
      redirect: '/login'
    }

  ]
})
//登录拦截
router.beforeEach((to, from, next) => {
  //如果前往登录页面，next()
  if (to.path === "/login") {
    next()
    return
  }
  //如果去的不是登录，就要判断store.user. user是true,next();user-null,next('/login')
  if (localStorage.getItem('user')) {
    next();
    return;
  }
  next("/login")
})
export default router
