<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { computed, onBeforeUnmount, onMounted, provide, ref, type Ref, watch } from 'vue'
import { i18nDesktopLoopIdx, MOBILE_WIDTH, MOBILE_WIDTH_WIDER, paginationScenarioControl } from '@/tool/Constant'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { httpGetJsonAsync } from '@/tool/HttpRequest'
import { useWindowSize } from '@vueuse/core'
import ScenarioDialogue from '@/components/scenario/ScenarioDialogue.vue'
import {
  type CommonStoryDataDialog,
  type IndexScenarioCharacterData,
  type MomotalkStoryData, type MomotalkStoryDataEntry, NexonL10nDataLangOfUi
} from '@/types/OutsourcedData'
import {
  type I18nStoryXxhashToL10nData,
  type NexonL10nData,
  NexonL10nDataLang,
  type RelatedScenarioInfoData,
  type RelatedScenarioParentInfoData,
  type StudentInfoDataSimple
} from '@/types/OutsourcedData'
import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import { i18nLangAll, mtI18nLangStats, numberOfSelectedLangForDesktop } from '@/tool/ConstantComputed'
import { chunk } from 'lodash'
import { type MlForMomotalk, type MlForScenario } from '@/types/MachineTranslation'
import { getDialogueMtTranslation, getTranslation, type MtServiceName } from '@/tool/translate/MtDispatcher'
import {
  mtPiniaWatchCallback,
  symbolForMomotalkMtData,
  symbolForMtProgressBool,
  symbolForScenarioMtData
} from '@/tool/translate/MtUtils'

import PvPaginator from 'primevue/paginator'
import { getScenarioExtraDataById, getScenarioI18nContent } from '@/tool/StoryTool'
import ScenarioSheet from '@/components/scenario/ScenarioSheet.vue'
import PvDivider from 'primevue/divider'
import {
  getScenarioDataStatus,
  inferScenarioMainCategoryById,
  inferScenarioTypeById,
  type ScenarioParentData,
  type ScenarioParentDataBond,
  type ScenarioParentDataEvent,
  type ScenarioParentDataMain,
  type ScenarioRelatedStoryData
} from '@/tool/components/Scenario'
import ScenarioRelatedStory from '@/components/scenario/ScenarioRelatedStory.vue'
import {
  DirectoryDataCommonFileIndexRelatedManifestParent,
  DirectoryDataCommonFileIndexRelatedManifestScenario,
  DirectoryDataCommonFileIndexScenarioChar,
  DirectoryDataCommonFileIndexStu,
  DirectoryDataStoryI18nFileI18nStory
} from '@/tool/PreFetchedData'
import { AppPageCategoryToI18nCode, changeAppPageTitle } from '@/tool/AppTitleChanger'
import { useI18n } from 'vue-i18n'
import PvInplace from 'primevue/inplace'
import MomotalkUi from '@/components/MomotalkUi.vue'
import { createDictionaryWithDefault } from '@/tool/Tool'

// ------------------------------------------------
const setting = useSetting()
const i18n = useI18n()
const router = useRoute()
const screenWidth = useWindowSize().width

const scenarioData = ref<CommonStoryDataDialog[]>([] as unknown as CommonStoryDataDialog[])
let scenarioChar: IndexScenarioCharacterData = DirectoryDataCommonFileIndexScenarioChar.value
let scenarioNameDesc = ref<NexonL10nData[]>([] as unknown as NexonL10nData[])
let bondStuInfo: StudentInfoDataSimple = DirectoryDataCommonFileIndexStu.value
let scenarioRelatedParentInfo: RelatedScenarioParentInfoData = DirectoryDataCommonFileIndexRelatedManifestParent.value
let scenarioRelatedData: RelatedScenarioInfoData = DirectoryDataCommonFileIndexRelatedManifestScenario.value
let i18nStoryData: I18nStoryXxhashToL10nData = DirectoryDataStoryI18nFileI18nStory.value
const scenarioRelatedStoryData = ref<ScenarioRelatedStoryData>({} as unknown as ScenarioRelatedStoryData)
const isAllDataLoaded = ref(false)

const scenarioID = ref(String(router.params.storyId))
const scenarioParentData = computed<ScenarioParentData>(() => {
  const type1 = inferScenarioTypeById(scenarioID.value)
  const type2 = type1 === 'main' ? inferScenarioMainCategoryById(scenarioID.value) : type1

  if (type1 === 'main') {
    const pos1 = scenarioRelatedData['main'][scenarioID.value][2][0]
    const pos2 = scenarioRelatedData['main'][scenarioID.value][2][1]
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

// ------------------------------------------------------------
// MMT
const mmtCharId = ref(scenarioID.value.length === 7 ? Number(scenarioID.value.slice(0, 5)) : -1)
const mmtData = ref<MomotalkStoryData>([] as unknown as MomotalkStoryData)
const mmtDataCurrPos = computed(() => {
  const temp = getScenarioExtraDataById(Number(scenarioID.value))
  return Number(temp.actualScenarioNo) - 1
})
const mmtDataCurrEntry = computed<MomotalkStoryDataEntry | null>(() => {
  if (mmtDataCurrPos.value + 1 <= mmtData.value.length)
    return mmtData.value[mmtDataCurrPos.value]
  return null
})

async function getScenarioRelatedStoryData(): Promise<ScenarioRelatedStoryData> {
  const scenarioType = inferScenarioTypeById(scenarioID.value)
  const currData = scenarioRelatedData[scenarioType][scenarioID.value]

  const [prevId, nextId] = currData[0]

  let prevData: NexonL10nData[] = []
  let nextData: NexonL10nData[] = []
  let prevName: NexonL10nData | null = null
  let prevPosString: string | null = null
  let nextName: NexonL10nData | null = null
  let nextPosString: string | null = null

  if (prevId) {
    prevData = await getScenarioI18nContent(Number(prevId)) as NexonL10nData[]
    prevName = prevData[0]

    const temp = getScenarioExtraDataById(Number(prevId))
    if (scenarioType === 'main' || (scenarioID.value.startsWith('1100') && scenarioID.value.length === 5))
      prevPosString = `${temp.actualScenarioNo}-${temp.isAfterBattle ? 'B' : 'A'}`
    else
      prevPosString = `${temp.actualScenarioNo}`
  }
  if (nextId) {
    nextData = await getScenarioI18nContent(Number(nextId)) as NexonL10nData[]
    nextName = nextData[0]

    const temp = getScenarioExtraDataById(Number(nextId))
    if (scenarioType === 'main' || (scenarioID.value.startsWith('1100') && scenarioID.value.length === 5))
      nextPosString = `${temp.actualScenarioNo}-${temp.isAfterBattle ? 'B' : 'A'}`
    else
      nextPosString = `${temp.actualScenarioNo}`
  }
  return {
    Prev: { Id: prevId, Name: prevName, PosString: prevPosString },
    Next: { Id: nextId, Name: nextName, PosString: nextPosString }
  }
}

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
const pagination_currPage = ref(1)
const pagination_currPage_cache = ref(1)

const pagination_data = ref()
const pagination_template = computed(() => {
  const width = useWindowSize().width.value

  if (width <= MOBILE_WIDTH)
    return 'PrevPageLink CurrentPageReport NextPageLink'
  else if (width <= MOBILE_WIDTH_WIDER)
    return 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown'
  else
    return 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown JumpToPageInput'
})

watch(
  () => setting.scenario_pagination_perPage,
  (newValue) => {
    updatePaginationData(newValue)
  }
)

function updatePaginationData(currPerSize: number = -1) {
  pagination_length.value = scenarioData.value.length

  const perSize = currPerSize === -1 ? setting.scenario_pagination_perPage : currPerSize
  pagination_data.value = chunk(scenarioData.value, perSize)
}

function initPagination() {
  pagination_currPage.value = 1
  pagination_currPage_cache.value = 1
  updatePaginationData()
}

const htmlAnchorMainTableTop: Ref<HTMLAnchorElement | null> = ref(null)
watch(pagination_currPage, () => { //onUpdated(() => {
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
}, { flush: 'post' })

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
const tableMmtTranslated = ref<MlForMomotalk>([] as unknown as MlForMomotalk)
const scenarioNameDescMt = ref<NexonL10nData[]>([] as unknown as NexonL10nData[])

const ML_in_progress = ref(false)
const ML_pinia = useI18nTlControl()

function clearMlTranslation(baselang: NexonL10nDataLang) {
  const blankData = { 'name': '', 'dialogue': '' }

  scenarioNameDescMt.value[0][baselang] = ''
  scenarioNameDescMt.value[1][baselang] = ''

  if (mmtCharId.value !== -1 && mmtDataCurrEntry.value) {
    const mmtEntry = mmtDataCurrEntry.value.Data
    const mmtMtEntry = tableMmtTranslated.value[mmtDataCurrPos.value]
    for (let i = 0; i < mmtEntry.length; i++) {
      if (mmtMtEntry[baselang].length <= i)
        mmtMtEntry[baselang].push(blankData)
      else
        mmtMtEntry[baselang][i] = blankData
    }
  }

  const dataLength = scenarioData!.value.length
  const actualTable = tableDialogueTranslated.value
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
  asyncPool.addTask(async () => {
    scenarioNameDescMt.value[0][baselang] = await getTranslation(
      setting.auto_i18n_service,
      scenarioNameDesc.value[0][baselang],
      actualMlLang
    )
    scenarioNameDescMt.value[1][baselang] = await getTranslation(
      setting.auto_i18n_service,
      scenarioNameDesc.value[1][baselang],
      actualMlLang
    )
  })
  if (mmtCharId.value !== -1 && mmtDataCurrEntry.value) {
    const mmtEntry = mmtDataCurrEntry.value.Data
    const mmtMtEntry = tableMmtTranslated.value[mmtDataCurrPos.value]
    const mmtStu = bondStuInfo[String(mmtCharId.value)]

    for (const [idx, entry] of mmtEntry.entries()) {
      asyncPool.addTask(async () => {
        mmtMtEntry[baselang][idx] = await getDialogueMtTranslation(
          setting.auto_i18n_service,
          mmtStu.Name[baselang] || '',
          entry.Message[baselang],
          actualMlLang
        )
      })
    }
  }
  for (const [idx, entry] of scenarioData.value.entries()) {
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
}

function initMlData(initMmt: boolean = false) {
  tableDialogueTranslated.value = {
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
  }
  if (initMmt) {
    tableMmtTranslated.value = [] as unknown as MlForMomotalk
    for (let i = 0; i < mmtData.value.length; i++)
      tableMmtTranslated.value.push({
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
  }
  scenarioNameDescMt.value = [createDictionaryWithDefault(NexonL10nDataLang, () => {return ''}),
    createDictionaryWithDefault(NexonL10nDataLang, () => {return ''})]

  for (const lang of NexonL10nDataLang) {
    clearMlTranslation(lang)
  }
  clearMlTranslation('null' as NexonL10nDataLang)
}

watch(
  mtI18nLangStats,
  async (newValue) => {
    await mtPiniaWatchCallback(
      newValue,
      updateMlTranslation,
      (lang: NexonL10nDataLangOfUi) => {
        clearMlTranslation(lang as NexonL10nDataLang)
      },
      ML_pinia.setStatusToComplete
    )
  }
)

provide(symbolForScenarioMtData, tableDialogueTranslated)
provide(symbolForMomotalkMtData, tableMmtTranslated)
provide(symbolForMtProgressBool, ML_in_progress.value)
// -------------------------------------------------------------

// --------------------- TABLE CSS WIDTH ---------------------
// 控制table的width
const isMobile = computed(() => screenWidth.value < MOBILE_WIDTH_WIDER || setting.ui_force_mobile)
const cssWidthForThOfChar = '6em'
const cssWidthForThOfContent = computed(() => {
  if (isMobile.value)
    return '100% - calc(6em)'
  else {
    const currLangCount = numberOfSelectedLangForDesktop.value
    if (currLangCount !== 0)
      return `calc(${Math.floor(100 / currLangCount)}vw - ${cssWidthForThOfChar})`
    else
      return '100%'
  }
})
// -------------------------------------------------------------

const titleChanger = ref<() => void>(() => {
})

onMounted(async () => {
  await Promise.allSettled([
    httpGetJsonAsync(scenarioData.value, `/data/story/normal/${router.params.storyId}.json`),
    (async () => {
      scenarioNameDesc.value = await getScenarioI18nContent(Number(scenarioID.value)) as NexonL10nData[]
      scenarioRelatedStoryData.value = await getScenarioRelatedStoryData()
    })(),
    (async () => {
      if (mmtCharId.value !== -1)
        await httpGetJsonAsync(mmtData.value, `/data/story/momotalk/${mmtCharId.value}.json`)
    })()
  ])
  initMlData(true)
  initPagination()

  titleChanger.value = watch(
    () => [setting.ui_lang, scenarioID.value, scenarioNameDesc.value[0]],
    newValue => {
      changeAppPageTitle(i18n.t(AppPageCategoryToI18nCode['scenario']), newValue[2] as NexonL10nData, i18nLangAll.value)
    },
    { immediate: true, flush: 'post' }
  )

  isAllDataLoaded.value = true
})

onBeforeUnmount(() => {
  // stop watcher
  titleChanger.value()
})

onBeforeRouteUpdate(async (to, from) => {
  scenarioID.value = String(to.params.storyId)
  const mmtCharIdNew = scenarioID.value.length === 7 ? Number(scenarioID.value.slice(0, 5)) : -1

  isAllDataLoaded.value = false
  await Promise.allSettled([
    httpGetJsonAsync(scenarioData.value, `/data/story/normal/${scenarioID.value}.json`),
    (async () => {
      scenarioNameDesc.value = await getScenarioI18nContent(Number(scenarioID.value)) as NexonL10nData[]
      scenarioRelatedStoryData.value = await getScenarioRelatedStoryData()
    })(),
    (async () => {
      if (mmtCharIdNew !== -1) {
        if (mmtCharIdNew !== mmtCharId.value) {
          await httpGetJsonAsync(mmtData.value, `/data/story/momotalk/${mmtCharIdNew}.json`)
        }
      } else {
        mmtData.value = [] as unknown as MomotalkStoryData
      }
    })()
  ])

  if (mmtCharIdNew !== mmtCharId.value) {
    mmtCharId.value = mmtCharIdNew
    initMlData(true)
  } else {
    mmtCharId.value = mmtCharIdNew
    initMlData(false)
  }
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
    <ScenarioSheet :scenario-desc="scenarioNameDesc[1]"
                   :scenario-name="scenarioNameDesc[0]"
                   :scenario-desc-mt="scenarioNameDescMt[1]"
                   :scenario-name-mt="scenarioNameDescMt[0]"
                   :scenario-id="String(scenarioID)"
                   :parent-data="scenarioParentData"
                   :data-status="getScenarioDataStatus(scenarioData[0].Message)" />
    <PvDivider />

    <template v-if="mmtCharId !== -1 && mmtDataCurrEntry">
      <p>{{ $t('comp-scenario-mmt-p-tip') }}</p>
      <PvInplace>
        <template #display>
          <span>{{ $t('comp-scenario-mmt-btn-show') }}</span>
        </template>
        <template #content>
          <MomotalkUi
            :data_data="mmtDataCurrEntry"
            :data_charname="bondStuInfo[String(mmtCharId)].Name"
            :mmt_entry_pos="mmtDataCurrPos" />
        </template>
      </PvInplace>
      <PvDivider />
    </template>

    <ScenarioRelatedStory :prev-id="scenarioRelatedStoryData.Prev.Id"
                          :prev-name="scenarioRelatedStoryData.Prev.Name"
                          :prev-pos-string="scenarioRelatedStoryData.Prev.PosString"
                          :next-id="scenarioRelatedStoryData.Next.Id"
                          :next-name="scenarioRelatedStoryData.Next.Name"
                          :next-pos-string="scenarioRelatedStoryData.Next.PosString"
                          :key="scenarioID"
                          info-pos="top" />
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
                        :entry_pos="idx + (pagination_currPage - 1) * setting.scenario_pagination_perPage"
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
                        :entry_pos="idx + (pagination_currPage - 1) * setting.scenario_pagination_perPage"
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
    <br />
    <ScenarioRelatedStory :prev-id="scenarioRelatedStoryData.Prev.Id"
                          :prev-name="scenarioRelatedStoryData.Prev.Name"
                          :prev-pos-string="scenarioRelatedStoryData.Prev.PosString"
                          :next-id="scenarioRelatedStoryData.Next.Id"
                          :next-name="scenarioRelatedStoryData.Next.Name"
                          :next-pos-string="scenarioRelatedStoryData.Next.PosString"
                          :key="scenarioID"
                          info-pos="bottom" />
  </div>
</template>

<style scoped>
.momotalk-table th:nth-child(odd) {
  width: v-bind(cssWidthForThOfChar)
}

.momotalk-table th:nth-child(even) {
  width: v-bind(cssWidthForThOfContent);
}
</style>
