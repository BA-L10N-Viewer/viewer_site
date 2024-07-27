<script setup lang="ts">
import DialogueNormal from '@/components/scenario/desktop/DialogueNormal.vue'
import DialogueOption from '@/components/scenario/desktop/DialogueOption.vue'
import DialogueOther from '@/components/scenario/desktop/DialogueOther.vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import { replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

export default defineComponent( {
  props: {
    dialogueLang: {
      type: String,
      required: true
    },
    dialogueCharacter: {
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
  },
  computed: {
    dialogueContent2() {
      return replaceStoryLineUsernameBlank(this.dialogueContent)
    }
  }
})
</script>

<template>
  <DialogueNormal :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-content="dialogueContent2" :dialogue-character="dialogueCharacter" :dialogue-lang="dialogueLang"
                  :dialogue-text-color="dialogueTextColor"
                  v-if="dialogueDataType === 'speaker'" />
  <DialogueOption :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-content="dialogueContent2" :dialogue-lang="dialogueLang"
                  :dialogue-text-color="dialogueTextColor"
                  v-else-if="dialogueDataType === 'option'" />
  <DialogueOther :dialogue-data-type="dialogueDataType" :dialogue-selection-to-group="dialogueSelectionToGroup"
                 :dialogue-selection-group="dialogueSelectionGroup" :dialogue-content="dialogueContent2" :dialogue-lang="dialogueLang"
                 :dialogue-text-color="dialogueTextColor"
                 v-else />
</template>

<style scoped>

</style>