<script setup lang="ts">
import { onMounted, provide, watch, ref, onBeforeMount } from 'vue'
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
import { httpGetJsonAsync } from '@/tool/HttpRequest'
import {
  symbolDataCharVoiceI18n,
  symbolDataCharVoiceNexon,
  symbolDataCharVoiceSdb,
  symbolMtDataCharVoiceNexon,
  symbolMtDataCharVoiceSdb
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
const dataVoiceI18nCurr = ref<{ [key: string]: string }>({})

// --------------------- MT AUTO TRANSLATE ---------------------
const mtController = {
  pinia: useI18nTlControl(),
  inProgress: ref(false)
}

let dataMtVoiceNexon: NexonCharVoiceMtData = ref({} as unknown as NexonCharVoiceMtData)
let dataMtVoiceSdb: SchaleDbStuVoicelineMtData = ref({} as unknown as SchaleDbStuVoicelineMtData)

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

  await asyncPool.runAll()
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
  },
  {immediate: true}
)

// -------------------------------------------------------------

async function loadAll() {
  let dataCharSdb: SchaleDbStuInfoFull = {} as unknown as SchaleDbStuInfoFull
  await Promise.allSettled([
    httpGetJsonAsync(dataVoiceNexon, `/data/common/voice/${props.charId}.json`),
    httpGetJsonAsync(dataCharSdb, `/data/common/schale_stu/${props.charId}.json`),
    ...SiteUiLang.map(lang => httpGetJsonAsync(dataVoiceI18n[lang], `/data/common/i18n/voice_group.${lang}.json`))
  ])
  dataVoiceSdb = dataCharSdb.Voicelines

  dataMtVoiceNexon.value = {
    Normal: initNexonCharVoiceNormalMtData(dataVoiceNexon.Normal),
    Lobby: initNexonCharVoiceNormalMtData(dataVoiceNexon.Lobby || []),
    Battle: initNexonCharVoiceBattleMtData(dataVoiceNexon.Battle || []),
    Event: initNexonCharVoiceEventMtData(dataVoiceNexon.Event || [])
  }
  dataMtVoiceSdb.value = {
    Normal: initSchaleDbVoiceCategoryMtData(dataVoiceSdb.Normal),
    Lobby: initSchaleDbVoiceCategoryMtData(dataVoiceSdb.Lobby),
    Battle: initSchaleDbVoiceCategoryMtData(dataVoiceSdb.Battle),
    Event: initSchaleDbVoiceCategoryMtData(dataVoiceSdb.Event)
  }
}

provide(symbolDataCharVoiceNexon, dataVoiceNexon)
provide(symbolDataCharVoiceSdb, dataVoiceSdb)
provide(symbolMtDataCharVoiceNexon, dataMtVoiceNexon)
provide(symbolMtDataCharVoiceSdb, dataMtVoiceSdb)
provide(symbolDataCharVoiceI18n, dataVoiceI18nCurr.value)

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
    <h2>{{ $t('Character Voice UI') }}</h2>
    <div class="char-voice-ui-div">
      <el-divider />
      <KeepAlive>
        <el-tabs
          v-model="setting.char_voice_data_source"
          type="border-card"
          class="demo-tabs"
        >
          <el-tab-pane :label="i18n.t('char-voice-ui-select-source-nexon')" name="nexon">
            <component :is="CharVoiceNexonUi" :char-id="charId" />
          </el-tab-pane>
          <el-tab-pane :label="i18n.t('char-voice-ui-select-source-schaledb')" name="schaledb">
            <component :is="CharVoiceSchaleDbUi" :char-id="charId" />
          </el-tab-pane>
        </el-tabs>
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>

</style>