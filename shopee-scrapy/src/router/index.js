import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import ShopeeCateList from '@/components/ShopeeCateList'
import TaskList from '@/components/TaskList'
import ShopeeShopList from '@/components/ShopeeShopList'

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
      name: "Tasks",
      component: TaskList
    },
    {
      path: '/cates',
      name: 'ShopeeCateList',
      component: ShopeeCateList
    },
    {
      path: '/shops',
      name: 'ShopeeShopList',
      component: ShopeeShopList
    }
  ]
})

export default router