import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Index from './components/index/Index'
import Topic from './components/Topic'
import home from './components/index/index-in/home'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      // redirect: '/index/home',
      children: [
        {
          path: '/index/home',
          name: 'home',
          component: home
        }
      ]
    },
    {
      path: '/Topic',
      name: 'Topic',
      component: Topic
    }
  ]
})
