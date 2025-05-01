<script setup lang="ts">
import type {
  NexonCharVoiceEvent,
  NexonCharVoiceEventTranscriptionType
} from '@/types/OutsourcedDataVoice'
import { computed, inject, onMounted, type PropType, ref, defineAsyncComponent } from 'vue'
import type { NexonCharVoiceEventMtData } from '@/tool/CharVoiceMt'
import { useI18n } from 'vue-i18n'
import { symbolDataCharVoiceI18n } from '@/types/CharVoiceComp'
import { convertNexonCharVoiceEventCategoryForTable } from '@/tool/CharVoiceForTable'
import { i18nLangAll } from '@/tool/ConstantComputed'

import PvDataTable from 'primevue/datatable'
import PvColumn from 'primevue/column'
import type {
  I18nStoryInfoIdToXxhash,
  NexonL10nDataDict,
  NexonL10nDataLangOfUi
} from '@/types/OutsourcedData'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'
import PvTag from 'primevue/tag'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH, NexonLangMap } from '@/tool/Constant'
import PvButton from 'primevue/button'
import {
  DirectoryDataStoryI18nFileI18nEventIndex,
  DirectoryDataStoryI18nFileI18nStory
} from '@/tool/PreFetchedData'
import { useDialog } from 'primevue'
import type { NexonCharVoiceEventVoiceEntryParam } from '@/types/OutsourcedDataVoice'

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
const isMobile = computed(() => {
  const currWidth = useWindowSize().width.value
  return currWidth <= MOBILE_WIDTH
})
const dataCharI18n = inject(symbolDataCharVoiceI18n)!

const dataForTable = computed(() =>
  convertNexonCharVoiceEventCategoryForTable(props.dataVoice, i18nLangAll.value)
)

const indexEventI18n: I18nStoryInfoIdToXxhash = DirectoryDataStoryI18nFileI18nEventIndex.value
const i18nStory: NexonL10nDataDict = DirectoryDataStoryI18nFileI18nStory.value

// 对话框显示
const pvDialog = useDialog()
const componentDialogVoiceDetail = defineAsyncComponent(() => import('./CharVoiceDetailDialog.vue'))
function showVoiceDetailDialog(data: string) {
  pvDialog.open(componentDialogVoiceDetail, {
    props: {
      header: i18n.t('char-voice-ui-detail-dialog-title'),
      modal: true,
      closable: true,
      dismissableMask: true,
      draggable: false,
      style: {
        width: '50vw'
      },
      breakpoints: {
        '800px': '90vw'
      }
    },
    data: {
      stringExplanation: data
    }
  })
}
function showVoiceParamDetailDialog(param: NexonCharVoiceEventVoiceEntryParam) {
  pvDialog.open(componentDialogVoiceDetail, {
    props: {
      header: i18n.t('char-voice-ui-detail-dialog-title-2'),
      modal: true,
      closable: true,
      dismissableMask: true,
      draggable: false,
      style: {
        width: '50vw'
      },
      breakpoints: {
        '800px': '90vw'
      }
    },
    data: {
      stringExplanation: undefined,
      dataDetail: param
    }
  })
}

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
      <h2 style="font-size: 1.5em">
        {{ eventData.EventId }} -
        <NexonI18nDataOutput
          :data="i18nStory[indexEventI18n[`[STORY_EVENT_${eventData.EventId}_NAME]`]]"
        />
      </h2>
      <template v-for="(groupData, idx2) in eventData.Data" :key="idx2">
        <h3 class="char-voice-group-h3">
          {{ dataCharI18n[`NX.${groupData.GroupId}`] }}&nbsp;
          <PvButton
            v-if="dataCharI18n[`NX.${groupData.GroupId}.Extra`] !== ''"
            v-tooltip.hover.top="dataCharI18n[`NX.${groupData.GroupId}.Extra`]"
            size="small"
            severity="secondary"
            @click="showVoiceDetailDialog(dataCharI18n[`NX.${groupData.GroupId}.Extra`])"
          >
            <i class="pi pi-question-circle"></i>
          </PvButton>
        </h3>
        <template v-for="(entryData, idx3) in groupData.Data" :key="idx3">
          <p>
            <b>{{ dataCharI18n[`NX.${groupData.GroupId}`] }}&nbsp;{{ idx3 + 1 }}</b
            >&nbsp;&nbsp;
            <PvButton
              v-if="entryData.Param.DialogConditionDetail !== 'None'"
              v-tooltip.hover.top="i18n.t('char-voice-ui-detail-dialog-title-2')"
              size="small"
              severity="secondary"
              @click="showVoiceParamDetailDialog(entryData.Param)"
            >
              <i class="pi pi-database"></i>
            </PvButton>
          </p>
          <PvDataTable
            :value="entryData.Data"
            rowGroupMode="rowspan"
            :groupRowsBy="['EventType']"
            sortMode="single"
            :sortOrder="1"
          >
            <PvColumn
              field="EventType"
              :header="i18n.t('comp-char-voice-nexon-event-type')"
              style="width: 4em"
            >
              <template #body="slotProps">
                {{ $t(`comp-char-voice-nexon-event-type-${slotProps.data.EventType}`) }}
              </template>
            </PvColumn>
            <PvColumn
              field="TranscriptionLang"
              :header="i18n.t('comp-char-voice-lang-code')"
              style="width: 6em"
              v-if="!isMobile"
            />
            <PvColumn
              field="Transcription"
              :header="i18n.t('comp-char-voice-dialog-text')"
              style="width: calc(100% - 12em - 5%)"
            >
              <template #body="slotProps">
                <PvTag severity="info" value="Info" v-if="isMobile">{{
                  slotProps.data.TranscriptionLang
                }}</PvTag
                >&nbsp;
                <DialogueTranslated
                  :content-original-lang="NexonLangMap[slotProps.data.Transcription]"
                  :content-translated="
                    dataVoiceMt[`${eventData.EventId}_${slotProps.data.Id}`]?.Transcription[
                      slotProps.data.EventType! as NexonCharVoiceEventTranscriptionType
                    ]?.[slotProps.data.TranscriptionLang as NexonL10nDataLangOfUi] || ''
                  "
                  :content-original="slotProps.data.Transcription || 'null'"
                />
              </template>
            </PvColumn>
          </PvDataTable>
        </template>
      </template>
    </template>
  </div>
</template>

<style scoped></style>
