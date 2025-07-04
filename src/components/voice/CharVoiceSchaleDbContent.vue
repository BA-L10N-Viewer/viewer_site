<script setup lang="ts">
import { computed, onMounted, type PropType, ref } from 'vue'
import type { SchaleDbVoicelineCategoryMtData } from '@/script/CharVoiceMt'
import { useI18n } from 'vue-i18n'
import {
  convertSchaleDbVoiceCategoryForTable,
  type SchaleDbVoiceEntryForTable
} from '@/script/CharVoiceForTable'
import { i18nLangAll } from '@/tool/ConstantComputed'
import type {
  NexonL10nDataLangOfUi,
  SchaleDbStuInfoFullVoicelineEntry
} from '@/types/OutsourcedData'

import PvDataTable from 'primevue/datatable'
import PvColumn from 'primevue/column'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH, NexonLangMapReverse, NexonLangMap } from '@/tool/Constant'
import { DirectoryDataCommonSchaleFileLocalization } from '@/tool/PreFetchedData'
import { useSetting } from '@/stores/setting'

const props = defineProps({
  dataVoice: {
    type: Object as PropType<SchaleDbStuInfoFullVoicelineEntry[]>,
    required: true
  },
  dataVoiceMt: {
    type: Object as PropType<SchaleDbVoicelineCategoryMtData>,
    required: true
  }
})

const setting = useSetting()
const i18n = useI18n()
const isMobile = computed(() => {
  const currWidth = useWindowSize().width.value
  return currWidth <= MOBILE_WIDTH
})
const isLoading = ref(true)
const dataCharI18n = DirectoryDataCommonSchaleFileLocalization.value['VoiceClip']

const dataForTable = computed(() =>
  convertSchaleDbVoiceCategoryForTable(props.dataVoice, i18nLangAll.value)
)

function getProperGroupId(entry: SchaleDbVoiceEntryForTable) {
  const entryId = entry.Id
  if (!isNaN(Number(entryId.slice(-1)))) {
    return entryId.slice(0, -1)
  } else {
    return entryId
  }
}

function getProperGroupDisplayHtml(entry: SchaleDbVoiceEntryForTable) {
  const entryId = getProperGroupId(entry)
  const entryGroupI18n = dataCharI18n[`${entryId}`]
  if (entryGroupI18n == undefined) {
    if (!isNaN(Number(entry.Id.slice(-1)))) {
      return `${entryGroupI18n}&nbsp;${entry.Id.slice(-1)}`
    } else {
      return entryGroupI18n
    }
  } else {
    return entryGroupI18n[NexonLangMapReverse[setting.ui_lang][0]].replaceAll(
      '{0}',
      String(entry.Id).slice(-1)
    )
  }
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
    <template v-for="(voiceEntry, idx) in dataForTable" :key="idx">
      <h3><span v-html="getProperGroupDisplayHtml(voiceEntry[0])"></span></h3>
      <PvDataTable :value="voiceEntry">
        <PvColumn
          field="TranscriptionLang"
          :header="i18n.t('comp-char-voice-lang-code')"
          style="width: 6em"
          v-if="!isMobile"
        />
        <PvColumn
          field="Transcription"
          :header="i18n.t('comp-char-voice-dialog-text')"
          style="width: calc(100%)"
        >
          <template #body="slotProps">
            <PvTag severity="info" value="Info" v-if="isMobile">{{
              slotProps.data.TranscriptionLang
            }}</PvTag
            >&nbsp;
            <DialogueTranslated
              :content-original-lang="NexonLangMap[slotProps.data.TranscriptionLang]"
              :content-translated="
                dataVoiceMt[slotProps.data.Id]?.Transcription[
                  slotProps.data.TranscriptionLang as NexonL10nDataLangOfUi
                ] || ''
              "
              :content-original="slotProps.data.Transcription || 'null'"
            />
          </template>
        </PvColumn>
      </PvDataTable>
    </template>
  </div>
</template>

<style scoped></style>
