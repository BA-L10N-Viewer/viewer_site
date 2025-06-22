<script setup lang="ts">
/* option */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import {
  i18nLangAll,
  i18nToUiLangAll,
  listOfPosOfSelectedLangForMobile,
  numberOfSelectedLangForMobile
} from '@/tool/ConstantComputed'
import { getNexonL10nData, replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

import { defineProps, inject, type PropType, type Ref } from 'vue'
import type { CommonStoryDataDialogTextColor, NexonL10nData } from '@/types/OutsourcedData'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import type { MlForScenario } from '@/types/MachineTranslation'
import { symbolForScenarioMtData } from '@/tool/translate/MtUtils'
import DialogueCmdEntry from '@/components/scenario/DialogueCmdEntry.vue'
import { symbolForScenarioUiDataDisplayType } from '@/tool/components/Scenario'

const props = defineProps({
  dialogueContent: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  dialogueSelectionGroup: {
    type: Number,
    required: true
  },
  dialogueSelectionToGroup: {
    type: Number,
    required: true
  },
  dialogueTextColor: {
    type: String as PropType<CommonStoryDataDialogTextColor>,
    required: true
  },
  entry_pos: {
    type: Number,
    required: true
  },
  dialogueAbsolutePos: {
    type: Number,
    required: true
  },
  dialogueSoundFilename: {
    type: String,
    required: true
  }
})

let ML_table: Ref<MlForScenario> = inject(symbolForScenarioMtData)!
const scenarioDisplayMode = inject(symbolForScenarioUiDataDisplayType)!
</script>

<template>
  <td class="story-dialogue-option scenario-dialogue" colspan="2">
    <template v-if="dialogueSoundFilename !== '' && scenarioDisplayMode === 0">
      <DialogueCmdEntry
        :data-entry="{
          ActualPos: -1,
          AbsolutePos: dialogueAbsolutePos,
          DataType: 'cmd',
          Payload: { Type: 'sound', Id: dialogueSoundFilename }
        }"
      />
    </template>
    <template v-for="(langIdx, idx) in listOfPosOfSelectedLangForMobile" :key="langIdx">
      <template v-if="(i18nLangAll[langIdx] as string) !== 'null'">
        <span :lang="i18nToUiLangAll[langIdx]">
          <ScenarioTranslatedDialogue
            :content-original="
              replaceStoryLineUsernameBlank(getNexonL10nData(dialogueContent, i18nLangAll[langIdx]))
            "
            :content-original-lang="i18nToUiLangAll[langIdx]"
            :content-translated="
              ML_table[i18nLangAll[langIdx]].get(String(entry_pos))?.['dialogue'] || ''
            "
            :style="{ color: dialogueTextColor }"
            :is_after_br="true"
          />
        </span>
        <hr class="mobile-lang-hr" v-if="!(idx + 1 === numberOfSelectedLangForMobile)" />
      </template>
    </template>
    <DialogueInfo
      :dialogue-selection-to-group="dialogueSelectionToGroup"
      :dialogue-selection-group="dialogueSelectionGroup"
      :dialogue-absolute-pos="dialogueAbsolutePos"
    />
  </td>
</template>

<style scoped>
.story-dialogue-option {
  background-color: #f0f0f0;
  text-align: right;
}

.story-dialogue-option-content {
  color: #383838;
  text-align: center;
}
</style>
