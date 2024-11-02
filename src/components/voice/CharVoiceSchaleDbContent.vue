<script setup lang="ts">
import { computed, inject, onMounted, type PropType, ref } from 'vue'
import type { SchaleDbVoicelineCategoryMtData } from '@/tool/CharVoiceMt'
import { useI18n } from 'vue-i18n'
import { symbolDataCharVoiceI18n } from '@/types/CharVoiceComp'
import { convertSchaleDbVoiceCategoryForTable, type SchaleDbVoiceEntryForTable } from '@/tool/CharVoiceForTable'
import { i18nLangAll } from '@/tool/ConstantComputed'
import type { NexonL10nDataLangOfUi, SchaleDbStuInfoFullVoicelineEntry } from '@/types/OutsourcedData'

import PvDataTable from 'primevue/datatable'
import PvColumn from 'primevue/column'
import DialogueTranslated from '@/components/DialogueTranslated.vue'

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

const i18n = useI18n()

const isLoading = ref(true)
const dataCharI18n = inject(symbolDataCharVoiceI18n)!

const dataForTable = computed(
  () => convertSchaleDbVoiceCategoryForTable(props.dataVoice, i18nLangAll.value)
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
  const entryGroupI18n = dataCharI18n[`SDB.${entryId}`]
  if (entryGroupI18n) {
    if (!isNaN(Number(entry.Id.slice(-1)))) {
      return `${entryGroupI18n}&nbsp;${entry.Id.slice(-1)}`
    } else {
      return entryGroupI18n
    }
  } else {
    return entryId
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
        <PvColumn field="TranscriptionLang" :header="i18n.t('comp-char-voice-lang-code')" style="width: 6em">
          <template #body="slotProps">
            {{ slotProps.data.TranscriptionLang }}
          </template>
        </PvColumn>
        <PvColumn field="Transcription" :header="i18n.t('comp-char-voice-dialog-text')"
                  style="width: calc(100% - 12em - 5%)">
          <template #body="slotProps">
            <DialogueTranslated
              :content-translated="dataVoiceMt[slotProps.data.Id]?.Transcription[slotProps.data.TranscriptionLang as NexonL10nDataLangOfUi] || ''"
              :content-original="slotProps.data.Transcription || 'null'" />
          </template>
        </PvColumn>
      </PvDataTable>
    </template>
  </div>
</template>

<style scoped>

</style>