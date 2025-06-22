<script setup lang="ts">
import { type Component, onMounted, watch } from 'vue'
import { useSetting } from '@/stores/setting'
import type { SiteUiLang } from '@/tool/Constant'
import FaqViewCompEn from '@/views/langs/FaqViewCompEn.vue'
import FaqViewCompZhCn from '@/views/langs/FaqViewCompZhCn.vue'
import FaqViewCompZhTw from '@/views/langs/FaqViewCompZhTw.vue'
import { AppPageCategoryToI18nCode, changeAppPageTitle } from '@/tool/AppTitleChanger'
import { useI18n } from 'vue-i18n'

const allComps: Record<SiteUiLang, Component> = {
  en: FaqViewCompEn,
  zh_CN: FaqViewCompZhCn,
  zh_TW: FaqViewCompZhTw
}

const setting = useSetting()
const i18n = useI18n()

onMounted(() => {
  watch(
    () => setting.ui_lang,
    () => {
      changeAppPageTitle(i18n.t(AppPageCategoryToI18nCode['faq']))
    },
    { immediate: true }
  )
})
</script>

<template>
  <component :is="allComps[setting.ui_lang]" />
</template>

<style scoped></style>
