<script setup lang="ts">
/* title place st stm nextEpisode na */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'

import { defineProps } from 'vue'
import { getScenarioVideoPaths, extractVideoIdFromScript } from '@/tool/StoryTool'
import type { NexonL10nDataLang } from '@/types/OutsourcedData'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import DialogueCmdEntryVideo from '@/components/scenario/cmd/DialogueCmdEntryVideo.vue'

const props = defineProps({
  dialogueLang: {
    type: String,
    required: true
  },
  dialogueLangHtml: {
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
  },
  dialogueScript: {
    type: String,
    required: true
  }
})
</script>

<template>
  <td
    v-if="dialogueDataType === 'title' || dialogueDataType === 'nextEpisode'"
    :lang="dialogueLangHtml"
    colspan="2"
    class="story-dialogue-center"
  >
    <ScenarioTranslatedDialogue
      :content-original="dialogueContent"
      :content-original-lang="dialogueLangHtml"
      :content-translated="dialogueContentTranslated"
    />
    <DialogueInfo
      :dialogue-selection-to-group="dialogueSelectionToGroup"
      :dialogue-selection-group="dialogueSelectionGroup"
      :dialogue-absolute-pos="dialogueAbsolutePos"
    />
  </td>
  <td
    v-else-if="dialogueDataType === 'na'"
    :lang="dialogueLangHtml"
    colspan="2"
    class="story-dialogue-na"
  >
    <ScenarioTranslatedDialogue
      :content-original="dialogueContent"
      :content-original-lang="dialogueLangHtml"
      :content-translated="dialogueContentTranslated"
    />
    <DialogueInfo
      :dialogue-selection-~to-group="dialogueSelectionToGroup"
      :dialogue-selection-group="dialogueSelectionGroup"
      :dialogue-absolute-pos="dialogueAbsolutePos"
    />
  </td>
  <td v-else-if="dialogueDataType === 'video'" colspan="2">
    <DialogueCmdEntryVideo
      :data="
        getScenarioVideoPaths(
          extractVideoIdFromScript(props.dialogueScript),
          props.dialogueLang as NexonL10nDataLang
        )
      "
    />
  </td>
  <td v-else class="story-dialogue-other" :lang="dialogueLangHtml" colspan="2">
    <ScenarioTranslatedDialogue
      :content-original="dialogueContent"
      :content-original-lang="dialogueLangHtml"
      :content-translated="dialogueContentTranslated"
    />
    <DialogueInfo
      :dialogue-selection-to-group="dialogueSelectionToGroup"
      :dialogue-selection-group="dialogueSelectionGroup"
      :dialogue-absolute-pos="dialogueAbsolutePos"
    />
  </td>
</template>

<style scoped>
td {
  color: white;
  background-color: #2c4563;
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
