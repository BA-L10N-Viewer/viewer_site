<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { onMounted, type Ref, ref, watch } from 'vue'
import { MOBILE_WIDTH_WIDER, NexonLangMap } from '@/tool/Constant'
import { useRoute } from 'vue-router'
import { httpGetJsonAsync } from '@/tool/HttpRequest'
import { useWindowSize } from '@vueuse/core'
import ScenarioDialogue from '@/components/scenario/ScenarioDialogue.vue'
import type { CommonStoryDataDialog, IndexScenarioCharacterData } from '@/types/OutsourcedData'

// --------------------- I18N ---------------------
const setting = useSetting()
const i18nL1: Ref = ref(setting.i18n_lang1)
const i18nL2: Ref = ref(setting.i18n_lang2)
const i18nL3: Ref = ref(setting.i18n_lang3)
const langL1: Ref = ref(NexonLangMap[i18nL1.value])
const langL2: Ref = ref(NexonLangMap[i18nL2.value])
const langL3: Ref = ref(NexonLangMap[i18nL3.value])
watch(
  () => {
    return [setting.i18n_lang1, setting.i18n_lang2, setting.i18n_lang3]
  },
  () => {
    i18nL1.value = setting.i18n_lang1
    i18nL2.value = setting.i18n_lang2
    i18nL3.value = setting.i18n_lang3
    langL1.value = NexonLangMap[i18nL1.value]
    langL2.value = NexonLangMap[i18nL2.value]
    langL3.value = NexonLangMap[i18nL3.value]
  },
  { immediate: true }
)
// ------------------------------------------------
const router = useRoute()
const screenWidth = useWindowSize().width

let scenarioData: CommonStoryDataDialog[] = [] as unknown as CommonStoryDataDialog[]
let scenarioChar: IndexScenarioCharacterData = {} as unknown as IndexScenarioCharacterData
const isAllDataLoaded = ref(false)

function getCharName(entry: CommonStoryDataDialog) {
  const charId = String(entry.CharacterId)
  if (charId !== '-1') {
    const data = scenarioChar[charId]
    if (data) return data
    else return scenarioChar['-1']
  } else {
    return scenarioChar['-1']
  }
}

onMounted(async () => {
  await Promise.allSettled([
    httpGetJsonAsync(scenarioData, `/data/story/normal/${router.params.storyId}.json`),
    httpGetJsonAsync(scenarioChar, `/data/common/index_scenario_char.json`)
  ])
  isAllDataLoaded.value = true
})
</script>

<template>
  <div v-if="!isAllDataLoaded">
    <h2>Loading...</h2>
  </div>
  <div v-if="isAllDataLoaded">
    <table class="momotalk-table" v-if="screenWidth >= MOBILE_WIDTH_WIDER">
      <thead>
      <tr>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-l1') }}</th>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-l2') }}</th>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-l3') }}</th>
      </tr>
      </thead>
      <ScenarioDialogue :data_type="entry.DataType" :data_char="getCharName(entry)" :data_dialog="entry"
                        v-for="(entry, idx) in scenarioData" :key="idx" />
    </table>
    <table class="momotalk-table" v-else>
      <thead>
      <tr>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-l4') }}</th>
      </tr>
      </thead>
      <ScenarioDialogue :data_type="entry.DataType" :data_char="getCharName(entry)" :data_dialog="entry"
                        v-for="(entry, idx) in scenarioData" :key="idx" />
    </table>
  </div>
</template>

<style scoped>
th {
  position: sticky;
  top: 60px;
  background: white;
}
</style>