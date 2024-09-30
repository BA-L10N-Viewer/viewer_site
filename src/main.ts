import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vue (basic)
import App from './App.vue'
import router from './router'

// Element Plus
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// i18n
import { createI18n } from 'vue-i18n'
import i18n_zh_CN from '@/i18n/zh-CN.json'
import i18n_en from '@/i18n/en.json'
import i18n_zh_TW from '@/i18n/zh-TW.json'

// Pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useSetting } from '@/stores/setting'
import { useSearchVars } from '@/stores/search'

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

const settingStore = useSetting()
settingStore.forcePersist()
settingStore.init_watcher()
useSearchVars().clear()

app.mount('#app')


