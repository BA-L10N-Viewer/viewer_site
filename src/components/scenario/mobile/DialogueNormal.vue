<script setup lang="ts">
/* speaker */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { getScenarioCharacterSmallPortraitPath, replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

import { defineProps, type PropType, inject, type Ref, ref } from 'vue'
import type { NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'
import DialogueIcon from '@/components/DialogueIcon.vue'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'

const props = defineProps({
  dialogueCharacter: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  dialogueCharacterImage: {
    type: String,
    required: true
  },
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
    type: String,
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
  <td class="scenario-speaker scenario-dialogue">
    <DialogueIcon :icon-url="getScenarioCharacterSmallPortraitPath(dialogueCharacterImage)" />
    <br />
    <span :lang="i18nToUiLangAll[0]">
      <ScenarioTranslatedDialogue :content-original="dialogueCharacter[i18nLangAll[0] as NexonL10nDataLang]"
                                  :content-translated="ML_table[i18nLangAll[0] as NexonL10nDataLang][entry_pos]['name']"
                                  :css_style="{'color': dialogueTextColor}"
                                  :is_after_br="true" />
    </span>
    <span :lang="i18nToUiLangAll[1]">
      <ScenarioTranslatedDialogue :content-original="dialogueCharacter[i18nLangAll[1] as NexonL10nDataLang]"
                                  :content-translated="ML_table[i18nLangAll[1] as NexonL10nDataLang][entry_pos]['name']"
                                  :css_style="{'color': dialogueTextColor}"
                                  :is_after_br="true" />
    </span>
    <span :lang="i18nToUiLangAll[2]">
      <ScenarioTranslatedDialogue :content-original="dialogueCharacter[i18nLangAll[2] as NexonL10nDataLang]"
                                  :content-translated="ML_table[i18nLangAll[2] as NexonL10nDataLang][entry_pos]['name']"
                                  :css_style="{'color': dialogueTextColor}"
                                  :is_after_br="true" />
    </span>
  </td>
  <td class="scenario-text scenario-dialogue">
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

</style>