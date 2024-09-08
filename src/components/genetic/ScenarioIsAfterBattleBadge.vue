<script setup lang="ts">
import { checkIfScenarioIdIsMain, getScenarioExtraDataById } from '@/tool/StoryTool'
import type { PropType } from 'vue'

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
  <el-tag type="success" v-if="isScenarioMain && !scenarioIdExtraData.isAfterBattle">{{ $t('comp-search-result-main-before-battle') }}</el-tag>
  <el-tag type="danger" v-else-if="isScenarioMain">{{ $t('comp-search-result-main-after-battle') }}</el-tag>
</template>

<style scoped>

</style>