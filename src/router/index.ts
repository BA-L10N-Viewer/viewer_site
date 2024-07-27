import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import AboutView from '../views/AboutView.vue'
import SettingView from '../views/SettingView.vue'
import MomotalkView from '../views/MomotalkView.vue'
import CharacterView from '@/views/CharacterView.vue'
import SearchCharacterView from '@/views/SearchCharacterView.vue'
import ScenarioView from '@/views/ScenarioView.vue'
import FaqView from '@/views/FaqView.vue'

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
      component: SearchView
    },
    {
      path: '/search/character',
      name: 'search_character',
      component: SearchCharacterView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/faq',
      name: 'faq',
      component: FaqView
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingView
    },
    {
      path: '/momotalk/:charId',
      name: 'momotalk',
      component: MomotalkView,
      props: true
    },
    {
      path: '/character/:charId',
      name: 'char_info',
      component: CharacterView,
      props: true
    },
    {
      path: '/scenario/:storyId',
      name: 'scenario',
      component: ScenarioView,
      props: true
    }
  ]
})

export default router
