<script setup lang="ts">
import DialogueNormal from '@/components/scenario/mobile/DialogueNormal.vue'
import DialogueOption from '@/components/scenario/mobile/DialogueOption.vue'
import DialogueOther from '@/components/scenario/mobile/DialogueOther.vue'

import { defineProps, type PropType } from 'vue'
import type {
  CommonStoryDataDialogDataType,
  CommonStoryDataDialogTextColor,
  NexonL10nData
} from '@/types/OutsourcedData'

const props = defineProps({
  dialogueCharacter: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  dialogueCharacterImage: {
    type: String,
    required: true
  },
  dialogueContent: {
    type: {} as PropType<NexonL10nData>,
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
    type: String as PropType<CommonStoryDataDialogDataType>,
    required: true
  },
  dialogueTextColor: {
    type: String as PropType<CommonStoryDataDialogTextColor>,
    required: true
  },
  entry_pos: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <DialogueNormal :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-content="dialogueContent" :dialogue-character="dialogueCharacter"
                  :dialogue-text-color="dialogueTextColor" :dialogue-character-image="dialogueCharacterImage"
                  :entry_pos="entry_pos"
                  v-if="dialogueDataType === 'speaker'" />
  <DialogueOption :dialogue-selection-to-group="dialogueSelectionToGroup" :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogueContent="dialogueContent"
                  :dialogue-text-color="dialogueTextColor"
                  :entry_pos="entry_pos"
                  v-else-if="dialogueDataType === 'option'" />
  <DialogueOther :dialogue-data-type="dialogueDataType" :dialogue-selection-to-group="dialogueSelectionToGroup"
                 :dialogue-selection-group="dialogueSelectionGroup" :dialogueContent="dialogueContent"
                 :dialogue-text-color="dialogueTextColor"
                 :entry_pos="entry_pos"
                 v-else />
</template>

<style scoped>

</style>