<script setup lang="ts">
import type { NexonCharVoiceNormal } from '@/types/OutsourcedDataVoice'
import { inject, onMounted, type PropType, computed } from 'vue'
import { ref } from 'vue'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'

import { symbolDataCharVoiceI18n, symbolDataCharVoiceNexon, symbolMtDataCharVoiceNexon } from '@/types/CharVoiceComp'
import type { NexonCharVoiceMtData } from '@/tool/CharVoiceMt'

import PvDataTable from 'primevue/datatable'
import PvColumn from 'primevue/column'
import PvDivider from 'primevue/divider'
import { convertNexonCharVoiceNormalCategoryForTable } from '@/tool/CharVoiceForTable'
import { i18nLangAll } from '@/tool/ConstantComputed'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import type { NexonL10nDataLangOfUi } from '@/types/OutsourcedData'

const props = defineProps({
  data: {
    type: Object as PropType<NexonCharVoiceNormal>,
    required: true
  }
})

const isLoading = ref(true)

const dataMtChar = computed(() => inject(symbolMtDataCharVoiceNexon)!.value['Normal'])
const dataCharI18n = inject(symbolDataCharVoiceI18n)!

const dataForTable = computed(
  () => convertNexonCharVoiceNormalCategoryForTable(props.data, i18nLangAll.value)
)
console.log(dataForTable.value)

onMounted(async () => {
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <h3>CharVoiceNexonNormal</h3>
    <StoryI18nSetting />
    <PvDivider />

    <!-- Voice Data Start -->
    <template v-for="(voiceGroup, idx) in dataForTable" :key="idx">
      <h3>{{ dataCharI18n[`NX.${voiceGroup.GroupId}`] }}</h3>
      <PvDataTable :value="voiceGroup.Data.flat()"
                   rowGroupMode="rowspan" :groupRowsBy="['Id', 'CostumePos']" sortMode="single" :sortOrder="1">
        <PvColumn field="CostumePos" header="人物造型编号" style="width: 6em">
          <template #body="slotProps">
            {{ slotProps.data.CostumePos }}
          </template>
        </PvColumn>
        <PvColumn field="Id" header="语音编号" style="width: 4em">
          <template #body="slotProps">
            {{ slotProps.data.Id.slice(-1) }}
          </template>
        </PvColumn>
        <PvColumn field="TranscriptionLang" header="语言代码" style="width: 2em">
          <template #body="slotProps">
            {{ slotProps.data.TranscriptionLang }}
          </template>
        </PvColumn>
        <PvColumn field="Transcription" header="语音文本" style="width: calc(100% - 4em - 5%)">
          <template #body="slotProps">
            <DialogueTranslated :content-translated="dataMtChar[slotProps.data.Id]?.Transcription[slotProps.data.TranscriptionLang as NexonL10nDataLangOfUi]?.[Number(slotProps.data.CostumePos)] || ''"
                                :content-original="slotProps.data.Transcription || 'null'" />
          </template>
        </PvColumn>
      </PvDataTable>
    </template>
  </div>
</template>

<style scoped>

</style>