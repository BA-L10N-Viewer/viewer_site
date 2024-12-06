<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CharVoiceNexonNormal from '@/components/voice/CharVoiceNexonNormal.vue'
import CharVoiceNexonBattle from '@/components/voice/CharVoiceNexonBattle.vue'
import CharVoiceNexonEvent from '@/components/voice/CharVoiceNexonEvent.vue'
import type { NexonCharVoiceEntry } from '@/types/OutsourcedDataVoice'
import { SchaleDbStuInfoFullVoicelineCategory } from '@/types/OutsourcedData'
import type { NexonCharVoiceMtData } from '@/tool/CharVoiceMt'

import PvTabs from 'primevue/tabs'
import PvTabList from 'primevue/tablist'
import PvTab from 'primevue/tab'
import PvTabPanels from 'primevue/tabpanels'
import PvTabPanel from 'primevue/tabpanel'
import { findFirstAvaliableTabName } from '@/tool/CharVoice'

const props = defineProps({
  dataVoice: {
    type: Object as PropType<NexonCharVoiceEntry>,
    required: true
  },
  dataVoiceMt: {
    type: Object as PropType<NexonCharVoiceMtData>,
    required: true
  }
})

const i18n = useI18n()

const currTab = ref('Normal')

const isLoading = ref(true)
const dataVoiceAvailability = [false, false, false, false]

async function loadData() {
  for (const [idx, category] of SchaleDbStuInfoFullVoicelineCategory.entries()) {
    const currCategory = props.dataVoice[category]
    if (currCategory) {
      if (currCategory.length !== 0) {
        dataVoiceAvailability[idx] = true
      }
    }
  }

  currTab.value = findFirstAvaliableTabName(dataVoiceAvailability, SchaleDbStuInfoFullVoicelineCategory)
}

onMounted(async () => {
  await loadData()

  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-if="!isLoading">
    <KeepAlive>
      <PvTabs :value="currTab" scrollable style="border: 1px var(--pv-tabs-tablist-border-color) solid">
        <PvTabList>
          <PvTab value="Normal" v-if="dataVoiceAvailability[0]">{{i18n.t('char-voice-ui-select-tab-normal')}}</PvTab>
          <PvTab value="Lobby" v-if="dataVoiceAvailability[1]">{{i18n.t('char-voice-ui-select-tab-lobby')}}</PvTab>
          <PvTab value="Battle" v-if="dataVoiceAvailability[2]">{{i18n.t('char-voice-ui-select-tab-battle')}}</PvTab>
          <PvTab value="Event" v-if="dataVoiceAvailability[3]">{{i18n.t('char-voice-ui-select-tab-event')}}</PvTab>
        </PvTabList>
        <PvTabPanels>
          <PvTabPanel value="Normal" v-if="dataVoiceAvailability[0]">
            <component :is="CharVoiceNexonNormal" :dataVoice="dataVoice.Normal" :dataVoiceMt="dataVoiceMt.Normal" />
          </PvTabPanel>
          <PvTabPanel value="Lobby" v-if="dataVoiceAvailability[1]">
            <component :is="CharVoiceNexonNormal" :dataVoice="dataVoice.Lobby!" :dataVoiceMt="dataVoiceMt.Lobby!" />
          </PvTabPanel>
          <PvTabPanel value="Battle" v-if="dataVoiceAvailability[2]">
            <component :is="CharVoiceNexonBattle" :dataVoice="dataVoice.Battle!" :dataVoiceMt="dataVoiceMt.Battle!" />
          </PvTabPanel>
          <PvTabPanel value="Event" v-if="dataVoiceAvailability[3]">
            <component :is="CharVoiceNexonEvent" :dataVoice="dataVoice.Event!" :dataVoiceMt="dataVoiceMt.Event!" />
          </PvTabPanel>
        </PvTabPanels>
      </PvTabs>
    </KeepAlive>
  </div>
</template>

<style scoped>

</style>