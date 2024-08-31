<script setup lang="ts">
/* option */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

import { defineProps, type PropType } from 'vue'
import type { CommonStoryDataDialogTextColor, NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'

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
  }
})
</script>

<template>
  <td class="story-dialogue-option scenario-dialogue" colspan="2">
    <span class="story-dialogue-option-content" :style="{'color': dialogueTextColor}"
          v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0] as NexonL10nDataLang])" :lang="i18nToUiLangAll[0]" />
    <br />
    <span class="story-dialogue-option-content" :style="{'color': dialogueTextColor}"
          v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1] as NexonL10nDataLang])" :lang="i18nToUiLangAll[1]" />
    <br />
    <span class="story-dialogue-option-content" :style="{'color': dialogueTextColor}"
          v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2] as NexonL10nDataLang])" :lang="i18nToUiLangAll[2]" />
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup" />
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