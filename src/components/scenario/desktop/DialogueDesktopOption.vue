<script setup lang="ts">
/* option */
import { defineProps } from 'vue'
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
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
  <td class="story-dialogue-option scenario-dialogue" colspan="2" :lang="dialogueLang">
    <ScenarioTranslatedDialogue class="story-dialogue-option-content" :content-original="dialogueContent"
                                :content-translated="dialogueContentTranslated" :style="{'color': dialogueTextColor}" />
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-absolute-pos="dialogueAbsolutePos"/>
  </td>
</template>

<style>
.story-dialogue-option {
  background-color: #F0F0F0;
  text-align: right;
}

.story-dialogue-option-content {
  color: #383838;
  text-align: center;
}
</style>