<script setup lang="ts">
import ScenarioSearch from '@/components/search/ScenarioSearch.vue'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'

import PvDivider from 'primevue/divider'
</script>

<template>
  <h1 class="view-h1">{{ $t("search-h1") }}</h1>
  <StoryI18nSetting :show_ml="false" />
  <PvDivider />

  <ScenarioSearch />
</template>
