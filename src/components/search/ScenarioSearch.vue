<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { getStaticCdnBasepath, httpGetJsonAsync } from '@/tool/HttpRequest'
import { useSetting } from '@/stores/setting'
import ScenarioSearchEntryBond from '@/components/search/ScenarioSearchEntryBond.vue'
import { getNexonL10nDataFlattened } from '@/tool/StoryTool'
import { i18nLangAll } from '@/tool/ConstantComputed'
import ScenarioSearchEntryEvent from '@/components/search/ScenarioSearchEntryEvent.vue'
import { useI18n } from 'vue-i18n'
import type {
  I18nBondInfoData,
  I18nBondInfoDataEntry,
  I18nStoryInfoIdToXxhash, I18nStoryXxhashToL10nData,
  IndexManifestScenarioEntry,
  IndexManifestScenarioData,
  IndexMomotalkData,
  IndexScenarioInfoToI18nId,
  NexonL10nData,
  StudentInfoDataSimple, IndexManifestScenarioChildEntry
} from '@/types/OutsourcedData'
import type { HTMLOptionData } from '@/types/CommonType'
import { useSearchVars } from '@/stores/search'

import PvSelect from 'primevue/select'
import PvFluid from 'primevue/fluid'
import PvDivider from 'primevue/divider'

const selectType = ref('')
const i18n = useI18n()

/* DATA */
// general
const cacheRecoveryMultiStage = ref<boolean>(false)
// for event
let dataSelectEventIndex = ref<HTMLOptionData[]>([])
let dataSelectEventStory = new Map<string, { id: string; name: NexonL10nData; desc: NexonL10nData; }[]>()
let dataSelectEventLoaded = ref(false)
// for bond
let dataSelectCharIndex = ref<HTMLOptionData[]>([])
let dataSelectMmt = new Map<string, { id: number; data: I18nBondInfoDataEntry }[]>()
let dataSelectBondLoaded = ref(false)
// for main/other story
let dataStoryMainLoaded = ref(false)
// for other (current)
let dataSelectMainCurrIndex1 = ref<HTMLOptionData[]>([])   /* Main - Volume */
let dataSelectMainCurrIndex2 = ref<HTMLOptionData[]>([])   /* Main - Chapter */
let dataSelectMainCurrStory = ref<{ id: string; name: NexonL10nData; desc: NexonL10nData; }[]>([])       /* 用于最终显示故事 */
let dataSelectMainCurrLoaded = ref(false)
/* <select> SELECTION */
const selectEventName = ref('')
const selectBondChar = ref('')
const selectMainVolume = ref('')
const selectMainChapter = ref('')

/* REMOTE DATA */
let dataI18nStoryXxhashToL10n: I18nStoryXxhashToL10nData = {} as I18nStoryXxhashToL10nData
let dataEventI18nKeyToXxhash: I18nStoryInfoIdToXxhash = {} as I18nStoryInfoIdToXxhash
let dataEventIndexManifest: IndexManifestScenarioEntry[] = [] as IndexManifestScenarioEntry[]
let dataEventScenarioIdToI18nKey: IndexScenarioInfoToI18nId = {} as IndexScenarioInfoToI18nId
let dataBondStudentName: StudentInfoDataSimple = {} as StudentInfoDataSimple
let dataBondIndexMomotalkScenario: IndexMomotalkData = {} as IndexMomotalkData
let dataBondScenarioI18n: I18nBondInfoData = {} as I18nBondInfoData
let dataMainIndexManifest: IndexManifestScenarioData = {} as IndexManifestScenarioData
let dataMainScenarioIdToI18nKey: IndexScenarioInfoToI18nId = {} as IndexScenarioInfoToI18nId
let dataMainI18nKeyToXxhash: I18nStoryInfoIdToXxhash = {} as I18nStoryInfoIdToXxhash
const dataAllLoaded = ref(false)

async function loadAllData() {
  await Promise.allSettled([
    httpGetJsonAsync(dataI18nStoryXxhashToL10n, `/data/story/i18n/i18n_story.json`),

    httpGetJsonAsync(dataEventI18nKeyToXxhash, `/data/story/i18n/i18n_event_index.json`),
    httpGetJsonAsync(dataEventIndexManifest, `/data/common/index_scenario_manifest_event.json`),
    httpGetJsonAsync(dataEventScenarioIdToI18nKey, `/data/common/index_scenario_i18n_event.json`),

    httpGetJsonAsync(dataBondStudentName, `/data/common/index_stu.json`),
    httpGetJsonAsync(dataBondIndexMomotalkScenario, `/data/common/index_momo.json`),
    httpGetJsonAsync(dataBondScenarioI18n, `/data/story/i18n/i18n_bond.json`),

    httpGetJsonAsync(dataMainIndexManifest, `/data/common/index_scenario_manifest_main.json`),
    httpGetJsonAsync(dataMainScenarioIdToI18nKey, `/data/common/index_scenario_i18n_main.json`),
    httpGetJsonAsync(dataMainI18nKeyToXxhash, `/data/story/i18n/i18n_main_index.json`)
  ])
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
      'j_ja': warnText, 'j_ko': warnText,
      'g_ja': warnText, 'g_ko': warnText, 'g_tw': warnText, 'g_tw_cn': warnText, 'g_th': warnText, 'g_en': warnText,
      'c_cn': warnText, 'c_cn_tw': warnText
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
      'value': key,
      'label': label
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
          'id': storyId,
          'data': data3[String(storyId)]
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
  for (const entry of data) {
    temp.push({
      'label': `${entry.id}: ${getNexonL10nDataFlattened(dataI18nStoryXxhashToL10n[String(dataI18nEvent[entry.name])], i18nLangAll.value, '/')}`,
      'value': String(entry.id)
    })
  }
  dataSelectEventIndex.value = temp

  // event story
  const data2 = dataEventScenarioIdToI18nKey
  let temp2 = new Map<string, { id: string; name: NexonL10nData; desc: NexonL10nData; }[]>()
  for (const entry of data) {
    const temp3 = []

    for (const idx2 in entry['data']) {
      const storyId = entry['data'][idx2]
      temp3.push({
        'id': String(storyId),
        'name': dataI18nStoryXxhashToL10n[
          dataI18nEvent[
            data2[String(storyId)][0]
            ]
          ],
        'desc': dataI18nStoryXxhashToL10n[
          dataI18nEvent[
            data2[String(storyId)][1]
            ]
          ]
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
      'label': `${Number(idx) + 1}: ${getNexonL10nDataFlattened(dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[entry.name]], i18nLangAll.value, '/')}`,
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
      'label': `${Number(idx) + 1}: ${getNexonL10nDataFlattened(dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[entry.name]], i18nLangAll.value, '/')}`,
      value: String(idx)
    })
  }
  dataSelectMainCurrIndex2.value = temp
  //console.log(temp)

  dataSelectMainCurrLoaded.value = true
}

/* 载入主线故事Scenario部分 */
function loadMainMainDataStory() {
  const data = dataMainIndexManifest['main'][Number(selectMainVolume.value)]
    ['data'][Number(selectMainChapter.value)]['data']
  let temp = []
  for (const storyId of data) {
    const entryI18n = dataMainScenarioIdToI18nKey[String(storyId)]
    temp.push({
      'id': String(storyId),
      'name': queryDamnI18nStoryData(String(dataMainI18nKeyToXxhash[String(entryI18n[0])])),
      'desc': queryDamnI18nStoryData(String(dataMainI18nKeyToXxhash[String(entryI18n[1])]))
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
  const data: IndexManifestScenarioChildEntry[] = dataMainIndexManifest[selectType.value as optionsStoryTypeMain] as IndexManifestScenarioChildEntry[]
  let temp = []
  for (const idx in data) {
    const entry = data[idx]
    temp.push({
      'label': `${Number(idx) + 1}: ${getNexonL10nDataFlattened(dataI18nStoryXxhashToL10n[dataMainI18nKeyToXxhash[entry.name]], i18nLangAll.value, '/')}`,
      'value': String(idx)
    })
  }
  dataSelectMainCurrIndex2.value = temp

  dataSelectMainCurrLoaded.value = true
}

function loadMainOtherDataStory() {
  const data = dataMainIndexManifest[selectType.value as optionsStoryTypeMain][Number(selectMainChapter.value)]['data']
  let temp = []
  for (const idx in data) {
    const storyId = data[idx]
    const entryI18n = dataMainScenarioIdToI18nKey[String(storyId)]
    temp.push({
      'id': String(storyId),
      'name': queryDamnI18nStoryData(String(dataMainI18nKeyToXxhash[entryI18n[0]])),
      'desc': queryDamnI18nStoryData(String(dataMainI18nKeyToXxhash[entryI18n[1]]))
    })
  }
  dataSelectMainCurrStory.value = temp
  console.log(temp)

  dataSelectMainCurrLoaded.value = true
}

// <select> value
watch(
  () => selectType.value,
  (newValue) => {
    if (newValue === 'event') {
      loadEventData()
    } else if (newValue === 'bond') {
      loadBondData()
    } else {
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
    console.log(newValue)

    dataSelectMainCurrLoaded.value = false
    if (newValue !== '') {
      if (selectType.value === 'main') loadMainMainDataStory()
      else {
        loadMainOtherDataStory()
        cacheRecoveryMultiStage.value = false
      }
    } else {
      dataSelectMainCurrStory.value = []
    }
    dataSelectMainCurrLoaded.value = true
  }
)

/* 搜索内容缓存 (instance 级) */
onMounted(async () => {
  await loadAllData()

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
  () => [selectType.value, selectEventName.value, selectBondChar.value, selectMainVolume.value, selectMainChapter.value],
  () => {
    searchCache.setNormalSearchVars(selectType.value, selectEventName.value, selectBondChar.value,
      selectMainVolume.value, selectMainChapter.value)
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
        <PvSelect v-model="selectType" size="small"
                  placeholder="Select"
                  class="search-select-pv-select"

                  :options="optionsType"
                  :optionLabel="i => i18n.t('comp-search-scenario-option-' + i.value)"
                  optionValue="value" />
      </PvFluid>
      <div class="pv-fluid-spacing" v-show="selectType !== ''"></div>
      <PvFluid class="pv-fluid" v-if="selectType === 'event'">
        <span class="search-select-span-label">{{ $t('comp-search-scenario-select-2') }}</span>
        <PvSelect v-model="selectEventName" size="small" filter
                  placeholder="Select"
                  class="search-select-pv-select"

                  :options="dataSelectEventIndex"
                  optionLabel="label"
                  optionValue="value"
        />
      </PvFluid>
      <PvFluid class="pv-fluid" v-else-if="selectType === 'bond'">
        <span class="search-select-span-label">{{ $t('comp-search-scenario-select-3') }}</span>
        <PvSelect v-model="selectBondChar" size="small" filter
                  placeholder="Select"
                  class="search-select-pv-select"

                  :options="dataSelectCharIndex"
                  optionLabel="label"
                  optionValue="value" />
      </PvFluid>
      <template v-else-if="selectType === 'main'">
        <PvFluid class="pv-fluid">
          <span class="search-select-span-label">{{ $t('comp-search-scenario-select-4') }}</span>
          <PvSelect v-model="selectMainVolume" size="small" filter
                    placeholder="Select"
                    class="search-select-pv-select"

                    :options="dataSelectMainCurrIndex1"
                    optionLabel="label"
                    optionValue="value" />
        </PvFluid>
        <div class="pv-fluid-spacing" v-show="selectType === 'main'"></div>
        <PvFluid class="pv-fluid">
          <span class="search-select-span-label">{{ $t('comp-search-scenario-select-5') }}</span>
          <PvSelect v-model="selectMainChapter" size="small" filter
                    placeholder="Select"
                    class="search-select-pv-select"

                    :options="dataSelectMainCurrIndex2"
                    optionLabel="label"
                    optionValue="value" />
        </PvFluid>
      </template>
      <PvFluid class="pv-fluid" v-else-if="selectType !== ''">
        <span class="search-select-span-label">{{ $t('comp-search-scenario-select-6') }}</span>
        <PvSelect v-model="selectMainChapter" size="small" filter
                  placeholder="Select"
                  class="search-select-pv-select"

                  :options="dataSelectMainCurrIndex2"
                  optionLabel="label"
                  optionValue="value" />
      </PvFluid>
    </div>

    <PvDivider />

    <!-- 显示结果 -->
    <div v-if="selectType === 'event'">
      <div v-loading="!dataSelectEventLoaded" :key="uiLang">
        <h2>{{ $t('comp-search-scenario-result') }}</h2>
        <div :key="uiLang + '_' + selectEventName" class="search-event">
          <ScenarioSearchEntryEvent :data_no="idx + 1" :data="entry"
                                    v-for="(entry, idx) in dataSelectEventStory.get(selectEventName)" :key="idx" />
        </div>
      </div>
    </div>
    <div v-else-if="selectType === 'bond'">
      <div v-loading="!dataSelectBondLoaded" :key="uiLang">
        <h2>{{ $t('comp-search-scenario-select-result') }}</h2>
        <p v-if="selectBondChar">
          <img :src="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${selectBondChar}.webp`">
        </p>
        <div :key="uiLang + '_' + selectBondChar">
          <ScenarioSearchEntryBond :char_id="selectBondChar" :data_no="idx + 1" :data="entry"
                                   v-for="(entry, idx) in dataSelectMmt.get(selectBondChar)" :key="idx" />
        </div>
      </div>
    </div>
    <div v-else-if="selectType === 'main'">
      <div v-loading="!dataSelectMainCurrLoaded" :key="uiLang">
        <h2>{{ $t('comp-search-scenario-select-result') }}</h2>
        <div :key="uiLang + '_' + selectBondChar">
          <ScenarioSearchEntryEvent :char_id="selectBondChar" :data_no="idx + 1" :data="entry"
                                    v-for="(entry, idx) in dataSelectMainCurrStory" :key="idx" />
        </div>
      </div>
    </div>
    <div v-else-if="selectType !== ''">
      <div v-loading="!dataSelectMainCurrLoaded" :key="uiLang">
        <h2>{{ $t('comp-search-scenario-select-result') }}</h2>
        <div :key="uiLang + '_' + selectBondChar">
          <ScenarioSearchEntryEvent :char_id="selectBondChar" :data_no="idx + 1" :data="entry"
                                    v-for="(entry, idx) in dataSelectMainCurrStory" :key="idx" />
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