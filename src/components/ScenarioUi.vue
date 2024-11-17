<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { onMounted, type Ref, ref, watch, provide, onUpdated, computed } from 'vue'
import { i18nDesktopLoopIdx, MOBILE_WIDTH_WIDER, paginationScenarioControl } from '@/tool/Constant'
import { useRoute } from 'vue-router'
import { httpGetJsonAsync } from '@/tool/HttpRequest'
import { useWindowSize } from '@vueuse/core'
import ScenarioDialogue from '@/components/scenario/ScenarioDialogue.vue'
import {
  type I18nStoryXxhashToL10nData,
  type NexonL10nData,
  NexonL10nDataLang as NexonL10nDataLangConst, type RelatedScenarioInfoData, type RelatedScenarioParentInfoData,
  type StudentInfoDataSimple
} from '@/types/OutsourcedData'
import type { CommonStoryDataDialog, IndexScenarioCharacterData, NexonL10nDataLang } from '@/types/OutsourcedData'
import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import { i18nLangAll, mtI18nLangStats } from '@/tool/ConstantComputed'
import { chunk } from 'lodash'
import type { MlForScenario } from '@/types/MachineTranslation'
import { getDialogueMtTranslation, type MtServiceName } from '@/tool/translate/MtDispatcher'
import { mtPiniaWatchCallback } from '@/tool/translate/MtUtils'

import PvPaginator from 'primevue/paginator'
import { getScenarioI18nContent } from '@/tool/StoryTool'
import ScenarioSheet from '@/components/scenario/ScenarioSheet.vue'
import PvDivider from 'primevue/divider'
import {
  getScenarioDataStatus,
  inferScenarioMainCategoryById,
  inferScenarioTypeById,
  type ScenarioParentData, type ScenarioParentDataBond, type ScenarioParentDataEvent, type ScenarioParentDataMain
} from '@/tool/components/Scenario'

// ------------------------------------------------
const setting = useSetting()
const router = useRoute()
const screenWidth = useWindowSize().width

let scenarioData: CommonStoryDataDialog[] = [] as unknown as CommonStoryDataDialog[]
let scenarioChar: IndexScenarioCharacterData = {} as unknown as IndexScenarioCharacterData
let scenarioNameDesc: NexonL10nData[] = [] as unknown as NexonL10nData[]
let bondStuInfo: StudentInfoDataSimple = {} as unknown as StudentInfoDataSimple
let scenarioRelatedParentInfo: RelatedScenarioParentInfoData = {} as unknown as RelatedScenarioParentInfoData
let scenarioRelatedData: RelatedScenarioInfoData = {} as unknown as RelatedScenarioInfoData
let i18nStoryData: I18nStoryXxhashToL10nData = {} as unknown as I18nStoryXxhashToL10nData
const isAllDataLoaded = ref(false)

const scenarioID = computed(() => String(useRoute().params.storyId))
const scenarioParentData = computed<ScenarioParentData>(() => {
  const type1 = inferScenarioTypeById(scenarioID.value)
  const type2 = type1 === 'main' ? inferScenarioMainCategoryById(scenarioID.value) : type1

  if (type1 === 'main') {
    const pos1 = scenarioRelatedData['main'][2][0]
    const pos2 = scenarioRelatedData['main'][2][1]
    if (type2 === 'main') {
      return {
        Type: type1,
        Data: {
          Category: type2,
          VolumeName: i18nStoryData[scenarioRelatedParentInfo[`main_${pos1}`][0]],
          ChapterName: i18nStoryData[scenarioRelatedParentInfo[`main_${pos1}_${pos2}`][0]]
        }
      } as ScenarioParentDataMain
    } else
      return {
        Type: type1,
        Data: {
          Category: type2,
          ChapterName: i18nStoryData[scenarioRelatedParentInfo[`main_${pos1}_${pos2}`][0]]
        }
      } as ScenarioParentDataMain
  } else if (type1 === 'bond')
    return {
      Type: type1,
      Data: {
        CharId: scenarioID.value.slice(0, 5),
        CharName: bondStuInfo[scenarioID.value.slice(0, 5)]['Name']
      }
    } as ScenarioParentDataBond
  else {
    return {
      Type: type1,
      Data: {
        EventId: scenarioRelatedData['event'][scenarioID.value][2][0],
        EventName: i18nStoryData[scenarioRelatedParentInfo[`event_${scenarioRelatedData['event'][scenarioID.value][2][0]}`][0]]
      }
    } as ScenarioParentDataEvent
  }
})

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

// --------------------- PAGINATION CONFIG ---------------------
const pagination_length = ref(0)
const pagination_currPerSize = computed(() => setting.scenario_pagination_perPage)
const pagination_currPage = ref(1)
const pagination_currPage_cache = ref(1)

const pagination_size = ref('')
const pagination_layout = ref('')
const pagination_pagerCount = ref(7)

const pagination_data = ref()
const pagination_template = computed(() => {
  const width = useWindowSize().width.value

  if (width <= 640)
    return 'PrevPageLink CurrentPageReport NextPageLink'
  else if (width <= 960)
    return 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink'
  else if (width <= 1300)
    return 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
  else
    return 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown JumpToPageInput'
})

watch(
  () => useWindowSize().width.value,
  (newValue) => {
    pagination_layout.value = newValue >= MOBILE_WIDTH_WIDER ? 'total, sizes, prev, pager, next, jumper' : 'sizes, prev, pager, next'
    pagination_size.value = newValue >= MOBILE_WIDTH_WIDER ? 'default' : 'small'
    pagination_pagerCount.value = newValue >= MOBILE_WIDTH_WIDER ? 7 : 4
  },
  { immediate: true }
)

watch(
  () => pagination_currPerSize.value,
  (newValue) => {
    updatePaginationData(newValue)
  }
)

function updatePaginationData(currPerSize: number = -1) {
  pagination_length.value = scenarioData.length

  const perSize = currPerSize === -1 ? pagination_currPerSize.value : currPerSize
  pagination_data.value = chunk(scenarioData, perSize)
}

function initPagination() {
  updatePaginationData()
}

const htmlAnchorMainTableTop: Ref<HTMLAnchorElement | null> = ref(null)
onUpdated(() => {
  if (pagination_currPage.value !== pagination_currPage_cache.value) {
    pagination_currPage_cache.value = pagination_currPage.value

    const targetHeightOffset = htmlAnchorMainTableTop.value?.getBoundingClientRect().y
    if (targetHeightOffset) {
      window.scrollBy({
        left: 0,
        top: targetHeightOffset - 70,
        behavior: 'smooth'
      })
    } else {
      console.error(`PAGINATION REPOSITION FAILED, offset = ${targetHeightOffset}`)
    }
  }
})

// -------------------------------------------------------------

// --------------------- ML AUTO TRANSLATE ---------------------
// 创建每句台词对应的对应表
const tableDialogueTranslated: Ref<MlForScenario> = ref({
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
  const blankData = { 'name': '', 'dialogue': '' }

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
  clearMlTranslation(baselang)

  const asyncPool = new AsyncTaskPool(8)
  const actualMlLang = setting.auto_i18n_lang
  for (const [idx, entry] of scenarioData.entries()) {
    asyncPool.addTask(
      async () => {
        tableDialogueTranslated.value[baselang][idx] = await getDialogueMtTranslation(
          setting.auto_i18n_service as MtServiceName,
          getCharName(entry).Name[baselang],
          entry.Message[baselang],
          actualMlLang
        )
      }
    )
  }

  await asyncPool.runAll(ML_pinia.updateProgress)
  ML_in_progress.value = false

  // console.log(tableDialogueTranslated.value[baselang])
}

function initMlData() {
  for (const lang of NexonL10nDataLangConst) {
    clearMlTranslation(lang)
  }
  clearMlTranslation('null' as NexonL10nDataLang)
}

watch(
  mtI18nLangStats,
  async (newValue) => {
    await mtPiniaWatchCallback(newValue, updateMlTranslation, clearMlTranslation, ML_pinia.setStatusToComplete)
  }
)

provide('ML_clearAll', initMlData)
provide('ML_table', tableDialogueTranslated)
provide('ML_in_progress', ML_in_progress)
// -------------------------------------------------------------

onMounted(async () => {
  await Promise.allSettled([
    httpGetJsonAsync(scenarioData, `/data/story/normal/${router.params.storyId}.json`),
    httpGetJsonAsync(scenarioChar, `/data/common/index_scenario_char.json`),
    httpGetJsonAsync(bondStuInfo, `/data/common/index_stu.json`),
    httpGetJsonAsync(scenarioRelatedParentInfo, `/data/common/index_related_manifest_parent.json`),
    httpGetJsonAsync(scenarioRelatedData, `/data/common/index_related_manifest_scenario.json`),
    httpGetJsonAsync(i18nStoryData, '/data/story/i18n/i18n_story.json'),
    (async () => {
      scenarioNameDesc = await getScenarioI18nContent(Number(scenarioID.value)) as NexonL10nData[]
    })()
  ])
  initMlData()
  initPagination()

  isAllDataLoaded.value = true
})
</script>

<template>
  <div v-if="!isAllDataLoaded">
    <h2>Loading...</h2>
  </div>
  <div v-if="isAllDataLoaded">
    <h2>{{ $t('comp-scenario-datasheet-name') }}</h2>
    <ScenarioSheet :scenario-desc="scenarioNameDesc[1]" :scenario-name="scenarioNameDesc[0]"
                   :scenario-id="String(scenarioID)"
                   :parent-data="scenarioParentData"
                   :data-status="getScenarioDataStatus(scenarioData[0].Message)" />
    <PvDivider />

    <a ref="htmlAnchorMainTableTop"></a>
    <table class="momotalk-table" v-show="screenWidth >= MOBILE_WIDTH_WIDER && !setting.ui_force_mobile"
           id="scnario-main-table">
      <thead>
      <tr>
        <template v-for="idx in i18nDesktopLoopIdx" :key="idx">
          <template v-if="i18nLangAll[idx] as string !== 'null'">
            <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
            <th scope="col">{{ $t(`comp-mmt-ui-table-th-l${idx + 1}`) }}</th>
          </template>
        </template>
      </tr>
      </thead>
      <ScenarioDialogue :data_type="entry.DataType" :data_char="getCharName(entry)" :data_dialog="entry"
                        :entry_pos="idx + (pagination_currPage - 1) * pagination_currPerSize"
                        :key="idx"
                        v-for="(entry, idx) in pagination_data[pagination_currPage - 1]" />
    </table>
    <table class="momotalk-table" v-show="screenWidth < MOBILE_WIDTH_WIDER || setting.ui_force_mobile"
           id="scnario-main-table">
      <thead>
      <tr>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
        <th scope="col">{{ $t('comp-mmt-ui-table-th-l4') }}</th>
      </tr>
      </thead>
      <ScenarioDialogue :data_type="entry.DataType" :data_char="getCharName(entry)" :data_dialog="entry"
                        :entry_pos="idx + (pagination_currPage - 1) * pagination_currPerSize"
                        :key="idx"
                        v-for="(entry, idx) in pagination_data[pagination_currPage - 1]" />
    </table>

    <br />
    <PvPaginator
      :rows="setting.scenario_pagination_perPage"
      :total-records="pagination_length"
      :rowsPerPageOptions="paginationScenarioControl.perPage"
      :template="pagination_template"

      @page="value => {pagination_currPage = value.page + 1}"
      @update:rows="value => {setting.scenario_pagination_perPage = value}"
    >
      <template #end>
        Total: {{ pagination_length }}
      </template>
    </PvPaginator>
  </div>
</template>

<style scoped>
</style>