import './assets/main.css'
import "primeicons/primeicons.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vue (basic)
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Lara from '@primevue/themes/lara';

// i18n
import { createI18n } from 'vue-i18n'
import i18n_zh_CN from '@/i18n/zh-CN.json'
import i18n_en from '@/i18n/en.json'
import i18n_zh_TW from '@/i18n/zh-TW.json'

// Pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useSetting } from '@/stores/setting'
import { useSearchVars } from '@/stores/search'
import { definePreset } from '@primevue/themes'

const app = createApp(App)

const i18n = createI18n({
  allowComposition: true,
  locale: 'zh_CN',
  fallbackLng: 'en',
  messages: {
    'zh_CN': i18n_zh_CN,
    'zh_TW': i18n_zh_TW,
    'en': i18n_en
  }
})

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
app.use(createPinia().use(piniaPluginPersistedstate))
// app.use(ElementPlus)
app.use(router)
app.use(i18n)

const AuraCustomPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    }
  }
});
app.use(PrimeVue, {
  theme: {
    preset: AuraCustomPreset,
    options: {
      prefix: 'pv',
      darkModeSelector: '.dark-mode-toggler',
    }
  }
});

const settingStore = useSetting()
settingStore.forcePersist()
settingStore.init_watcher()
useSearchVars().clear()

app.mount('#app')


