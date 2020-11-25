// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 重置样式
import './assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css';
import  './assets/css/iconfont.css'
// import animated from 'animate.css' // npm install animate.css --save安装，在引入
// Vue.use(animated)
// 引入vuex状态层
import store from './store/index'

// 引入公共组件
import nav from './components/index'
import ElementUi from "element-ui"
import BaiduMap from 'vue-baidu-map'
import globalVar from "./utils/globalVar";


import { loadingFun } from "./utils/alert";


import VCharts from 'v-charts'
Vue.use(VCharts)


for (var i in nav) {
  Vue.component(i, nav[i])
}

Vue.prototype.globalVar = globalVar


// 引element-ui样式
// 使用该ui组件
Vue.use(ElementUi)

// 注册百度map

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'DPThTCPFPUNCpVCA9EUZFLEorOh8GGke'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
