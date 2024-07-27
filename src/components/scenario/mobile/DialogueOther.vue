<script setup lang="ts">
/* title place st stm nextEpisode na */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { replaceStoryLineUsernameBlank } from '@/tool/StoryTool'
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    dialogueContent: {
      type: String,
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
      type: String,
      required: true
    },
    dialogueTextColor: {
      type: String,
      required: true
    }
  }
})
</script>

<template>
  <td v-if="dialogueDataType === 'title' || dialogueDataType === 'nextEpisode'"
      colspan="2" class="story-dialogue-center">
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0]])" :lang="i18nToUiLangAll[0]" />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1]])" :lang="i18nToUiLangAll[1]" />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2]])" :lang="i18nToUiLangAll[2]" />

  </td>
  <td v-else-if="dialogueDataType === 'na'" colspan="2" class="story-dialogue-na">
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0]])" :lang="i18nToUiLangAll[0]" />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1]])" :lang="i18nToUiLangAll[1]" />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2]])" :lang="i18nToUiLangAll[2]" />
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup" />
  </td>
  <td v-else class="story-dialogue-other" colspan="2">
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0]])" :lang="i18nToUiLangAll[0]" />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1]])" :lang="i18nToUiLangAll[1]" />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2]])" :lang="i18nToUiLangAll[2]" />
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