<script setup lang="ts">
import DialogueMobileNormal from '@/components/scenario/mobile/DialogueMobileNormal.vue'
import DialogueMobileOption from '@/components/scenario/mobile/DialogueMobileOption.vue'
import DialogueMobileOther from '@/components/scenario/mobile/DialogueMobileOther.vue'

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
  },
  dialogueAbsolutePos: {
    type: Number,
    required: true
  },
  dialoguePopupFilename: {
    type: String,
    required: true
  }
})
</script>

<template>
  <DialogueMobileNormal :dialogue-selection-to-group="dialogueSelectionToGroup"
                        :dialogue-selection-group="dialogueSelectionGroup"
                        :dialogue-content="dialogueContent" :dialogue-character="dialogueCharacter"
                        :dialogue-text-color="dialogueTextColor" :dialogue-character-image="dialogueCharacterImage"
                        :dialogue-absolute-pos="dialogueAbsolutePos"
                        :dialogue-popup-filename="dialoguePopupFilename"
                        :entry_pos="entry_pos"
                        v-if="dialogueDataType === 'speaker'" />
  <DialogueMobileOption :dialogue-selection-to-group="dialogueSelectionToGroup"
                        :dialogue-selection-group="dialogueSelectionGroup"
                        :dialogueContent="dialogueContent"
                        :dialogue-text-color="dialogueTextColor"
                        :entry_pos="entry_pos"
                        :dialogue-absolute-pos="dialogueAbsolutePos"
                        v-else-if="dialogueDataType === 'option'" />
  <DialogueMobileOther :dialogue-data-type="dialogueDataType" :dialogue-selection-to-group="dialogueSelectionToGroup"
                       :dialogue-selection-group="dialogueSelectionGroup" :dialogueContent="dialogueContent"
                       :dialogue-text-color="dialogueTextColor"
                       :entry_pos="entry_pos"
                       :dialogue-absolute-pos="dialogueAbsolutePos"
                       v-else />
</template>

<style scoped>

</style>