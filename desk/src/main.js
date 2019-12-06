import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/iconfont/iconfont.css';
import axios from 'axios'
// https://blog.csdn.net/samll_cat/article/details/84565622 Eachts使用
Vue.use(ElementUI);

Vue.prototype.axios = axios
Vue.config.productionTip = false

// 设置标题
router.beforeEach((to,form,next) =>{
  if(to.meta.title){
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
