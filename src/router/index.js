import Vue from 'vue'
import Router from 'vue-router'
import Menu from '@/components/Menu'
import MouldList from '@/components/MouldList'
import MouldType from '@/components/MouldType'
import Login from '@/components/Login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/',
      name: '菜单',
      component: Menu,
      iconCls: 'fa fa-th-large',//图标样式class
      children: [
        {path: '/MouldType', component: MouldType, name: '模具类型'},
        {path: '/MouldList', component: MouldList, name: '模具订单'},
      ]
    },
  ]
})
