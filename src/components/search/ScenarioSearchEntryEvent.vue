<script setup lang="ts">
import { computed, type PropType } from 'vue'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'
import type { NexonL10nData } from '@/types/OutsourcedData'
import { checkIfScenarioIdIsMain, getScenarioExtraDataById } from '@/tool/StoryTool'
import ScenarioIsAfterBattleBadge from '@/components/genetic/ScenarioIsAfterBattleBadge.vue'

const props = defineProps({
  data: {
    type: {} as PropType<{id: string; name: NexonL10nData; desc: NexonL10nData}>,
    required: true
  },
  data_no: {
    type: Number,
    required: true
  }
})
const storyId = computed(() => props.data.id)
const storyName = computed(() => props.data.name)
const storyDesc = computed(() => props.data.desc)

const isScenarioMain = checkIfScenarioIdIsMain(props.data.id)
let scenarioIdExtraData : ReturnType<typeof getScenarioExtraDataById>,
  scenarioIdIsAfterBattleFlag: "A" | "B";
if (isScenarioMain) {
  scenarioIdExtraData = getScenarioExtraDataById(props.data.id)
  scenarioIdIsAfterBattleFlag = !scenarioIdExtraData.isAfterBattle ? "A" : "B"
}
else {
  scenarioIdExtraData = {isAfterBattle: false, actualScenarioNo: props.data_no}
  scenarioIdIsAfterBattleFlag = "A"
}
</script>


<template>
  <h3>
    <el-tag type="warning">{{ storyId }}</el-tag>
    <span v-if="isScenarioMain">&nbsp;</span><ScenarioIsAfterBattleBadge :story-id="data.id" />
    <span>&nbsp;&nbsp;</span>
    <span>{{ scenarioIdExtraData.actualScenarioNo }}<span v-if="isScenarioMain">{{ "-" + scenarioIdIsAfterBattleFlag }}</span>.&nbsp;</span>
    <NexonI18nDataOutput :data="storyName" />
    <span>&nbsp;</span>
    <el-button type="primary" class="btn-view-story"
               tag="RouterLink" :to="`/scenario/${storyId}`">
      {{$t('comp-search-result-btn-view')}}
    </el-button>
  </h3>
  <p>{{$t('comp-search-result-desc')}}</p>
  <ul>
    <NexonI18nDataOutput :data="storyDesc"
                         html-element-name="li"
                         :enable-text-line-clamp="true"
    />
  </ul>
  <el-divider></el-divider>
</template>

<style scoped>
.btn-view-story {
  text-decoration-line: none;
}
</style>