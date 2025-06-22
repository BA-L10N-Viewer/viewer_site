<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { useI18n } from 'vue-i18n'
import { type Component, onMounted, watch } from 'vue'
import { AppPageCategoryToI18nCode, changeAppPageTitle } from '@/tool/AppTitleChanger'
import type { SiteUiLang } from '@/tool/Constant'
import MisakiiiViewCompEn from '@/views/langs/MisakiiiViewCompEn.vue'
import MisakiiiViewCompZhCn from '@/views/langs/MisakiiiViewCompZhCn.vue'
import MisakiiiViewCompZhTw from '@/views/langs/MisakiiiViewCompZhTw.vue'

const allComps: Record<SiteUiLang, Component> = {
  en: MisakiiiViewCompEn,
  zh_CN: MisakiiiViewCompZhCn,
  zh_TW: MisakiiiViewCompZhTw
}

const setting = useSetting()
const i18n = useI18n()

onMounted(() => {
  watch(
    () => setting.ui_lang,
    () => {
      changeAppPageTitle(i18n.t(AppPageCategoryToI18nCode['misakiii']))
    },
    { immediate: true }
  )
})
</script>

<template>
  <component :is="allComps[setting.ui_lang]" />
</template>
