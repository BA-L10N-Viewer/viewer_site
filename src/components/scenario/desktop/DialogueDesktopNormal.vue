<script setup lang="ts">
/* speaker */
import { defineProps } from 'vue'
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import DialogueIcon from '@/components/DialogueIcon.vue'
import { getScenarioCharacterSmallPortraitPath } from '@/tool/StoryTool'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'

const props = defineProps({
  dialogueLang: {
    type: String,
    required: true
  },
  dialogueCharacter: {
    type: String,
    required: true
  },
  dialogueCharacterTranslated: {
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
  dialogueContentTranslated: {
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
    <DialogueIcon :icon-url="getScenarioCharacterSmallPortraitPath(dialogueCharacterImage)" />
    <ScenarioTranslatedDialogue :content-original="dialogueCharacter" :content-translated="dialogueCharacterTranslated" :style="{'color': dialogueTextColor}" />
  </td>
  <td :lang="dialogueLang" class="scenario-text scenario-dialogue">
    <ScenarioTranslatedDialogue :content-original="dialogueContent" :content-translated="dialogueContentTranslated" :style="{'color': dialogueTextColor}" />
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup" />
  </td>
</template>

<style scoped>

</style>