<script setup lang="ts">
/* speaker */
import { defineProps, type PropType } from 'vue'
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import type { IndexScenarioCharacterDataEntry } from '@/types/OutsourcedData'
import DialogueIcon from '@/components/DialogueIcon.vue'
import { getScenarioCharacterSmallPortraitPath } from '@/tool/StoryTool'

const props = defineProps({
  dialogueLang: {
    type: String,
    required: true
  },
  dialogueCharacter: {
    type: String,
    required: true
  },
  dialogueCharacterImage: {
    type: String,
    required: true
  },
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
  dialogueTextColor: {
    type: String,
    required: true
  }
})
</script>

<template>
  <td :lang="dialogueLang" class="scenario-speaker scenario-dialogue">
    <DialogueIcon :icon-url="getScenarioCharacterSmallPortraitPath(dialogueCharacterImage)" /><br />
    <span v-html="dialogueCharacter" :style="{'color': dialogueTextColor}"></span>
  </td>
  <td :lang="dialogueLang" class="scenario-text scenario-dialogue">
    <span v-html="dialogueContent" :style="{'color': dialogueTextColor}"></span>
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup" />
  </td>
</template>

<style scoped>

</style>