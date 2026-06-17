import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import GuestPage from '@/pages/GuestPage.vue'
import GuestResultPage from '@/pages/GuestResultPage.vue'
import GuestConfirmPage from '@/pages/GuestConfirmPage.vue'
import CounterPage from '@/pages/CounterPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/guest',
    name: 'guest',
    component: GuestPage,
  },
  {
    path: '/guest/result',
    name: 'guest-result',
    component: GuestResultPage,
  },
  {
    path: '/guest/confirm',
    name: 'guest-confirm',
    component: GuestConfirmPage,
  },
  {
    path: '/counter',
    name: 'counter',
    component: CounterPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
