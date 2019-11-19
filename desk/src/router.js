import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Index from './components/index/Index'
import Simu from './components/exam/Simu'
import Examing from './components/exam/Examing'
import Anwser from './components/exam/Anwser'
import Examend from './components/exam/Examend'
import indexIn from './components/index/index-com/index-in'
import content from './components/index/index-com/content'
import personal from './components/index/index-com/personal'
import qua from './components/index/index-com/qua'
import myQua from './components/index/index-com/myqua'
import myMess from './components/index/index-com/my-mess'
import myTopic from './components/index/index-com/my-topic'
import myError from './components/index/index-com/my-error'


Vue.use(Router)

export default new Router({
  // mode: 'history',
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
      redirect: '/index/content',
      children: [
        {
          path: '/index/content',
          name: 'content',
          component: content,
          redirect: '/index/content/index-in/0',
          children: [
            {
              path: '/index/content/index-in/:id',
              name: 'indexIn',
              component: indexIn
            },
            {
              path: '/index/content/personal/:id',
              name: 'personal',
              component: personal
            },
            {
              path: '/index/content/qua/:id',
              name: 'qua',
              component: qua
            },
            {
              path: '/index/content/myQua',
              name: 'myQua',
              component: myQua
            },
            {
              path: '/index/content/myMess',
              name: 'myMess',
              component: myMess
            },
            {
              path: '/index/content/myTopic',
              name: 'myTopic',
              component: myTopic
            },
            {
              path: '/index/content/myError',
              name: 'myError',
              component: myError
            }
          ]
        },
        {
          path: '/index/simu',
          name: 'Simu',
          component: Simu
        }
      ]
    },
    {
      path: '/examing/:id',
      name: 'Examing',
      component: Examing
    },
    {
      path: '/anwser',
      name: 'Anwser',
      component: Anwser
    },
    {
      path: '/examend',
      name: 'Examend',
      component: Examend
    }
  ]
})
