<script setup lang="ts">
import type { NexonCharVoiceBattle } from '@/types/OutsourcedDataVoice'
import { computed, inject, onMounted, type PropType, ref, defineAsyncComponent } from 'vue'
import type { NexonCharVoiceBattleMtData } from '@/script/CharVoiceMt'
import { symbolDataCharVoiceI18n } from '@/types/CharVoiceComp'
import { i18nLangAll } from '@/tool/ConstantComputed'
import { convertNexonCharVoiceBattleCategoryForTable } from '@/script/CharVoiceForTable'

import PvDataTable from 'primevue/datatable'
import PvColumn from 'primevue/column'
import PvButton from 'primevue/button'
import type { NexonL10nDataLangOfUi } from '@/types/OutsourcedData'
import { useI18n } from 'vue-i18n'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import PvTag from 'primevue/tag'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH, NexonLangMap } from '@/tool/Constant'
import { useDialog } from 'primevue'

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
const isMobile = computed(() => {
  const currWidth = useWindowSize().width.value
  return currWidth <= MOBILE_WIDTH
})
const isLoading = ref(true)
const dataCharI18n = inject(symbolDataCharVoiceI18n)!

const dataForTable = computed(() =>
  convertNexonCharVoiceBattleCategoryForTable(props.dataVoice, i18nLangAll.value)
)

const componentDialogVoiceDetail = defineAsyncComponent(() => import('./CharVoiceDetailDialog.vue'))
const pvDialog = useDialog()
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
      <h3 class="char-voice-group-h3">
        {{ dataCharI18n[`NX.${voiceGroup.GroupId}`] }}&nbsp;
        <PvButton
          v-if="dataCharI18n[`NX.${voiceGroup.GroupId}.Extra`] !== ''"
          v-tooltip.hover.top="dataCharI18n[`NX.${voiceGroup.GroupId}.Extra`]"
          size="small"
          severity="secondary"
          @click="showVoiceDetailDialog(dataCharI18n[`NX.${voiceGroup.GroupId}.Extra`])"
        >
          <i class="pi pi-question-circle"></i>
        </PvButton>
      </h3>
      <template v-for="(voiceEnrty, idx2) in voiceGroup.Data" :key="idx2">
        <p>
          <b>{{ dataCharI18n[`NX.${voiceGroup.GroupId}`] }}&nbsp;{{ idx2 + 1 }}</b>
        </p>
        <PvDataTable :value="voiceEnrty">
          <PvColumn
            field="TranscriptionLang"
            :header="i18n.t('comp-char-voice-lang-code')"
            style="width: 6em"
            v-if="!isMobile"
          />
          <PvColumn
            field="Transcription"
            :header="i18n.t('comp-char-voice-dialog-text')"
            style="width: calc(100% - 6em - 5%)"
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
    </template>
  </div>
</template>

<style scoped></style>
