import Vue from 'vue'
import VueRouter from 'vue-router'
import board from '../views/board.vue'
import login from '../views/login.vue'
import boardList from '../views/board-list.vue'
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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
