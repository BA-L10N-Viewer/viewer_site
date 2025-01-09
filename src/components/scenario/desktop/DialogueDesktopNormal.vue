<script setup lang="ts">
/* speaker */
import { defineProps, inject } from 'vue'
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import DialogueIcon from '@/components/DialogueIcon.vue'
import { getScenarioCharacterSmallPortraitPath, getScenarioPopupFilenamePath } from '@/tool/StoryTool'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import DialogueCmdEntry from '@/components/scenario/DialogueCmdEntry.vue'
import { symbolForScenarioUiDataDisplayType } from '@/tool/components/Scenario'

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
  dialogueTextColor: {
    type: String,
    required: true
  },
  dialogueAbsolutePos: {
    type: Number,
    required: true
  },
  dialoguePopupFilename: {
    type: String,
    required: true
  },
  dialogueSoundFilename: {
    type: String,
    required: true
  }
})

const scenarioDisplayMode = inject(symbolForScenarioUiDataDisplayType)!
</script>

<template>
  <td :lang="dialogueLang" class="scenario-speaker scenario-dialogue">
    <DialogueIcon :icon-url="getScenarioCharacterSmallPortraitPath(dialogueCharacterImage)" />
    <ScenarioTranslatedDialogue :content-original="dialogueCharacter" :content-translated="dialogueCharacterTranslated"
                                :content-original-lang="dialogueLang"
                                :style="{'color': dialogueTextColor}" />
  </td>
  <td :lang="dialogueLang" class="scenario-text scenario-dialogue">
    <template v-if="dialogueSoundFilename !== '' && scenarioDisplayMode === 0">
      <DialogueCmdEntry :data-entry="{ActualPos: -1, AbsolutePos: dialogueAbsolutePos, DataType: 'cmd', Payload: {Type: 'sound', Id: dialogueSoundFilename}}" />
    </template>
    <template v-if="dialoguePopupFilename">
      <img :src="getScenarioPopupFilenamePath(dialoguePopupFilename)"
           class="momotalk-dialogue-img" />
      <br />
    </template>
    <ScenarioTranslatedDialogue :content-original="dialogueContent" :content-original-lang="dialogueLang" :content-translated="dialogueContentTranslated"
                                :style="{'color': dialogueTextColor}" />
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-absolute-pos="dialogueAbsolutePos" />
  </td>
</template>

<style scoped>

</style>