import Vue from 'vue'
import Router from 'vue-router'
import Creator from '@/components/creator'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Creator',
      component: Creator
    }
  ]
})
