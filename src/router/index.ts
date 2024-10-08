import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    },
    {
      path: '/search/character',
      name: 'search_character',
      component: () => import('@/views/SearchCharacterView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('@/views/FaqView.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('../views/SettingView.vue')
    },
    {
      path: '/momotalk/:charId',
      name: 'momotalk',
      component: () => import('../views/MomotalkView.vue'),
      props: true
    },
    {
      path: '/character/:charId',
      name: 'char_info',
      component: () => import('@/views/CharacterView.vue'),
      props: true
    },
    {
      path: '/scenario/:storyId',
      name: 'scenario',
      component: () => import('@/views/ScenarioView.vue'),
      props: true
    }
  ]
})

export default router
