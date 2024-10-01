<script setup lang="ts">
/* option */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { getNexonL10nData, replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

import { defineProps, type PropType, inject, type Ref, ref } from 'vue'
import type { CommonStoryDataDialogTextColor, NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import type { MlForScenario } from '@/types/MachineTranslation'
import { i18nMobileLoopIdx } from '@/tool/Constant'

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
  }
})

let ML_table: Ref<MlForScenario> = ref(inject('ML_table') as any)
</script>

<template>
  <td class="story-dialogue-option scenario-dialogue" colspan="2">
    <template v-for="idx in i18nMobileLoopIdx" :key="idx">
      <template v-if="i18nLangAll[idx] as string !== 'null'">
        <span :lang="i18nToUiLangAll[idx]">
          <ScenarioTranslatedDialogue
            :content-original="replaceStoryLineUsernameBlank(getNexonL10nData(dialogueContent,i18nLangAll[idx]))"
            :content-translated="ML_table[i18nLangAll[idx]][entry_pos]['dialogue']"
            :css_style="{'color': dialogueTextColor}"
            :is_after_br="true" />
        </span>
        <hr class="mobile-lang-hr" v-if="idx + 1 < i18nMobileLoopIdx.length" />
      </template>
    </template>
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup" />
  </td>
</template>

<style scoped>
.story-dialogue-option {
  background-color: #F0F0F0;
  text-align: right;
}

.story-dialogue-option-content {
  color: #383838;
  text-align: center;
}
</style>