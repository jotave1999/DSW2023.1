import Vue from 'vue'
import VueRouter from 'vue-router'
import board from '../views/board.vue'
import login from '../views/login.vue'
import boardList from '../views/board-list.vue'
import reqPassRecover from '../views/reqPassRecover.vue'
import passRecover from '../views/passRecover.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/board',
    name: 'board-list',
    component: boardList
  },
  {
    path: '/board/:id',
    name: 'board',
    component: board,
  },
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/pass/recover',
    name: 'reqPassRecover',
    component: reqPassRecover
  },
  {
    path: '/recover/:recoverString',
    name: 'passRecover',
    component: passRecover
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
