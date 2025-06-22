<script setup lang="ts">
import { type Component, onMounted, watch } from 'vue'
import { useSetting } from '@/stores/setting'
import type { SiteUiLang } from '@/tool/Constant'
import AboutViewCompEn from '@/components/views/AboutViewCompEn.vue'
import AboutViewCompZhCn from '@/components/views/AboutViewCompZhCn.vue'
import AboutViewCompZhTw from '@/components/views/AboutViewCompZhTw.vue'
import { AppPageCategoryToI18nCode, changeAppPageTitle } from '@/tool/AppTitleChanger'
import { useI18n } from 'vue-i18n'

const allComps: Record<SiteUiLang, Component> = {
  en: AboutViewCompEn,
  zh_CN: AboutViewCompZhCn,
  zh_TW: AboutViewCompZhTw
}

const setting = useSetting()
const i18n = useI18n()

onMounted(() => {
  watch(
    () => setting.ui_lang,
    () => {
      changeAppPageTitle(i18n.t(AppPageCategoryToI18nCode['about']))
    },
    { immediate: true }
  )
})
</script>

<template>
  <component :is="allComps[setting.ui_lang]" />
</template>

<style></style>
