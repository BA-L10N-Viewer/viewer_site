<script setup lang="ts">
/* option */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

import { defineProps, type PropType, inject, type Ref, ref } from 'vue'
import type { CommonStoryDataDialogTextColor, NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'

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

let ML_table: Ref<Record<NexonL10nDataLang, { name: string; dialogue: string }[]>> = ref(inject('ML_table') as any)
</script>

<template>
  <td class="story-dialogue-option scenario-dialogue" colspan="2">
    <span :lang="i18nToUiLangAll[0]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0] as NexonL10nDataLang])"
        :content-translated="ML_table[i18nLangAll[0] as NexonL10nDataLang][entry_pos]['dialogue']"
        :css_style="{'color': dialogueTextColor}"
        :is_after_br="true" />
    </span>
    <hr class="mobile-lang-hr" />
    <span :lang="i18nToUiLangAll[1]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1] as NexonL10nDataLang])"
        :content-translated="ML_table[i18nLangAll[1] as NexonL10nDataLang][entry_pos]['dialogue']"
        :css_style="{'color': dialogueTextColor}"
        :is_after_br="true" />
    </span>
    <hr class="mobile-lang-hr" />
    <span :lang="i18nToUiLangAll[2]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2] as NexonL10nDataLang])"
        :content-translated="ML_table[i18nLangAll[2] as NexonL10nDataLang][entry_pos]['dialogue']"
        :css_style="{'color': dialogueTextColor}"
        :is_after_br="true" />
    </span>
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