<script setup lang="ts">
/* title place st stm nextEpisode na */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'

import { defineProps } from 'vue'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'

const props = defineProps({
  dialogueLang: {
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
  dialogueDataType: {
    type: String,
    required: true
  },
  dialogueTextColor: {
    type: String,
    required: true
  },
  dialogueAbsolutePos: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <td v-if="dialogueDataType === 'title' || dialogueDataType === 'nextEpisode'"
      :lang="dialogueLang"
      colspan="2" class="story-dialogue-center">
    <ScenarioTranslatedDialogue :content-original="dialogueContent" :content-translated="dialogueContentTranslated" />
  </td>
  <td v-else-if="dialogueDataType === 'na'" :lang="dialogueLang" colspan="2" class="story-dialogue-na">
    <ScenarioTranslatedDialogue :content-original="dialogueContent" :content-translated="dialogueContentTranslated" />
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-absolute-pos="dialogueAbsolutePos"/>
  </td>
  <td v-else
      class="story-dialogue-other" :lang="dialogueLang" colspan="2">
    <ScenarioTranslatedDialogue :content-original="dialogueContent" :content-translated="dialogueContentTranslated" />
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