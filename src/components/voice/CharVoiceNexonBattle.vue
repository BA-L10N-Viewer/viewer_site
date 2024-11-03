<script setup lang="ts">
import type { NexonCharVoiceBattle } from '@/types/OutsourcedDataVoice'
import { computed, inject, onMounted, type PropType } from 'vue'
import { ref } from 'vue'
import type { NexonCharVoiceBattleMtData } from '@/tool/CharVoiceMt'
import { symbolDataCharVoiceI18n } from '@/types/CharVoiceComp'
import { i18nLangAll } from '@/tool/ConstantComputed'
import { convertNexonCharVoiceBattleCategoryForTable } from '@/tool/CharVoiceForTable'

import PvDataTable from 'primevue/datatable'
import PvColumn from 'primevue/column'
import type { NexonL10nDataLangOfUi } from '@/types/OutsourcedData'
import { useI18n } from 'vue-i18n'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import PvTag from 'primevue/tag'

const props = defineProps({
  dataVoice: {
    type: Object as PropType<NexonCharVoiceBattle>,
    required: true
  },
  dataVoiceMt: {
    type: Object as PropType<NexonCharVoiceBattleMtData>,
    required: true
  }
})

const i18n = useI18n()

const isLoading = ref(true)
const dataCharI18n = inject(symbolDataCharVoiceI18n)!

const dataForTable = computed(
  () => convertNexonCharVoiceBattleCategoryForTable(props.dataVoice, i18nLangAll.value)
)

onMounted(async () => {
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <template v-for="(voiceGroup, idx) in dataForTable" :key="idx">
      <h3 class="char-voice-group-h3">{{ dataCharI18n[`NX.${voiceGroup.GroupId}`] }}</h3>
      <template v-for="(voiceEnrty, idx2) in voiceGroup.Data" :key="idx2">
        <p><b>{{ dataCharI18n[`NX.${voiceGroup.GroupId}`] }}&nbsp;{{ idx2 + 1 }}</b></p>
        <PvDataTable :value="voiceEnrty">
          <PvColumn field="Transcription" :header="i18n.t('comp-char-voice-dialog-text')" style="width: calc(100% - 6em - 5%)">
            <template #body="slotProps">
              <PvTag severity="info" value="Info">{{ slotProps.data.TranscriptionLang }}</PvTag>&nbsp;
              <DialogueTranslated
                :content-translated="dataVoiceMt[slotProps.data.Id]?.Transcription[slotProps.data.TranscriptionLang as NexonL10nDataLangOfUi] || ''"
                :content-original="slotProps.data.Transcription || 'null'" />
            </template>
          </PvColumn>
        </PvDataTable>
      </template>
    </template>
  </div>
</template>

<style scoped>

</style>