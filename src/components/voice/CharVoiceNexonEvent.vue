<script setup lang="ts">
import type { NexonCharVoiceEvent, NexonCharVoiceEventTranscriptionType } from '@/types/OutsourcedDataVoice'
import { computed, inject, onMounted, type PropType } from 'vue'
import { ref } from 'vue'
import type { NexonCharVoiceEventMtData } from '@/tool/CharVoiceMt'
import { useI18n } from 'vue-i18n'
import { symbolDataCharVoiceI18n } from '@/types/CharVoiceComp'
import {
  convertNexonCharVoiceEventCategoryForTable
} from '@/tool/CharVoiceForTable'
import { i18nLangAll } from '@/tool/ConstantComputed'

import PvDataTable from 'primevue/datatable'
import PvColumn from 'primevue/column'
import type {
  I18nStoryInfoIdToXxhash,
  NexonL10nDataDict,
  NexonL10nDataLangOfUi
} from '@/types/OutsourcedData'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import { httpGetSync } from '@/tool/HttpRequest'
import { getNexonL10nDataFlattened } from '@/tool/StoryTool'
import { useSetting } from '@/stores/setting'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'
import PvTag from 'primevue/tag'

const props = defineProps({
  dataVoice: {
    type: Object as PropType<NexonCharVoiceEvent>,
    required: true
  },
  dataVoiceMt: {
    type: Object as PropType<NexonCharVoiceEventMtData>,
    required: true
  }
})

const i18n = useI18n()

const isLoading = ref(true)
const dataCharI18n = inject(symbolDataCharVoiceI18n)!

const dataForTable = computed(
  () => convertNexonCharVoiceEventCategoryForTable(props.dataVoice, i18nLangAll.value)
)


const indexEventI18n: I18nStoryInfoIdToXxhash = JSON.parse(httpGetSync('/data/story/i18n/i18n_event_index.json'))
const i18nStory: NexonL10nDataDict = JSON.parse(httpGetSync('/data/story/i18n/i18n_story.json'))

onMounted(async () => {
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <template v-for="(eventData, idx) in dataForTable" :key="idx">
      <h2>{{ eventData.EventId }} - <NexonI18nDataOutput :data="i18nStory[indexEventI18n[`[STORY_EVENT_${eventData.EventId}_NAME]`]]" /></h2>
      <template v-for="(groupData, idx2) in eventData.Data" :key="idx2">
        <h3 class="char-voice-group-h3">{{ dataCharI18n[`NX.${groupData.GroupId}`] }}</h3>
        <template v-for="(entryData, idx3) in groupData.Data" :key="idx3">
          <p><b>{{ dataCharI18n[`NX.${groupData.GroupId}`] }}&nbsp;{{ idx2 + 1 }}</b></p>
          <PvDataTable :value="entryData.Data"
                       rowGroupMode="rowspan" :groupRowsBy="['EventType']" sortMode="single" :sortOrder="1">
            <PvColumn field="EventType" :header="i18n.t('comp-char-voice-nexon-event-type')" style="width: 4em">
              <template #body="slotProps">
                {{ $t(`comp-char-voice-nexon-event-type-${slotProps.data.EventType}`) }}
              </template>
            </PvColumn>
            <PvColumn field="Transcription" :header="i18n.t('comp-char-voice-dialog-text')"
                      style="width: calc(100% - 12em - 5%)">
              <template #body="slotProps">
                <PvTag severity="info" value="Info">{{ slotProps.data.TranscriptionLang }}</PvTag>&nbsp;
                <DialogueTranslated
                  :content-translated="dataVoiceMt[`${eventData.EventId}_${slotProps.data.Id}`]?.Transcription[slotProps.data.EventType! as NexonCharVoiceEventTranscriptionType]?.[slotProps.data.TranscriptionLang as NexonL10nDataLangOfUi] || ''"
                  :content-original="slotProps.data.Transcription || 'null'" />
              </template>
            </PvColumn>
          </PvDataTable>
        </template>
      </template>
    </template>
  </div>
</template>

<style scoped>

</style>