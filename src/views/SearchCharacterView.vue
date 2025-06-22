<script setup lang="ts">
import CharacterSearch from '@/components/search/CharacterSearch.vue'
import { onMounted, watch } from 'vue'
import { AppPageCategoryToI18nCode, changeAppPageTitle } from '@/tool/AppTitleChanger'
import { useSetting } from '@/stores/setting'
import { useI18n } from 'vue-i18n'

const setting = useSetting()
const i18n = useI18n()

onMounted(() => {
  watch(
    () => setting.ui_lang,
    () => {
      changeAppPageTitle(i18n.t(AppPageCategoryToI18nCode['search_char']))
    },
    { immediate: true }
  )
})
</script>

<template>
  <CharacterSearch />
</template>

<style scoped></style>
