<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue'
import {
  type SchaleDbStuInfoFullVoiceline,
  SchaleDbStuInfoFullVoicelineCategory
} from '@/types/OutsourcedData'
import type { SchaleDbStuVoicelineMtData } from '@/script/CharVoiceMt'
import CharVoiceSchaleDbContent from '@/components/voice/CharVoiceSchaleDbContent.vue'

import PvTabs from 'primevue/tabs'
import PvTabList from 'primevue/tablist'
import PvTab from 'primevue/tab'
import PvTabPanels from 'primevue/tabpanels'
import PvTabPanel from 'primevue/tabpanel'
import { findFirstAvailableTabName } from '@/script/CharVoice'

const props = defineProps({
  dataVoice: {
    type: Object as PropType<SchaleDbStuInfoFullVoiceline>,
    required: true
  },
  dataVoiceMt: {
    type: Object as PropType<SchaleDbStuVoicelineMtData>,
    required: true
  }
})

const isLoading = ref(true)

const currTab = ref('Normal')
const dataTabAvailability = [false, false, false, false]

async function loadData() {
  // 更新可用性列表
  for (const [idx, key] of SchaleDbStuInfoFullVoicelineCategory.entries()) {
    if (props.dataVoice[key] && props.dataVoice[key].length !== 0) {
      dataTabAvailability[idx] = true
    }
  }

  currTab.value = findFirstAvailableTabName(
    dataTabAvailability,
    SchaleDbStuInfoFullVoicelineCategory
  )
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
    <PvTabs
      :value="currTab"
      scrollable
      style="border: 1px var(--pv-tabs-tablist-border-color) solid"
    >
      <PvTabList>
        <PvTab value="Normal">{{ $t('char-voice-ui-select-tab-normal') }}</PvTab>
        <PvTab value="Lobby">{{ $t('char-voice-ui-select-tab-lobby') }}</PvTab>
        <PvTab value="Event" v-if="dataTabAvailability[3]">{{
          $t('char-voice-ui-select-tab-event')
        }}</PvTab>
      </PvTabList>
      <PvTabPanels>
        <PvTabPanel value="Normal">
          <CharVoiceSchaleDbContent
            :dataVoice="dataVoice.Normal"
            :dataVoiceMt="dataVoiceMt.Normal"
          />
        </PvTabPanel>
        <PvTabPanel value="Lobby">
          <CharVoiceSchaleDbContent :dataVoice="dataVoice.Lobby" :dataVoiceMt="dataVoiceMt.Lobby" />
        </PvTabPanel>
        <PvTabPanel value="Event" v-if="dataTabAvailability[3]">
          <CharVoiceSchaleDbContent :dataVoice="dataVoice.Event" :dataVoiceMt="dataVoiceMt.Event" />
        </PvTabPanel>
      </PvTabPanels>
    </PvTabs>
  </div>
</template>

<style scoped></style>
