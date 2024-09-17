<script setup lang="ts">
/* speaker */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { getScenarioCharacterSmallPortraitPath, replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

import { defineProps, type PropType } from 'vue'
import type { NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'
import DialogueIcon from '@/components/DialogueIcon.vue'

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
  }
})
</script>

<template>
  <td class="scenario-speaker scenario-dialogue">
    <DialogueIcon :icon-url="getScenarioCharacterSmallPortraitPath(dialogueCharacterImage)" /><br />
    <span v-html="replaceStoryLineUsernameBlank(dialogueCharacter[i18nLangAll[0] as NexonL10nDataLang])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[0]" />
    <br />
    <span v-html="replaceStoryLineUsernameBlank(dialogueCharacter[i18nLangAll[1] as NexonL10nDataLang])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[1]" />
    <br />
    <span v-html="replaceStoryLineUsernameBlank(dialogueCharacter[i18nLangAll[2] as NexonL10nDataLang])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[2]" />
  </td>
  <td class="scenario-text scenario-dialogue">
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0] as NexonL10nDataLang])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[0]" />
    <br />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1] as NexonL10nDataLang])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[1]" />
    <br />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2] as NexonL10nDataLang])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[2]" />
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup" />
  </td>
</template>

<style scoped>

</style>