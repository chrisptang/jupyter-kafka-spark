import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import ShopeeCateList from '@/components/ShopeeCateList'
import TaskList from '@/components/TaskList'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/tasks',
      component: TaskList
    },
    {
      path: '/cates',
      name: 'ShopeeCateList',
      component: ShopeeCateList,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

export default router