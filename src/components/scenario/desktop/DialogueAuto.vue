<script setup lang="ts">
import DialogueNormal from '@/components/scenario/desktop/DialogueNormal.vue'
import DialogueOption from '@/components/scenario/desktop/DialogueOption.vue'
import DialogueOther from '@/components/scenario/desktop/DialogueOther.vue'

import { computed } from 'vue'
import { replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

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
  dialogueDataType: {
    type: String,
    required: true
  },
  dialogueTextColor: {
    type: String,
    required: true
  }
})

const dialogueContent2 = computed(() => replaceStoryLineUsernameBlank(props.dialogueContent))

console.log(props.dialogueCharacterTranslated)
</script>

<template>
  <DialogueNormal :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-content="dialogueContent2" :dialogue-character="dialogueCharacter" :dialogue-character-image="dialogueCharacterImage"
                  :dialogue-lang="dialogueLang" :dialogue-text-color="dialogueTextColor"
                  :dialogue-character-translated="dialogueCharacterTranslated"
                  :dialogue-content-translated="dialogueContentTranslated"
                  v-if="dialogueDataType === 'speaker'" />
  <DialogueOption :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-content="dialogueContent2" :dialogue-lang="dialogueLang"
                  :dialogue-text-color="dialogueTextColor"
                  :dialogue-content-translated="dialogueContentTranslated"
                  v-else-if="dialogueDataType === 'option'" />
  <DialogueOther :dialogue-data-type="dialogueDataType" :dialogue-selection-to-group="dialogueSelectionToGroup"
                 :dialogue-selection-group="dialogueSelectionGroup" :dialogue-content="dialogueContent2" :dialogue-lang="dialogueLang"
                 :dialogue-text-color="dialogueTextColor"
                 :dialogue-content-translated="dialogueContentTranslated"
                 v-else />
</template>

<style scoped>

</style>