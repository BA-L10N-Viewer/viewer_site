<script setup lang="ts">
import { onMounted, provide, watch, ref, onBeforeMount, type Ref, shallowRef } from 'vue'
import { useSetting } from '@/stores/setting'
import CharVoiceNexonUi from '@/components/voice/CharVoiceNexonUi.vue'
import CharVoiceSchaleDbUi from '@/components/voice/CharVoiceSchaleDbUi.vue'
import { useI18n } from 'vue-i18n'
import type { NexonCharVoiceEntry } from '@/types/OutsourcedDataVoice'
import {
  type NexonL10nDataLangOfUi,
  type SchaleDbStuInfoFull,
  type SchaleDbStuInfoFullVoiceline, SchaleDbStuInfoFullVoicelineCategory
} from '@/types/OutsourcedData'
import { httpGetAsync, httpGetJsonAsync } from '@/tool/HttpRequest'
import {
  symbolDataCharVoiceI18n
} from '@/types/CharVoiceComp'
import {
  clearNexonCharVoiceBattleMtData, clearNexonCharVoiceEventMtData,
  clearNexonCharVoiceNormalMtData, clearSchaleDbVoiceCategoryMtData,
  initNexonCharVoiceBattleMtData,
  initNexonCharVoiceEventMtData,
  initNexonCharVoiceNormalMtData,
  initSchaleDbVoiceCategoryMtData,
  type NexonCharVoiceMtData,
  type SchaleDbStuVoicelineMtData,
  updateNexonCharVoiceBattleMtData,
  updateNexonCharVoiceEventMtData,
  updateNexonCharVoiceNormalMtData, updateSchaleDbVoiceCategoryMtData
} from '@/tool/CharVoiceMt'
import { mtI18nLangStats } from '@/tool/ConstantComputed'
import { mtPiniaWatchCallback } from '@/tool/translate/MtUtils'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import type { MtServiceName } from '@/tool/translate/MtDispatcher'
import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import { SiteUiLang } from '@/tool/Constant'
import { createDictionaryWithDefault } from '@/tool/Tool'

import PvTabs from 'primevue/tabs'
import PvTabList from 'primevue/tablist'
import PvTab from 'primevue/tab'
import PvTabPanels from 'primevue/tabpanels'
import PvTabPanel from 'primevue/tabpanel'
import PvDivider from 'primevue/divider'

const props = defineProps(
  {
    charId: {
      type: [Number, String],
      required: true
    }
  }
)

const setting = useSetting()
const i18n = useI18n()

const isLoading = ref(true)

let dataVoiceNexon: NexonCharVoiceEntry = {} as unknown as NexonCharVoiceEntry
let dataVoiceSdb: SchaleDbStuInfoFullVoiceline = {} as unknown as SchaleDbStuInfoFullVoiceline
let dataVoiceI18n: Record<SiteUiLang, {}> = createDictionaryWithDefault(SiteUiLang, {})
const dataVoiceI18nCurr = shallowRef<{ [key: string]: string }>({})

// --------------------- MT AUTO TRANSLATE ---------------------
const mtController = {
  pinia: useI18nTlControl(),
  inProgress: ref(false)
}

let dataMtVoiceNexon: Ref<NexonCharVoiceMtData> = ref({} as unknown as NexonCharVoiceMtData)
let dataMtVoiceSdb: Ref<SchaleDbStuVoicelineMtData> = ref({} as unknown as SchaleDbStuVoicelineMtData)

function clearMlTranslation(lang: NexonL10nDataLangOfUi) {
  // Nexon
  clearNexonCharVoiceNormalMtData(dataMtVoiceNexon.value.Normal, lang)
  clearNexonCharVoiceNormalMtData(dataMtVoiceNexon.value.Lobby, lang)
  clearNexonCharVoiceBattleMtData(dataMtVoiceNexon.value.Battle, lang)
  clearNexonCharVoiceEventMtData(dataMtVoiceNexon.value.Event, lang)
  // SchaleDB (Sdb)
  for (const category of SchaleDbStuInfoFullVoicelineCategory) {
    clearSchaleDbVoiceCategoryMtData(dataMtVoiceSdb.value[category], lang)
  }
}

async function updateMlTranslation(baselang: NexonL10nDataLangOfUi) {
  mtController.inProgress.value = true
  clearMlTranslation(baselang)

  const asyncPool = new AsyncTaskPool(8)

  // Nexon
  updateNexonCharVoiceNormalMtData(dataVoiceNexon.Normal, dataMtVoiceNexon.value.Normal,
    baselang, setting.auto_i18n_service as MtServiceName, setting.auto_i18n_lang, asyncPool)
  updateNexonCharVoiceNormalMtData(dataVoiceNexon.Lobby || [], dataMtVoiceNexon.value.Lobby,
    baselang, setting.auto_i18n_service as MtServiceName, setting.auto_i18n_lang, asyncPool)
  updateNexonCharVoiceBattleMtData(dataVoiceNexon.Battle || [], dataMtVoiceNexon.value.Battle,
    baselang, setting.auto_i18n_service as MtServiceName, setting.auto_i18n_lang, asyncPool)
  updateNexonCharVoiceEventMtData(dataVoiceNexon.Event || [], dataMtVoiceNexon.value.Event,
    baselang, setting.auto_i18n_service as MtServiceName, setting.auto_i18n_lang, asyncPool)
  // SchaleDB (Sdb)
  for (const category of SchaleDbStuInfoFullVoicelineCategory) {
    updateSchaleDbVoiceCategoryMtData(dataVoiceSdb[category], dataMtVoiceSdb.value[category],
      baselang, setting.auto_i18n_service as MtServiceName, setting.auto_i18n_lang, asyncPool)
  }

  await asyncPool.runAll(mtController.pinia.updateProgress)
  mtController.inProgress.value = false
}

watch(
  mtI18nLangStats,
  async (newValue) => {
    await mtPiniaWatchCallback(newValue, updateMlTranslation, clearMlTranslation, mtController.pinia.setStatusToComplete)
  }
)

watch(
  () => setting.ui_lang,
  (newValue) => {
    dataVoiceI18nCurr.value = dataVoiceI18n[newValue]
  }
)

// -------------------------------------------------------------

async function loadAll() {
  let dataCharSdb: SchaleDbStuInfoFull = {} as unknown as SchaleDbStuInfoFull
  await Promise.allSettled([
    httpGetJsonAsync(dataVoiceNexon, `/data/common/voice/${props.charId}.json`),
    (async function(): Promise<void> {
      const rawText = await httpGetAsync(`/data/common/schale_stu/${props.charId}.json`)
      if (rawText !== '') {
        try {
          Object.assign(dataCharSdb,JSON.parse(rawText))
        } catch (e) {
          Object.assign(dataCharSdb, {
            Voicelines: {
              Normal: [],
              Lobby: [],
              Battle: [],
              Event: []
            }
          } as unknown as SchaleDbStuInfoFull)
        }
      } else
        Object.assign(dataCharSdb, {
          Voicelines: {
            Normal: [],
            Lobby: [],
            Battle: [],
            Event: []
          }
        } as unknown as SchaleDbStuInfoFull)
    })(),
    //httpGetJsonAsync(dataCharSdb, `/data/common/schale_stu/${props.charId}.json`),
    ...SiteUiLang.map(lang => httpGetJsonAsync(dataVoiceI18n[lang], `/data/common/i18n/voice_group.${lang}.json`))
  ])
  dataVoiceSdb = dataCharSdb.Voicelines

  dataMtVoiceNexon.value = {
    Normal: initNexonCharVoiceNormalMtData(dataVoiceNexon.Normal || []),
    Lobby: initNexonCharVoiceNormalMtData(dataVoiceNexon.Lobby || []),
    Battle: initNexonCharVoiceBattleMtData(dataVoiceNexon.Battle || []),
    Event: initNexonCharVoiceEventMtData(dataVoiceNexon.Event || [])
  }
  dataMtVoiceSdb.value = {
    Normal: initSchaleDbVoiceCategoryMtData(dataVoiceSdb.Normal || []),
    Lobby: initSchaleDbVoiceCategoryMtData(dataVoiceSdb.Lobby || []),
    Battle: initSchaleDbVoiceCategoryMtData(dataVoiceSdb.Battle || []),
    Event: initSchaleDbVoiceCategoryMtData(dataVoiceSdb.Event || [])
  }

  dataVoiceI18nCurr.value = dataVoiceI18n[setting.ui_lang]
}

provide(symbolDataCharVoiceI18n, dataVoiceI18nCurr)

onBeforeMount(async function() {
  await loadAll()

  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-if="!isLoading">
    <p>{{ charId }}</p>
    <div class="char-voice-ui-div">
      <PvDivider />
      <KeepAlive>
        <PvTabs :value="setting.char_voice_data_source" style="border: 1px var(--pv-tabs-tablist-border-color) solid">
          <PvTabList>
            <PvTab value="nexon">{{ i18n.t('char-voice-ui-select-source-nexon') }}</PvTab>
            <PvTab value="schaledb">{{ i18n.t('char-voice-ui-select-source-schaledb') }}</PvTab>
          </PvTabList>
          <PvTabPanels>
            <PvTabPanel value="nexon">
              <component :is="CharVoiceNexonUi" :dataVoice="dataVoiceNexon" :dataVoiceMt="dataMtVoiceNexon" />
            </PvTabPanel>
            <PvTabPanel value="schaledb">
              <component :is="CharVoiceSchaleDbUi" :dataVoice="dataVoiceSdb" :dataVoiceMt="dataMtVoiceSdb" />
            </PvTabPanel>
          </PvTabPanels>
        </PvTabs>
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>

</style>