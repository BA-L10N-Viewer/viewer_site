<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { httpGetBlocking } from '@/tool/HttpRequest'
import { useSetting } from '@/stores/setting'
import ScenarioSearchEntryBond from '@/components/search/ScenarioSearchEntryBond.vue'
import { getLangDataFlattened } from '@/tool/StoryTool'
import { i18nLangAll } from '@/tool/ConstantComputed'
import ScenarioSearchEntryEvent from '@/components/search/ScenarioSearchEntryEvent.vue'
import { useI18n } from 'vue-i18n'
import type {
  I18nBondInfoData,
  I18nBondInfoDataEntry,
  I18nStoryInfoIdToXxhash, I18nStoryXxhashToL10nData,
  IndexManifestScenarioEntry, IndexManifestScenarioParentEntry,
  IndexManifestScnearioData,
  IndexMomotalkData,
  IndexScenarioInfoToI18nId,
  NexonL10nData,
  StudentInfoDataSimple
} from '@/types/OutsourcedData'
import type { HTMLOptionData } from '@/types/CommonType'
import { useSearchVars } from '@/stores/search'

const selectType = ref('')
const i18n = useI18n()

/* DATA */
// general
const dataI18nStory: I18nStoryXxhashToL10nData = JSON.parse(httpGetBlocking('/data/story/i18n/i18n_story.json'))
// for event
let dataSelectEventIndex = ref<HTMLOptionData[]>([])
let dataSelectEventStory = new Map<string, { id: string; name: NexonL10nData; desc: NexonL10nData; }[]>()
let dataI18nEvent: I18nStoryInfoIdToXxhash = null as unknown as I18nStoryInfoIdToXxhash
let dataSelectEventLoaded = ref(false)
// for bond
let dataSelectCharIndex = ref<HTMLOptionData[]>([])
let dataSelectMmt = new Map<string, { id: number; data: I18nBondInfoDataEntry }[]>()
let dataSelectBondLoaded = ref(false)
// for other
let dataStoryMainIndex: IndexManifestScnearioData = {} as IndexManifestScnearioData      /* index_scenario_manifest_main.json */
let dataStoryMainStoryI18n: IndexScenarioInfoToI18nId = {} as IndexScenarioInfoToI18nId  /* index_scenario_i18n_main.json */
let dataI18nMain: I18nStoryInfoIdToXxhash = {} as I18nStoryInfoIdToXxhash
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
  const temp = dataI18nStory[key]
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
  let data: StudentInfoDataSimple = JSON.parse(httpGetBlocking('/data/common/index_stu.json'))
  let temp = []
  for (const [key, value] of Object.entries(data)) {
    let label = `${key}: ${getLangDataFlattened(value.Name, i18nLangAll.value, '/')}`
    temp.push({
      'value': key,
      'label': label
    })
  }
  dataSelectCharIndex.value = temp

  // MMT data
  let data2: IndexMomotalkData = JSON.parse(httpGetBlocking('/data/common/index_momo.json'))
  let data3: I18nBondInfoData = JSON.parse(httpGetBlocking('/data/story/i18n/i18n_bond.json'))
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
  dataI18nEvent = JSON.parse(httpGetBlocking('/data/story/i18n/i18n_event_index.json')) as I18nStoryInfoIdToXxhash

  // event index
  const data: IndexManifestScenarioEntry[] = JSON.parse(httpGetBlocking('/data/common/index_scenario_manifest_event.json'))
  let temp = []
  for (const entry of data) {
    temp.push({
      'label': `${entry.id}: ${getLangDataFlattened(dataI18nStory[String(dataI18nEvent[entry.name])], i18nLangAll.value, '/')}`,
      'value': String(entry.id)
    })
  }
  dataSelectEventIndex.value = temp

  // event story
  const data2: IndexScenarioInfoToI18nId = JSON.parse(httpGetBlocking('/data/common/index_scenario_i18n_event.json'))
  let temp2 = new Map<string, { id: string; name: NexonL10nData; desc: NexonL10nData; }[]>()
  for (const entry of data) {
    const temp3 = []

    for (const idx2 in entry['data']) {
      const storyId = entry['data'][idx2]
      temp3.push({
        'id': String(storyId),
        'name': dataI18nStory[
          dataI18nEvent[
            data2[String(storyId)][0]
            ]
          ],
        'desc': dataI18nStory[
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

function initMainData() {
  if (!dataStoryMainLoaded.value) {
    dataStoryMainIndex = JSON.parse(httpGetBlocking('/data/common/index_scenario_manifest_main.json'))
    dataStoryMainStoryI18n = JSON.parse(httpGetBlocking('/data/common/index_scenario_i18n_main.json'))
    dataI18nMain = JSON.parse(httpGetBlocking('/data/story/i18n/i18n_main_index.json'))
  }
}

function clearMainData() {
  dataSelectMainCurrIndex1.value = []
  dataSelectMainCurrIndex2.value = []
  selectMainVolume.value = ''
  selectMainChapter.value = ''
  dataSelectMainCurrLoaded.value = false
}

function loadMainMainData1() {
  clearMainData()

  // get data
  const data = dataStoryMainIndex['main']
  let temp = []
  for (const entry of data) {
    const idx = entry['id']
    temp.push({
      'label': `${Number(idx) + 1}: ${getLangDataFlattened(dataI18nStory[dataI18nMain[entry.name]],
        i18nLangAll.value, '/')}`,
      value: String(idx)
    })
  }
  dataSelectMainCurrIndex1.value = temp

  dataSelectMainCurrLoaded.value = true
}

function loadMainMainData2() {
  // get data
  const data = dataStoryMainIndex['main'][Number(selectMainVolume.value)]['data']
  let temp = []
  for (const idx in data) {
    const entry = data[idx]
    temp.push({
      'label': `${Number(idx) + 1}: ${getLangDataFlattened(dataI18nStory[dataI18nMain[entry.name]],
        i18nLangAll.value, '/')}`,
      value: String(idx)
    })
  }
  dataSelectMainCurrIndex2.value = temp
  //console.log(temp)

  dataSelectMainCurrLoaded.value = true
}

function loadMainMainDataStory() {
  const data = dataStoryMainIndex['main'][Number(selectMainVolume.value)]
    ['data'][Number(selectMainChapter.value)]['data']
  let temp = []
  for (const storyId of data) {
    const entryI18n = dataStoryMainStoryI18n[String(storyId)]
    temp.push({
      'id': String(storyId),
      'name': queryDamnI18nStoryData(String(dataI18nMain[String(entryI18n[0])])),
      'desc': queryDamnI18nStoryData(String(dataI18nMain[String(entryI18n[1])]))
    })
  }
  dataSelectMainCurrStory.value = temp

  dataSelectMainCurrLoaded.value = true
}

function loadMainOtherData() {
  clearMainData()

  // get data
  const data: IndexManifestScenarioParentEntry[] = dataStoryMainIndex[selectType.value as optionsStoryTypeMain]
  let temp = []
  for (const idx in data) {
    const entry = data[idx]
    temp.push({
      'label': `${Number(idx) + 1}: ${getLangDataFlattened(dataI18nStory[dataI18nMain[entry.name]],
        i18nLangAll.value, '/')}`,
      'value': String(idx)
    })
  }
  dataSelectMainCurrIndex2.value = temp

  dataSelectMainCurrLoaded.value = true
}

function loadMainOtherDataStory() {
  const data = dataStoryMainIndex[selectType.value as optionsStoryTypeMain][Number(selectMainChapter.value)]['data']
  let temp = []
  for (const idx in data) {
    const storyId = data[idx]
    const entryI18n = dataStoryMainStoryI18n[String(storyId)]
    temp.push({
      'id': String(storyId),
      'name': queryDamnI18nStoryData(String(dataI18nMain[entryI18n[0]])),
      'desc': queryDamnI18nStoryData(String(dataI18nMain[entryI18n[1]]))
    })
  }
  dataSelectMainCurrStory.value = temp

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
      initMainData()
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
    selectMainChapter.value = ''
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
    dataSelectMainCurrLoaded.value = false
    if (newValue !== '') {
      if (selectType.value === 'main') loadMainMainDataStory()
      else loadMainOtherDataStory()
    } else {
      dataSelectMainCurrStory.value = []
    }
    dataSelectMainCurrLoaded.value = true
  }
)

/* 搜索内容缓存 (instance 级) */
onMounted(() => {
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
  <p>{{ $t('comp-search-scenario-select-1') }}&nbsp;
    <client-only>
      <el-select v-model="selectType"
                 placeholder="Select" style="width: 240px">
        <el-option
          v-for="item in optionsType"
          :key="item.value"
          :label="$t('comp-search-scenario-option-' + item.value)"
          :value="item.value"
          :disabled="item.disabled ? item.disabled : false"
        />
      </el-select>
    </client-only>
  </p>
  <div v-if="selectType === 'event'">
    <div v-loading="!dataSelectEventLoaded" :key="uiLang">
      <p>{{ $t('comp-search-scenario-select-2') }}
        <client-only>
          <el-select v-model="selectEventName" filterable
                     placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in dataSelectEventIndex"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </client-only>
      </p>
      <el-divider></el-divider>
      <h2>{{ $t('comp-search-scenario-result') }}</h2>
      <div :key="uiLang + '_' + selectEventName" class="search-event">
        <ScenarioSearchEntryEvent :data_no="idx + 1" :data="entry"
                                  v-for="(entry, idx) in dataSelectEventStory.get(selectEventName)" :key="idx" />
      </div>
    </div>
  </div>
  <div v-else-if="selectType === 'bond'">
    <p v-html="i18n.t('comp-search-scenario-bond-p')"></p>
    <div v-loading="!dataSelectBondLoaded" :key="uiLang">
      <p>{{ $t('comp-search-scenario-select-3') }}
        <client-only>
          <el-select v-model="selectBondChar" filterable
                     placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in dataSelectCharIndex"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </client-only>
      </p>
      <el-divider></el-divider>
      <h2>{{ $t('comp-search-scenario-select-result') }}</h2>
      <p v-if="selectBondChar"><img :src="`https://schale.gg/images/student/collection/${selectBondChar}.webp`"></p>
      <div :key="uiLang + '_' + selectBondChar">
        <ScenarioSearchEntryBond :char_id="selectBondChar" :data_no="idx + 1" :data="entry"
                                 v-for="(entry, idx) in dataSelectMmt.get(selectBondChar)" :key="idx" />
      </div>
    </div>
  </div>
  <div v-else-if="selectType === 'main'">
    <div v-loading="!dataSelectMainCurrLoaded" :key="uiLang">
      <p>{{ $t('comp-search-scenario-select-4') }}
        <client-only>
          <el-select v-model="selectMainVolume" filterable
                     placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in dataSelectMainCurrIndex1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </client-only>
      </p>
      <p>{{ $t('comp-search-scenario-select-5') }}
        <client-only>
          <el-select v-model="selectMainChapter" filterable
                     placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in dataSelectMainCurrIndex2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </client-only>
      </p>
      <el-divider></el-divider>
      <h2>{{ $t('comp-search-scenario-select-result') }}</h2>
      <div :key="uiLang + '_' + selectBondChar">
        <ScenarioSearchEntryEvent :char_id="selectBondChar" :data_no="idx + 1" :data="entry"
                                  v-for="(entry, idx) in dataSelectMainCurrStory" :key="idx" />
      </div>
    </div>
  </div>
  <div v-else-if="selectType !== ''">
    <div v-loading="!dataSelectMainCurrLoaded" :key="uiLang">
      <p>{{ $t('comp-search-scenario-select-6') }}
        <client-only>
          <el-select v-model="selectMainChapter" filterable
                     placeholder="Select" style="width: 240px">
            <el-option
              v-for="item in dataSelectMainCurrIndex2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </client-only>
      </p>
      <el-divider></el-divider>
      <h2>{{ $t('comp-search-scenario-select-result') }}</h2>
      <div :key="uiLang + '_' + selectBondChar">
        <ScenarioSearchEntryEvent :char_id="selectBondChar" :data_no="idx + 1" :data="entry"
                                  v-for="(entry, idx) in dataSelectMainCurrStory" :key="idx" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-event {
  max-width: max(1200px, 80%);
}

@media screen and (max-width: 700px) {
  .search-event {
    max-width: 100%;
  }
}
</style>