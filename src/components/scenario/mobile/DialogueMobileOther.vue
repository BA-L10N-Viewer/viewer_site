<script setup lang="ts">
/* title place st stm nextEpisode na */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import {
  i18nLangAll,
  i18nToUiLangAll,
  listOfPosOfSelectedLangForMobile,
  numberOfSelectedLangForMobile
} from '@/tool/ConstantComputed'
import { getNexonL10nData, replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

import { defineProps, inject, type PropType, type Ref, ref } from 'vue'
import type {
  CommonStoryDataDialogDataType,
  CommonStoryDataDialogTextColor,
  NexonL10nData,
  NexonL10nDataLang
} from '@/types/OutsourcedData'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import type { MlForScenario } from '@/types/MachineTranslation'
import { symbolForScenarioMtData } from '@/tool/translate/MtUtils'

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
  dialogueDataType: {
    type: String as PropType<CommonStoryDataDialogDataType>,
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
  }
})

let ML_table: Ref<MlForScenario> = inject(symbolForScenarioMtData)!

const htmlTdClassName = (() => {
  if (props.dialogueDataType === 'title' || props.dialogueDataType === 'nextEpisode') {
    return { 'story-dialogue-center': true }
  } else if (props.dialogueDataType === 'na') {
    return { 'story-dialogue-na': true }
  } else {
    return { 'story-dialogue-other': true }
  }
})()
</script>

<template>
  <td colspan="2" :class="htmlTdClassName">
    <template v-for="(langIdx, idx) in listOfPosOfSelectedLangForMobile" :key="langIdx">
      <template v-if="i18nLangAll[langIdx] as string !== 'null'">
        <span :lang="i18nToUiLangAll[langIdx]">
          <ScenarioTranslatedDialogue
            :content-original="replaceStoryLineUsernameBlank(getNexonL10nData(dialogueContent,i18nLangAll[langIdx]))"
            :content-original-lang="i18nToUiLangAll[langIdx]"
            :content-translated="ML_table[i18nLangAll[langIdx] as NexonL10nDataLang].get(String(entry_pos))?.['dialogue'] || ''"
            :is_after_br="true" />
        </span>
        <hr class="mobile-lang-hr" v-if="!(idx + 1 === numberOfSelectedLangForMobile)" />
      </template>
    </template>
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-absolute-pos="dialogueAbsolutePos"/>
  </td>
</template>

<style scoped>
td {
  color: white;
  background-color: #2C4563;
}

.story-dialogue-center {
  text-align: center;
  background-color: var(--color-ba-logo);
}

.story-dialogue-na {
  text-align: center;
  font-style: italic;
}

.story-dialogue-other {
  text-align: center;
}
</style>