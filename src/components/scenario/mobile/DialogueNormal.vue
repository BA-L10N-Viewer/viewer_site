<script setup lang="ts">
/* speaker */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { replaceStoryLineUsernameBlank } from '@/tool/StoryTool'
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    dialogueCharacter: {
      required: true
    },
    dialogueContent: {
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
  }
})
</script>

<template>
  <td class="scenario-speaker scenario-dialogue">
    <span v-html="replaceStoryLineUsernameBlank(dialogueCharacter[i18nLangAll[0]])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[0]" />
    <br />
    <span v-html="replaceStoryLineUsernameBlank(dialogueCharacter[i18nLangAll[1]])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[1]" />
    <br />
    <span v-html="replaceStoryLineUsernameBlank(dialogueCharacter[i18nLangAll[2]])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[2]" />
  </td>
  <td class="scenario-text scenario-dialogue">
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0]])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[0]" />
    <br />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1]])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[1]" />
    <br />
    <span v-html="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2]])" :style="{'color': dialogueTextColor}"
          :lang="i18nToUiLangAll[2]" />
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup" />
  </td>
</template>

<style scoped>

</style>