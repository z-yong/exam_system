import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/iconfont/iconfont.css'
import './assets/iconfont2/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import axios from './http.js'
import { deepClone } from './assets/clone'
import 'babel-polyfill'

Vue.prototype.$echarts = echarts
Vue.prototype.axios = axios
Vue.prototype.deepClone = deepClone
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
