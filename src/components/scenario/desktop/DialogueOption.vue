<script setup lang="ts">
/* option */
import { defineProps } from 'vue'
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'

const props = defineProps({
  dialogueLang: {
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
  <td class="story-dialogue-option scenario-dialogue" colspan="2" :lang="dialogueLang">
    <span class="story-dialogue-option-content" :style="{'color': dialogueTextColor}"
          v-html="dialogueContent"></span>
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