<script setup lang="ts">
/* title place st stm nextEpisode na */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
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
  <td v-if="dialogueDataType === 'title' || dialogueDataType === 'nextEpisode'" v-html="dialogueContent"
      :lang="dialogueLang"
      colspan="2" class="story-dialogue-center"></td>
  <td v-else-if="dialogueDataType === 'na'" :lang="dialogueLang" colspan="2" class="story-dialogue-na">
    <span v-html="dialogueContent"></span>
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup" />
  </td>
  <td v-else v-html="dialogueContent"
      class="story-dialogue-other" :lang="dialogueLang" colspan="2"></td>
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