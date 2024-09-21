<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { onMounted, onBeforeMount, type Ref, ref, watch, provide } from 'vue'
import { MOBILE_WIDTH_WIDER, NexonLangMap } from '@/tool/Constant'
import { useRoute } from 'vue-router'
import { httpGetJsonAsync } from '@/tool/HttpRequest'
import { useWindowSize } from '@vueuse/core'
import ScenarioDialogue from '@/components/scenario/ScenarioDialogue.vue'
import { NexonL10nDataLang as NexonL10nDataLangConst } from '@/types/OutsourcedData'
import type { CommonStoryDataDialog, IndexScenarioCharacterData, NexonL10nDataLang } from '@/types/OutsourcedData'
import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import {
  joinTranslateResult as GoogleML_joinTranslateResult,
  translate as GoogleML_translate
} from '@/tool/translate/GoogleTranslate'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import { i18nLangAll } from '@/tool/ConstantComputed'

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

// --------------------- ML AUTO TRANSLATE ---------------------
// 创建每句台词对应的对应表
const tableDialogueTranslated: Ref<Record<NexonL10nDataLang, {'name': string; 'dialogue': string}[]>> = ref({
  'j_ja': [],
  'j_ko': [],
  'g_tw': [],
  'g_tw_cn': [],
  'g_en': [],
  'g_th': [],
  'g_ja': [],
  'g_ko': [],
  'c_cn': [],
  'c_cn_tw': [],
  'null': []
})
const ML_in_progress = ref(false)
const ML_pinia = useI18nTlControl()

function clearMlTranslation(baselang: NexonL10nDataLang) {
  const dataLength = scenarioData!.length
  const actualTable = tableDialogueTranslated.value
  const blankData = {'name': '', 'dialogue': ''}

  for (let i = 0; i < dataLength; i++) {
    if (actualTable[baselang].length <= i) {
      actualTable[baselang].push(blankData)
    } else {
      actualTable[baselang][i] = blankData
    }
  }
}

async function updateMlTranslation(baselang: NexonL10nDataLang) {
  ML_in_progress.value = true
  clearMlTranslation(baselang as NexonL10nDataLang)

  async function getTranslation(oriNameText: string, oriDialogueText: string, idx: number) {
    let textName: string, textDialogue: string

    if (oriNameText) textName = GoogleML_joinTranslateResult(await GoogleML_translate(oriNameText, actualMlLang))
    else textName = ""
    if (oriDialogueText) textDialogue = GoogleML_joinTranslateResult(await GoogleML_translate(oriDialogueText, actualMlLang))
    else textDialogue = ""

    tableDialogueTranslated.value[baselang][idx] = {name: textName, dialogue: textDialogue}
  }

  const asyncPool = new AsyncTaskPool(8)
  const actualMlLang = setting.auto_i18n_lang
  for (const [idx, entry] of scenarioData.entries()) {
    asyncPool.addTask(
      () => getTranslation(getCharName(entry).Name[baselang], entry.Message[baselang], idx)
    )
  }

  await asyncPool.runAll()
  ML_in_progress.value = false

  console.log(tableDialogueTranslated.value[baselang])
}

function initMlData() {
  for (const lang of NexonL10nDataLangConst) {
    clearMlTranslation(lang)
  }
  clearMlTranslation('null' as NexonL10nDataLang)
}

watch(
  () => [ML_pinia.i18n_l1, ML_pinia.i18n_l2, ML_pinia.i18n_l3],
  async (newValue) => {
    if (newValue[0].startsWith("t")) {
      if (i18nLangAll.value[0])
        await updateMlTranslation(i18nLangAll.value[0] as NexonL10nDataLang)
      ML_pinia.setStatusToComplete("i18n_l1")
    }
    else if (newValue[1].startsWith("t")) {
      if (i18nLangAll.value[1])
        await updateMlTranslation(i18nLangAll.value[1] as NexonL10nDataLang)
      ML_pinia.setStatusToComplete("i18n_l2")
    }
    else if (newValue[2].startsWith("t")) {
      if (i18nLangAll.value[2])
        await updateMlTranslation(i18nLangAll.value[2] as NexonL10nDataLang)
      ML_pinia.setStatusToComplete("i18n_l3")
    } else {
      // 如果是清空指令的话
      if (newValue[0].startsWith("c")) {
        clearMlTranslation(i18nLangAll.value[0] as NexonL10nDataLang)
        ML_pinia.setStatusToComplete("i18n_l1")
      }
      if (newValue[1].startsWith("c")) {
        clearMlTranslation(i18nLangAll.value[1] as NexonL10nDataLang)
        ML_pinia.setStatusToComplete("i18n_l2")
      }
      if (newValue[2].startsWith("c")) {
        clearMlTranslation(i18nLangAll.value[2] as NexonL10nDataLang)
        ML_pinia.setStatusToComplete("i18n_l3")
      }

    }
  }
)

provide('ML_clearAll', initMlData)
provide("ML_table", tableDialogueTranslated)
provide('ML_in_progress', ML_in_progress)
// -------------------------------------------------------------

onMounted(async () => {
  await Promise.allSettled([
    httpGetJsonAsync(scenarioData, `/data/story/normal/${router.params.storyId}.json`),
    httpGetJsonAsync(scenarioChar, `/data/common/index_scenario_char.json`)
  ])
  initMlData()

  isAllDataLoaded.value = true
})
</script>

<template>
  <div v-if="!isAllDataLoaded">
    <h2>Loading...</h2>
  </div>
  <div v-if="isAllDataLoaded">
    <table class="momotalk-table" v-show="screenWidth >= MOBILE_WIDTH_WIDER && !setting.ui_force_mobile">
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
                        :entry_pos="idx"
                        v-for="(entry, idx) in scenarioData" :key="idx" />
    </table>
    <table class="momotalk-table" v-show="screenWidth < MOBILE_WIDTH_WIDER || setting.ui_force_mobile">
      <thead>
      <tr>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-l4') }}</th>
      </tr>
      </thead>
      <ScenarioDialogue :data_type="entry.DataType" :data_char="getCharName(entry)" :data_dialog="entry"
                        :entry_pos="idx"
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