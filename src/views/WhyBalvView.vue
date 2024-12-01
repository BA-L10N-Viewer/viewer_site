<script setup lang="ts">
import { type Component, watch, onMounted } from 'vue'
import { useSetting } from '@/stores/setting'
import type { SiteUiLang } from '@/tool/Constant';
import WhyBalvViewCompEn from '@/components/views/WhyBalvViewCompEn.vue';
import WhyBalvViewCompZhCn from '@/components/views/WhyBalvViewCompZhCn.vue';
import WhyBalvViewCompZhTw from '@/components/views/WhyBalvViewCompZhTw.vue';
import { AppPageCategoryToI18nCode, changeAppPageTitle } from '@/tool/AppTitleChanger'
import { useI18n } from 'vue-i18n'

const allComps: Record<SiteUiLang, Component> = {
  en: WhyBalvViewCompEn,
  zh_CN: WhyBalvViewCompZhCn,
  zh_TW: WhyBalvViewCompZhTw
}

const setting = useSetting()
const i18n = useI18n()

onMounted(
  () => {
    watch(
      () => setting.ui_lang,
      () => {
        changeAppPageTitle(i18n.t(AppPageCategoryToI18nCode['whybalv']))
      },
      { immediate: true }
    )
  }
)
</script>

<template>
  <component :is="allComps[setting.ui_lang]" />
</template>

<style scoped>

</style>