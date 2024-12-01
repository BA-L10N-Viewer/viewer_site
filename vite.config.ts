import { sentryVitePlugin } from "@sentry/vite-plugin";
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [vue(), vueJsx(), vueDevTools(), AutoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    resolvers: [
      IconsResolver({
        prefix: 'Icon'
      })
    ]
  }), Components({
    resolvers: [
      IconsResolver({
        enabledCollections: ['ep']
      })
    ]
  }), sentryVitePlugin({
    org: "sctopzhang",
    project: "ba-l10n-viewer"
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})