<script setup lang="ts">
import { computed, type PropType } from 'vue'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'
import type { NexonL10nData } from '@/types/OutsourcedData'
import { checkIfScenarioIdIsMain, getScenarioExtraDataById } from '@/tool/StoryTool'
import ScenarioIsAfterBattleBadge from '@/components/genetic/ScenarioIsAfterBattleBadge.vue'

import PvTag from 'primevue/tag'
import PvButton from 'primevue/button'
import PvDivider from 'primevue/divider'

const props = defineProps({
  data: {
    type: {} as PropType<{ id: string; name: NexonL10nData; desc: NexonL10nData }>,
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
let scenarioIdExtraData: ReturnType<typeof getScenarioExtraDataById>,
  scenarioIdIsAfterBattleFlag: 'A' | 'B'
if (isScenarioMain || (storyId.value.startsWith("1100") && storyId.value.length === 5)) {
  scenarioIdExtraData = getScenarioExtraDataById(props.data.id)
  scenarioIdIsAfterBattleFlag = !scenarioIdExtraData.isAfterBattle ? 'A' : 'B'
} else {
  scenarioIdExtraData = { isAfterBattle: false, actualScenarioNo: props.data_no }
  scenarioIdIsAfterBattleFlag = 'A'
}
</script>


<template>
  <h3>
    <PvTag severity="warn">{{ storyId }}</PvTag>
    <span v-if="isScenarioMain">&nbsp;</span>
    <ScenarioIsAfterBattleBadge :story-id="data.id" />
    <span>&nbsp;&nbsp;</span>
    <span>{{ scenarioIdExtraData.actualScenarioNo }}<span v-if="isScenarioMain">{{ '-' + scenarioIdIsAfterBattleFlag
      }}</span>.&nbsp;</span>
    <NexonI18nDataOutput :data="storyName" />
    <span>&nbsp;</span>
    <PvButton severity="primary" class="btn-view-story" size="small"
              as="RouterLink" :to="`/scenario/${storyId}`">
      {{ $t('comp-search-result-btn-view') }}
    </PvButton>
  </h3>
  <p>{{ $t('comp-search-result-desc') }}</p>
  <ul>
    <NexonI18nDataOutput :data="storyDesc"
                         html-element-name="li"
                         :enable-text-line-clamp="true"
    />
  </ul>
  <PvDivider></PvDivider>
</template>

<style scoped>
.btn-view-story {
  text-decoration-line: none;
}
</style>