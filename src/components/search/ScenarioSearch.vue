<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useSetting } from '@/stores/setting'
import ScenarioSearchEntryBond from '@/components/search/ScenarioSearchEntryBond.vue'
import { getNexonL10nDataFlattened } from '@/tool/StoryTool'
import { i18nLangAll, mtI18nLangStats } from '@/tool/ConstantComputed'
import ScenarioSearchEntryEvent from '@/components/search/ScenarioSearchEntryEvent.vue'
import { useI18n } from 'vue-i18n'
import type {
  I18nBondInfoData,
  I18nBondInfoDataEntry,
  I18nStoryInfoIdToXxhash,
  I18nStoryXxhashToL10nData,
  IndexManifestScenarioChildEntry,
  IndexManifestScenarioData,
  IndexManifestScenarioEntry,
  IndexMomotalkData,
  IndexScenarioInfoToI18nId,
  NexonL10nData,
  NexonL10nDataOfUi,
  StudentInfoDataSimple
} from '@/types/OutsourcedData'
import { NexonL10nDataLangOfUi } from '@/types/OutsourcedData'
import type { HTMLOptionData } from '@/types/CommonType'
import { useSearchVars } from '@/stores/search'

import PvSelect from 'primevue/select'
import PvFluid from 'primevue/fluid'
import PvDivider from 'primevue/divider'
import CharacterSheet from '@/components/CharacterSheet.vue'
import {
  DirectoryDataCommonFileIndexMomo,
  DirectoryDataCommonFileIndexMomoL2d,
  DirectoryDataCommonFileIndexScenarioI18nEvent,
  DirectoryDataCommonFileIndexScenarioI18nMain,
  DirectoryDataCommonFileIndexScenarioManifestEvent,
  DirectoryDataCommonFileIndexScenarioManifestMain,
  DirectoryDataCommonFileIndexStu,
  DirectoryDataStoryI18nFileI18nBond,
  DirectoryDataStoryI18nFileI18nEventIndex,
  DirectoryDataStoryI18nFileI18nMainIndex,
  DirectoryDataStoryI18nFileI18nStory
} from '@/tool/PreFetchedData'
import ScenarioSearchChapterMetadata from '@/components/search/ScenarioSearchChapterMetadata.vue'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import { mtPiniaWatchCallback } from '@/tool/translate/MtUtils'
import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import { createDictionaryWithDefault } from '@/tool/Utils'
import { getTranslation } from '@/tool/translate/MtDispatcher'
import PvMessage from 'primevue/message'

const selectType = ref('')
const i18n = useI18n()

/* DATA */
type ChapterMetadata = Record<'name' | 'desc', NexonL10nData>
type ChapterMetadataMt = Record<'name' | 'desc', NexonL10nDataOfUi>
// general
const cacheRecoveryMultiStage = ref<boolean>(false)
// for event
const dataSelectEventIndex = ref<HTMLOptionData[]>([])
let dataSelectEventStory = new Map<
  string,
  { id: string; name: NexonL10nData; desc: NexonL10nData }[]
>()
let dataSelectEventMetadata = new Map<string, ChapterMetadata>()
const dataSelectEventLoaded = ref(false)
// for bond
const dataSelectCharIndex = ref<HTMLOptionData[]>([])
let dataSelectMmt = new Map<string, { id: number; data: I18nBondInfoDataEntry }[]>()
const dataSelectBondLoaded = ref(false)
// for other (current)
const dataSelectMainCurrIndex1 = ref<HTMLOptionData[]>([]) /* Main - Volume */
const dataSelectMainCurrIndex2 = ref<HTMLOptionData[]>([]) /* Main - Chapter */
const dataSelectMainCurrStory = ref<{ id: string; name: NexonL10nData; desc: NexonL10nData }[]>(
  []
) /* 用于最终显示故事 */
const dataSelectMainCurrLoaded = ref(false)
/* <select> SELECTION */
const selectEventName = ref('')
const selectBondChar = ref('')
const selectMainVolume = ref('')
const selectMainChapter = ref('')
/* volume/chapter metadata */
const selectMainVolumeMetadata = computed<ChapterMetadata | null>(() => {
  if (selectMainVolume.value === '') {
    return null
  } else {
    const data = dataMainIndexManifest['main'][Number(selectMainVolume.value)]
    return {
      name: dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[data.name]],
      desc: dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[data.desc]]
    }
  }
})
const selectMainChapterMetadata = computed<ChapterMetadata | null>(() => {
  if (selectMainChapter.value === '') return null
  else {
    const currType = selectType.value
    if (currType === 'side' || currType === 'short' || currType === 'other') {
      const data = dataMainIndexManifest[currType][Number(selectMainChapter.value)]
      return {
        name: dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[data.name]],
        desc: dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[data.desc]]
      }
    } else if (currType === 'main') {
      const data =
        dataMainIndexManifest['main'][Number(selectMainVolume.value)].data[
          Number(selectMainChapter.value)
        ]
      return {
        name: dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[data.name]],
        desc: dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[data.desc]]
      }
    } else return null
  }
})

/* REMOTE DATA */
let dataI18nStoryXxhashToL10n: I18nStoryXxhashToL10nData = {} as I18nStoryXxhashToL10nData
let dataEventI18nKeyToXxhash: I18nStoryInfoIdToXxhash = {} as I18nStoryInfoIdToXxhash
let dataEventIndexManifest: IndexManifestScenarioEntry[] = [] as IndexManifestScenarioEntry[]
let dataEventScenarioIdToI18nKey: IndexScenarioInfoToI18nId = {} as IndexScenarioInfoToI18nId
let dataBondStudentName: StudentInfoDataSimple = {} as StudentInfoDataSimple
let dataBondIndexMomotalkScenario: IndexMomotalkData = {} as IndexMomotalkData
let dataBondScenarioI18n: I18nBondInfoData = {} as I18nBondInfoData
let dataBondL2dData: Record<string, number> = {} as Record<string, number>
let dataMainIndexManifest: IndexManifestScenarioData = {} as IndexManifestScenarioData
let dataMainScenarioIdToI18nKey: IndexScenarioInfoToI18nId = {} as IndexScenarioInfoToI18nId
let dataMainI18nKeyToXxhash: I18nStoryInfoIdToXxhash = {} as I18nStoryInfoIdToXxhash
const dataAllLoaded = ref(false)

async function loadAllData() {
  dataI18nStoryXxhashToL10n = DirectoryDataStoryI18nFileI18nStory.value

  dataEventI18nKeyToXxhash = DirectoryDataStoryI18nFileI18nEventIndex.value
  dataEventIndexManifest = DirectoryDataCommonFileIndexScenarioManifestEvent.value
  dataEventScenarioIdToI18nKey = DirectoryDataCommonFileIndexScenarioI18nEvent.value

  dataBondStudentName = DirectoryDataCommonFileIndexStu.value
  dataBondIndexMomotalkScenario = DirectoryDataCommonFileIndexMomo.value
  dataBondScenarioI18n = DirectoryDataStoryI18nFileI18nBond.value
  dataBondL2dData = DirectoryDataCommonFileIndexMomoL2d.value

  dataMainIndexManifest = DirectoryDataCommonFileIndexScenarioManifestMain.value
  dataMainScenarioIdToI18nKey = DirectoryDataCommonFileIndexScenarioI18nMain.value
  dataMainI18nKeyToXxhash = DirectoryDataStoryI18nFileI18nMainIndex.value

  dataAllLoaded.value = true
}

const setting = useSetting()
const searchCache = useSearchVars()
const uiLang = ref(setting.ui_lang)

const optionsType = [
  {
    value: 'event',
    label: 'Event Story'
  },
  {
    value: 'bond',
    label: 'Bond Story'
  },
  {
    value: 'main',
    label: 'Main Story'
  },
  {
    value: 'side',
    label: 'Side Story'
  },
  {
    value: 'short',
    label: 'Short Story'
  },
  {
    value: 'other',
    label: 'Other Story',
    disabled: true
  }
]
type optionsStoryTypeMain = 'main' | 'side' | 'short' | 'other'

function queryDamnI18nStoryData(key: string) {
  const temp = dataI18nStoryXxhashToL10n[key]
  const warnText = `[NO DATA for ${key}]`
  if (temp === undefined) {
    return {
      j_ja: warnText,
      j_ko: warnText,
      g_ja: warnText,
      g_ko: warnText,
      g_tw: warnText,
      g_tw_cn: warnText,
      g_th: warnText,
      g_en: warnText,
      c_cn: warnText,
      c_cn_tw: warnText
    }
  } else {
    return temp
  }
}

function loadBondData() {
  // Char data
  const data = dataBondStudentName
  let temp = []
  for (const [key, value] of Object.entries(data)) {
    let label = `${key}: ${getNexonL10nDataFlattened(value.Name, i18nLangAll.value, '/')}`
    temp.push({
      value: key,
      label: label
    })
  }
  dataSelectCharIndex.value = temp

  // MMT data
  const data2 = dataBondIndexMomotalkScenario
  const data3 = dataBondScenarioI18n
  let temp2 = new Map<string, { id: number; data: I18nBondInfoDataEntry }[]>()
  for (const key of Object.keys(data)) {
    const momoIndex = data2[key]
    if (typeof momoIndex !== 'string') {
      let temp3: { id: number; data: I18nBondInfoDataEntry }[] = []
      for (const idx in momoIndex) {
        const storyId = momoIndex[idx]
        temp3.push({
          id: storyId,
          data: data3[String(storyId)]
        })
      }
      temp2.set(String(key), temp3)
    }
  }
  dataSelectMmt = temp2

  dataSelectBondLoaded.value = dataSelectCharIndex.value.length !== 0 && dataSelectMmt.size !== 0
}

function loadEventData() {
  // event i18n index
  const dataI18nEvent = dataEventI18nKeyToXxhash

  // event index
  const data = dataEventIndexManifest
  let temp = []
  let temp3 = new Map<string, ChapterMetadata>()
  for (const entry of data) {
    temp.push({
      label: `${entry.id}: ${getNexonL10nDataFlattened(dataI18nStoryXxhashToL10n[String(dataI18nEvent[entry.name])], i18nLangAll.value, '/')}`,
      value: String(entry.id)
    })
    temp3.set(String(entry.id), {
      name: dataI18nStoryXxhashToL10n[String(dataI18nEvent[entry.name])],
      desc: dataI18nStoryXxhashToL10n[String(dataI18nEvent[entry.desc])]
    })
  }
  dataSelectEventIndex.value = temp
  dataSelectEventMetadata = temp3

  // event story
  const data2 = dataEventScenarioIdToI18nKey
  let temp2 = new Map<string, { id: string; name: NexonL10nData; desc: NexonL10nData }[]>()
  for (const entry of data) {
    const temp3 = []

    for (const idx2 in entry['data']) {
      const storyId = entry['data'][idx2]
      temp3.push({
        id: String(storyId),
        name: dataI18nStoryXxhashToL10n[dataI18nEvent[data2[String(storyId)][0]]],
        desc: dataI18nStoryXxhashToL10n[dataI18nEvent[data2[String(storyId)][1]]]
      })
    }

    temp2.set(entry['id'], temp3)
  }
  dataSelectEventStory = temp2

  dataSelectEventLoaded.value = true
}

function clearMainData() {
  dataSelectMainCurrIndex1.value = []
  dataSelectMainCurrIndex2.value = []
  selectMainVolume.value = ''
  selectMainChapter.value = ''
  dataSelectMainCurrLoaded.value = false
}

/* 载入主线故事Volume部分 */
function loadMainMainData1() {
  // get data
  const data = dataMainIndexManifest['main']
  let temp = []
  for (const idx in data) {
    const entry = data[idx]
    temp.push({
      label: `${Number(idx) + 1}: ${getNexonL10nDataFlattened(dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[entry.name]], i18nLangAll.value, '/')}`,
      value: String(idx)
    })
  }
  dataSelectMainCurrIndex1.value = temp

  dataSelectMainCurrLoaded.value = true
}

/* 载入主线故事Chapter部分 */
function loadMainMainData2() {
  // get data
  const data = dataMainIndexManifest['main'][Number(selectMainVolume.value)]['data']
  let temp = []
  for (const idx in data) {
    const entry = data[idx]
    temp.push({
      label: `${Number(idx) + 1}: ${getNexonL10nDataFlattened(dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[entry.name]], i18nLangAll.value, '/')}`,
      value: String(idx)
    })
  }
  dataSelectMainCurrIndex2.value = temp
  //console.log(temp)

  dataSelectMainCurrLoaded.value = true
}

/* 载入主线故事Scenario部分 */
function loadMainMainDataStory() {
  const data =
    dataMainIndexManifest['main'][Number(selectMainVolume.value)]['data'][
      Number(selectMainChapter.value)
    ]['data']
  let temp = []
  for (const storyId of data) {
    const entryI18n = dataMainScenarioIdToI18nKey[String(storyId)]
    temp.push({
      id: String(storyId),
      name: queryDamnI18nStoryData(String(dataMainI18nKeyToXxhash[String(entryI18n[0])])),
      desc: queryDamnI18nStoryData(String(dataMainI18nKeyToXxhash[String(entryI18n[1])]))
    })
  }
  dataSelectMainCurrStory.value = temp

  dataSelectMainCurrLoaded.value = true
}

/* 载入除主线故事以外的主故事部分 */
function loadMainOtherData() {
  if (!cacheRecoveryMultiStage.value) {
    clearMainData()
  }

  // get data
  const data: IndexManifestScenarioChildEntry[] = dataMainIndexManifest[
    selectType.value as optionsStoryTypeMain
  ] as IndexManifestScenarioChildEntry[]
  let temp = []
  for (const idx in data) {
    const entry = data[idx]
    temp.push({
      label: `${Number(idx) + 1}: ${getNexonL10nDataFlattened(dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[entry.name]], i18nLangAll.value, '/')}`,
      value: String(idx)
    })
  }
  dataSelectMainCurrIndex2.value = temp

  dataSelectMainCurrLoaded.value = true
}

function loadMainOtherDataStory() {
  const data =
    dataMainIndexManifest[selectType.value as optionsStoryTypeMain][
      Number(selectMainChapter.value)
    ]['data']
  let temp = []
  for (const idx in data) {
    const storyId = data[idx]
    const entryI18n = dataMainScenarioIdToI18nKey[String(storyId)]
    temp.push({
      id: String(storyId),
      name: queryDamnI18nStoryData(String(dataMainI18nKeyToXxhash[entryI18n[0]])),
      desc: queryDamnI18nStoryData(String(dataMainI18nKeyToXxhash[entryI18n[1]]))
    })
  }
  dataSelectMainCurrStory.value = temp
  // console.log(temp)

  dataSelectMainCurrLoaded.value = true
}

function dataMtGetDefaultData() {
  return {
    name: createDictionaryWithDefault(NexonL10nDataLangOfUi, () => ''),
    desc: createDictionaryWithDefault(NexonL10nDataLangOfUi, () => '')
  } //as ChapterMetadata
}

const dataMt = {
  eventMetadata: ref<ChapterMetadataMt>(dataMtGetDefaultData()),
  eventStory: ref<ChapterMetadataMt[]>([] as unknown as ChapterMetadataMt[]),
  bondStory: ref<ChapterMetadataMt[]>([] as unknown as ChapterMetadataMt[]),
  mainVolumeMetadata: ref<ChapterMetadataMt>(dataMtGetDefaultData()),
  mainChapterMetadata: ref<ChapterMetadataMt>(dataMtGetDefaultData()),
  mainStory: ref<ChapterMetadataMt[]>([] as unknown as ChapterMetadataMt[]),
  GetDefaultData: dataMtGetDefaultData
}

// 机翻数据变量
const dataMtControl = {
  inProgress: ref(false),
  pinia: useI18nTlControl()
}

const dataMtFunc = {
  _getDataList(length = 0) {
    const temp: ChapterMetadataMt[] = []
    for (let i = 0; i < length; i++) temp.push(dataMt.GetDefaultData())
    return temp
  },
  resetEventData(listLength = 0) {
    dataMt.eventMetadata.value = dataMt.GetDefaultData()
    dataMt.eventStory.value = this._getDataList(listLength)
  },
  resetBondData(listLength = 0) {
    dataMt.bondStory.value = this._getDataList(listLength)
  },
  resetMainVolume() {
    dataMt.mainVolumeMetadata.value = dataMt.GetDefaultData()
  },
  resetMainChapter(listLength = 0) {
    dataMt.mainChapterMetadata.value = dataMt.GetDefaultData()
    dataMt.mainStory.value = this._getDataList(listLength)
  }
}

// 清空机翻数据
function clearMtData(baselang: NexonL10nDataLangOfUi) {
  const resetEntry = (entry: ChapterMetadataMt) => {
    entry.name[baselang] = ''
    entry.desc[baselang] = ''
  }
  const resetEntryList = (entrylist: ChapterMetadataMt[]) => {
    for (const entry of entrylist) resetEntry(entry)
  }
  resetEntry(dataMt.eventMetadata.value)
  resetEntryList(dataMt.eventStory.value)
  resetEntryList(dataMt.bondStory.value)
  resetEntry(dataMt.mainVolumeMetadata.value)
  resetEntry(dataMt.mainChapterMetadata.value)
  resetEntryList(dataMt.mainStory.value)
}

// 更新机翻数据
async function updateMtData(baselang: NexonL10nDataLangOfUi) {
  if (baselang === 'null') return
  dataMtControl.inProgress = ref(false)
  clearMtData(baselang)

  const asyncPool = new AsyncTaskPool(8)
  const actualMtLang = setting.auto_i18n_lang
  const currMtService = setting.auto_i18n_service

  const updateNameDescTranslation = (
    oriName: NexonL10nData,
    oriDesc: NexonL10nData,
    target: ChapterMetadataMt
  ) => {
    const inner = async () => {
      target.name[baselang] = await getTranslation(currMtService, oriName[baselang], actualMtLang)
      target.desc[baselang] = await getTranslation(currMtService, oriDesc[baselang], actualMtLang)
    }
    return inner
  }

  if (selectType.value === 'event' && selectEventName.value !== '') {
    const currMD = dataSelectEventMetadata.get(selectEventName.value)
    if (currMD)
      asyncPool.addTask(
        updateNameDescTranslation(currMD.name, currMD.desc, dataMt.eventMetadata.value)
      )

    const currStory = dataSelectEventStory.get(selectEventName.value)
    if (currStory)
      for (const [idx, entry] of currStory.entries())
        asyncPool.addTask(
          updateNameDescTranslation(entry.name, entry.desc, dataMt.eventStory.value[idx])
        )
  } else if (selectType.value === 'bond' && selectBondChar.value !== '') {
    const currStory = dataSelectMmt.get(selectBondChar.value)
    if (currStory)
      for (const [idx, entry] of currStory.entries())
        asyncPool.addTask(
          updateNameDescTranslation(entry.data[0], entry.data[1], dataMt.bondStory.value[idx])
        )
  } else if (selectType.value !== '') {
    if (selectType.value === 'main' && selectMainVolume.value !== '') {
      const MD = selectMainVolumeMetadata.value
      if (MD)
        asyncPool.addTask(
          updateNameDescTranslation(MD.name, MD.desc, dataMt.mainVolumeMetadata.value)
        )
    }
    if (selectMainChapter.value !== '') {
      const MD = selectMainChapterMetadata.value
      if (MD)
        asyncPool.addTask(
          updateNameDescTranslation(MD.name, MD.desc, dataMt.mainChapterMetadata.value)
        )
      const story = dataSelectMainCurrStory.value
      for (const [idx, entry] of story.entries())
        asyncPool.addTask(
          updateNameDescTranslation(entry.name, entry.desc, dataMt.mainStory.value[idx])
        )
    }
  }
  await asyncPool.runAll(dataMtControl.pinia.updateProgress)
  dataMtControl.inProgress.value = false
}

// 机翻的数据watcher
watch(
  () => [selectEventName.value, selectBondChar.value],
  ([n1, n2], oldValues) => {
    const [o1, o2] = oldValues || ['', '']
    if (n1 === '') dataMtFunc.resetEventData()
    else if (n1 !== o1 && n1 !== '') {
      const currEvent = dataSelectEventStory.get(n1)
      if (currEvent) dataMtFunc.resetEventData(currEvent.length)
    }
    if (n2 === '') dataMtFunc.resetBondData()
    else if (n2 !== o2 && n2 !== '') {
      const currChar = dataSelectMmt.get(n2)
      if (currChar) dataMtFunc.resetBondData(currChar.length)
    }
  },
  { immediate: true }
)

// Pinia状态watcher
watch(mtI18nLangStats, async (newValue) => {
  await mtPiniaWatchCallback(
    newValue,
    updateMtData,
    clearMtData,
    dataMtControl.pinia.setStatusToComplete
  )
})

// <select> value
watch(
  () => selectType.value,
  (newValue) => {
    if (!cacheRecoveryMultiStage.value) {
      clearMainData()
      dataSelectMainCurrLoaded.value = false
    }
    if (newValue === 'main') {
      loadMainMainData1()
    } else {
      loadMainOtherData()
    }
  }
)

// UI lang change detect
watch(
  () => [setting.ui_lang, i18nLangAll.value],
  () => {
    uiLang.value = setting.ui_lang
    if (dataSelectEventLoaded.value) {
      dataSelectEventLoaded.value = false
      loadEventData()
    }
    if (dataSelectBondLoaded.value) {
      dataSelectBondLoaded.value = false
      loadBondData()
    }
    if (dataSelectMainCurrLoaded.value) {
      if (selectType.value === 'main') {
        loadMainMainData1()
        loadMainMainData2()
      } else {
        loadMainOtherData()
      }
    }
  }
)

// Story - Main
watch(
  () => selectMainVolume.value,
  (newValue) => {
    dataSelectMainCurrLoaded.value = false
    if (!cacheRecoveryMultiStage.value) {
      selectMainChapter.value = ''
    }
    cacheRecoveryMultiStage.value = false
    dataMtFunc.resetMainVolume()
    if (newValue !== '') loadMainMainData2()
    else {
      dataSelectMainCurrIndex2.value = []
    }
    dataSelectMainCurrLoaded.value = true
  }
)
watch(
  () => selectMainChapter.value,
  (newValue) => {
    // console.log(newValue)

    dataSelectMainCurrLoaded.value = false
    if (newValue !== '') {
      if (selectType.value === 'main') loadMainMainDataStory()
      else {
        loadMainOtherDataStory()
        cacheRecoveryMultiStage.value = false
      }
      dataMtFunc.resetMainChapter(dataSelectMainCurrStory.value.length)
    } else {
      dataSelectMainCurrStory.value = []
      dataMtFunc.resetMainChapter()
    }
    dataSelectMainCurrLoaded.value = true
  }
)

/* 搜索内容缓存 (instance 级) */
onMounted(async () => {
  await loadAllData()
  loadEventData()
  loadBondData()
  if (searchCache.n_selectMainVolume !== '' || searchCache.n_selectMainChapter !== '') {
    cacheRecoveryMultiStage.value = true
  }
  selectType.value = searchCache.n_selectType
  selectEventName.value = searchCache.n_selectEventName
  selectBondChar.value = searchCache.n_selectBondChar
  selectMainVolume.value = searchCache.n_selectMainVolume
  selectMainChapter.value = searchCache.n_selectMainChapter
})
watch(
  () => [
    selectType.value,
    selectEventName.value,
    selectBondChar.value,
    selectMainVolume.value,
    selectMainChapter.value
  ],
  () => {
    searchCache.setNormalSearchVars(
      selectType.value,
      selectEventName.value,
      selectBondChar.value,
      selectMainVolume.value,
      selectMainChapter.value
    )
  }
)
</script>

<template>
  <div v-if="!dataAllLoaded">
    <h2>Loading...</h2>
  </div>
  <div v-if="dataAllLoaded">
    <!-- h1 标题 -->
    <h1 class="search-h1">
      <i class="pi pi-search"></i>
      <span>&nbsp;&nbsp;<span v-html="i18n.t('search-h1')"></span></span>
    </h1>

    <!-- 选择 select -->
    <div class="search-select-div">
      <PvFluid class="pv-fluid">
        <span class="search-select-span-label">{{ $t('comp-search-scenario-select-1') }}</span>
        <PvSelect
          v-model="selectType"
          size="small"
          :placeholder="i18n.t('comp-search-select-placeholder')"
          class="search-select-pv-select"
          :options="optionsType"
          :optionLabel="(i) => i18n.t('comp-search-scenario-option-' + i.value)"
          optionValue="value"
        />
      </PvFluid>
      <div class="pv-fluid-spacing" v-show="selectType !== ''"></div>
      <PvFluid class="pv-fluid" v-if="selectType === 'event'">
        <span class="search-select-span-label">{{ $t('comp-search-scenario-select-2') }}</span>
        <PvSelect
          v-model="selectEventName"
          size="small"
          filter
          :placeholder="i18n.t('comp-search-select-placeholder')"
          class="search-select-pv-select"
          :options="dataSelectEventIndex"
          optionLabel="label"
          optionValue="value"
        />
      </PvFluid>
      <template v-else-if="selectType === 'bond'">
        <PvFluid class="pv-fluid">
          <span class="search-select-span-label">{{ $t('comp-search-scenario-select-3') }}</span>
          <PvSelect
            v-model="selectBondChar"
            size="small"
            filter
            :placeholder="i18n.t('comp-search-select-placeholder')"
            class="search-select-pv-select"
            :options="dataSelectCharIndex"
            optionLabel="label"
            optionValue="value"
          />
        </PvFluid>

        <template v-if="selectBondChar === '10041'">
          <div class="pv-fluid-spacing"></div>
          <!-- REMINDED: INVASIVE CODE INSERTION -->
          <PvMessage severity="info" icon="pi pi-external-link">
            <span
              >Yay!&nbsp;<RouterLink to="/misakiii"
                ><span style="text-decoration-line: underline">Misakiii!</span></RouterLink
              >
            </span>
          </PvMessage>
        </template>
      </template>
      <template v-else-if="selectType === 'main'">
        <PvFluid class="pv-fluid">
          <span class="search-select-span-label">{{ $t('comp-search-scenario-select-4') }}</span>
          <PvSelect
            v-model="selectMainVolume"
            size="small"
            filter
            :placeholder="i18n.t('comp-search-select-placeholder')"
            class="search-select-pv-select"
            :options="dataSelectMainCurrIndex1"
            optionLabel="label"
            optionValue="value"
          />
        </PvFluid>
        <div class="pv-fluid-spacing" v-show="selectType === 'main'"></div>
        <PvFluid class="pv-fluid">
          <span class="search-select-span-label">{{ $t('comp-search-scenario-select-5') }}</span>
          <PvSelect
            v-model="selectMainChapter"
            size="small"
            filter
            :placeholder="i18n.t('comp-search-select-placeholder')"
            class="search-select-pv-select"
            :options="dataSelectMainCurrIndex2"
            optionLabel="label"
            optionValue="value"
          />
        </PvFluid>
      </template>
      <PvFluid class="pv-fluid" v-else-if="selectType !== ''">
        <span class="search-select-span-label">{{ $t('comp-search-scenario-select-6') }}</span>
        <PvSelect
          v-model="selectMainChapter"
          size="small"
          filter
          :placeholder="i18n.t('comp-search-select-placeholder')"
          class="search-select-pv-select"
          :options="dataSelectMainCurrIndex2"
          optionLabel="label"
          optionValue="value"
        />
      </PvFluid>
    </div>

    <PvDivider />

    <!-- 显示结果 -->
    <div v-if="selectType === 'event'">
      <div v-loading="!dataSelectEventLoaded" :key="uiLang">
        <h2>{{ $t('comp-search-scenario-result') }}</h2>
        <ScenarioSearchChapterMetadata
          :data="dataSelectEventMetadata.get(selectEventName)!"
          :data-mt="dataMt.eventMetadata.value"
          v-if="selectEventName !== ''"
        />
        <div :key="uiLang + '_' + selectEventName" class="search-event">
          <ScenarioSearchEntryEvent
            :data_no="idx + 1"
            :data="entry"
            :data-mt="dataMt.eventStory.value[idx]"
            v-for="(entry, idx) in dataSelectEventStory.get(selectEventName)"
            :key="idx"
          />
        </div>
      </div>
    </div>
    <div v-else-if="selectType === 'bond'">
      <div v-loading="!dataSelectBondLoaded" :key="uiLang">
        <h2>{{ $t('comp-search-scenario-select-result') }}</h2>
        <template v-if="selectBondChar">
          <CharacterSheet :is-mmt="false" :char-id="selectBondChar" />
          <div :key="uiLang + '_' + selectBondChar">
            <ScenarioSearchEntryBond
              :char_id="selectBondChar"
              :data_no="idx + 1"
              :data="entry"
              :data-mt="dataMt.bondStory.value[idx].name"
              :is-l2d="entry.id === dataBondL2dData[selectBondChar]"
              v-for="(entry, idx) in dataSelectMmt.get(selectBondChar)"
              :key="idx"
            />
          </div>
        </template>
      </div>
    </div>
    <div v-else-if="selectType === 'main'">
      <div v-loading="!dataSelectMainCurrLoaded" :key="uiLang">
        <h2>{{ $t('comp-search-scenario-select-result') }}</h2>
        <ScenarioSearchChapterMetadata
          :data="selectMainVolumeMetadata"
          :data-mt="dataMt.mainVolumeMetadata.value"
          v-if="selectMainVolumeMetadata"
        />
        <br />
        <ScenarioSearchChapterMetadata
          :data="selectMainChapterMetadata"
          :data-mt="dataMt.mainChapterMetadata.value"
          v-if="selectMainChapterMetadata"
        />
        <div :key="uiLang + '_' + selectMainChapter">
          <ScenarioSearchEntryEvent
            :data_no="idx + 1"
            :data="entry"
            :data-mt="dataMt.mainStory.value[idx]"
            v-for="(entry, idx) in dataSelectMainCurrStory"
            :key="idx"
          />
        </div>
      </div>
    </div>
    <div v-else-if="selectType !== ''">
      <div v-loading="!dataSelectMainCurrLoaded" :key="uiLang">
        <h2>{{ $t('comp-search-scenario-select-result') }}</h2>
        <ScenarioSearchChapterMetadata
          :data="selectMainChapterMetadata"
          :data-mt="dataMt.mainChapterMetadata.value"
          v-if="selectMainChapterMetadata"
        />
        <div :key="uiLang + '_' + selectMainChapter">
          <ScenarioSearchEntryEvent
            :data_no="idx + 1"
            :data="entry"
            :data-mt="dataMt.mainStory.value[idx]"
            v-for="(entry, idx) in dataSelectMainCurrStory"
            :key="idx"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-select-div {
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
}

.search-event {
  max-width: max(1200px, 80%);
}

@media screen and (max-width: 700px) {
  .search-event {
    max-width: 100%;
  }

  .search-select-div {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
