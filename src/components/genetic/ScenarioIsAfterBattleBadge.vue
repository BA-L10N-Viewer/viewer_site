<script setup lang="ts">
import { checkIfScenarioIdIsMain, getScenarioExtraDataById } from '@/tool/StoryTool'
import type { PropType } from 'vue'

import PvTag from 'primevue/tag'

const props = defineProps({
  storyId: {
    type: {} as PropType<string | number>,
    required: true
  }
})

const isScenarioMain = checkIfScenarioIdIsMain(props.storyId)
let scenarioIdExtraData : ReturnType<typeof getScenarioExtraDataById>
if (isScenarioMain) {
  scenarioIdExtraData = getScenarioExtraDataById(props.storyId)
}
else {
  scenarioIdExtraData = {isAfterBattle: false, actualScenarioNo: -1}
}
</script>

<template>
  <PvTag severity="success" v-if="isScenarioMain && !scenarioIdExtraData.isAfterBattle">{{ $t('comp-search-result-main-before-battle') }}</PvTag>
  <PvTag severity="danger" v-else-if="isScenarioMain">{{ $t('comp-search-result-main-after-battle') }}</PvTag>
</template>

<style scoped>

</style>