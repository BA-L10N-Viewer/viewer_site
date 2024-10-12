<script setup lang="ts">
import DialogueDesktopNormal from '@/components/scenario/desktop/DialogueDesktopNormal.vue'
import DialogueDesktopOption from '@/components/scenario/desktop/DialogueDesktopOption.vue'
import DialogueDesktopOther from '@/components/scenario/desktop/DialogueDesktopOther.vue'

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
  },
  dialogueAbsolutePos: {
    type: Number,
    required: true
  }
})

const dialogueContent2 = computed(() => replaceStoryLineUsernameBlank(props.dialogueContent))
</script>

<template>
  <DialogueDesktopNormal :dialogue-selection-to-group="dialogueSelectionToGroup"
                         :dialogue-selection-group="dialogueSelectionGroup"
                         :dialogue-content="dialogueContent2" :dialogue-character="dialogueCharacter"
                         :dialogue-character-image="dialogueCharacterImage"
                         :dialogue-lang="dialogueLang" :dialogue-text-color="dialogueTextColor"
                         :dialogue-character-translated="dialogueCharacterTranslated"
                         :dialogue-content-translated="dialogueContentTranslated"
                         :dialogue-absolute-pos="dialogueAbsolutePos"
                         v-if="dialogueDataType === 'speaker'" />
  <DialogueDesktopOption :dialogue-selection-to-group="dialogueSelectionToGroup"
                         :dialogue-selection-group="dialogueSelectionGroup"
                         :dialogue-content="dialogueContent2" :dialogue-lang="dialogueLang"
                         :dialogue-text-color="dialogueTextColor"
                         :dialogue-content-translated="dialogueContentTranslated"
                         :dialogue-absolute-pos="dialogueAbsolutePos"
                         v-else-if="dialogueDataType === 'option'" />
  <DialogueDesktopOther :dialogue-data-type="dialogueDataType" :dialogue-selection-to-group="dialogueSelectionToGroup"
                        :dialogue-selection-group="dialogueSelectionGroup" :dialogue-content="dialogueContent2"
                        :dialogue-lang="dialogueLang"
                        :dialogue-text-color="dialogueTextColor"
                        :dialogue-content-translated="dialogueContentTranslated"
                        :dialogue-absolute-pos="dialogueAbsolutePos"
                        v-else />
</template>

<style scoped>

</style>