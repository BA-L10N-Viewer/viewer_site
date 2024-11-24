// CSS
import './assets/style.css'
import './assets/main.css'
import 'primeicons/primeicons.css'
import './assets/default_behavior_mimic.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vue (basic)
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Lara from '@primevue/themes/lara'
import PvTooltip from 'primevue/tooltip'

// Sentry
import * as Sentry from '@sentry/vue'

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

import { fetchData } from './tool/PreFetchedData'

const app = createApp(App)

if (document.location.host === 'ba-l10n.cnfast.top' || document.location.host === 'ba-l10n-aws.cnfast.top') {
  Sentry.init({
    app,
    dsn: 'https://92794d37ef29d2d9ed0e739a418add68@o4508351878529024.ingest.us.sentry.io/4508351880232960',
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration()
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost'],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
} else {
  console.log('Sentry is disabled in dev env.')
}

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

app.use(createPinia().use(piniaPluginPersistedstate))
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
      950: '#082f49'
    }
  }
})
app.use(PrimeVue, {
  theme: {
    preset: AuraCustomPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false
    }
  }
})
app.directive('tooltip', PvTooltip)

const settingStore = useSetting()
settingStore.forcePersist()
settingStore.init_watcher()
useSearchVars().clear()

app.mount('#app')


fetchData()