<script setup lang="ts">
import DialogueNormal from '@/components/scenario/mobile/DialogueNormal.vue'
import DialogueOption from '@/components/scenario/mobile/DialogueOption.vue'
import DialogueOther from '@/components/scenario/mobile/DialogueOther.vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import { replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

export default defineComponent( {
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
  <DialogueNormal :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-content="dialogueContent" :dialogue-character="dialogueCharacter"
                  :dialogue-text-color="dialogueTextColor"
                  v-if="dialogueDataType === 'speaker'" />
  <DialogueOption :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-content="dialogueContent"
                  :dialogue-text-color="dialogueTextColor"
                  v-else-if="dialogueDataType === 'option'" />
  <DialogueOther :dialogue-data-type="dialogueDataType" :dialogue-selection-to-group="dialogueSelectionToGroup"
                 :dialogue-selection-group="dialogueSelectionGroup" :dialogue-content="dialogueContent"
                 :dialogue-text-color="dialogueTextColor"
                 v-else />
</template>

<style scoped>

</style>