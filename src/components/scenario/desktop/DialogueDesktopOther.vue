<script setup lang="ts">
/* title place st stm nextEpisode na */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'

import { defineProps } from 'vue'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import type { NexonL10nDataLang } from '@/types/OutsourcedData'
import { DirectoryDataCommonFileIndexVideo } from '@/tool/PreFetchedData'
import { getStaticCdnBasepath } from '@/tool/HttpRequest'

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

function getVideoPaths(vid: string | number, lang: NexonL10nDataLang) {
  const video = DirectoryDataCommonFileIndexVideo.value[vid]
  if (video) {
    const paths = video.PathByLang[lang]
    return [
      `${getStaticCdnBasepath('static')}/ba/Scenario_Video/${paths[0]}.mp4`,
      `${getStaticCdnBasepath('static')}/ba/Scenario_Video/${paths[1]}.ogg`
    ]
  } else {
    return ['', '']
  }
}
function getVideoId() {
  // 直接从 dialogueContent 里面取得
  const regex = new RegExp('#video;(\\d+)', 'im')
  const result = regex.exec(props.dialogueScript)
  if (result) {
    return result[1]
  } else {
    return ''
  }
}
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
    <video controls class="scenario-bg-img">
      <source
        :src="getVideoPaths(getVideoId(), dialogueLang as NexonL10nDataLang)[0]"
        type="video/mp4"
      />
      <source
        :src="getVideoPaths(getVideoId(), dialogueLang as NexonL10nDataLang)[1]"
        type="audio/ogg"
      />
    </video>
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
