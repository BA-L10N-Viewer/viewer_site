<script setup lang="ts">
import { paginationScenarioControl, siteUiLangSelect } from '@/tool/Constant'
import { useSetting } from '@/stores/setting'

import PvInputText from 'primevue/inputtext'
import PvSelect from 'primevue/select'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'

const setting = useSetting()
</script>

<template>
  <h2>{{ $t('view-setting-h2-1') }}</h2>
  <label for="username">{{ $t('view-setting-p-1') }}</label>
  <PvInputText id="username" type="text" v-model="setting.username" aria-describedby="username-help" />

  <p>{{ $t('view-setting-p-2') }}</p>
  <PvSelect v-model="setting.ui_lang" :options="siteUiLangSelect" optionLabel="label" optionValue="value"
            checkmark :highlightOnSelect="false" size="small" />

  <p>{{ $t('view-setting-p-3') }}</p>
  <PvSelect v-model="setting.scenario_pagination_perPage" :options="paginationScenarioControl.perPage"></PvSelect>

  <h2>{{ $t('view-setting-h2-2') }}</h2>
  <StoryI18nSetting :show_ml="false" />
</template>

<style scoped>

</style>