<script setup lang="ts">
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { onMounted, provide, type Ref, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { httpGetAsync } from '@/tool/HttpRequest'
import MomotalkHeader from '@/components/momotalk/MomotalkHeader.vue'
import MomotalkUi from '@/components/MomotalkUi.vue'
import type {
  I18nBondInfoData,
  MomotalkStoryData, NexonL10nDataLang,
  SchaleDbL10nData,
  StudentInfoDataSimple
} from '@/types/OutsourcedData'
import { NexonL10nDataLang as NexonL10nDataLangConst } from '@/types/OutsourcedData'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import { useSetting } from '@/stores/setting'
import { mtI18nLangStats } from '@/tool/ConstantComputed'
import type { MlForMomotalk } from '@/types/MachineTranslation'
import { getDialogueMtTranslation, type MtServiceName } from '@/tool/translate/MtDispatcher'
import { mtPiniaWatchCallback } from '@/tool/translate/MtUtils'

import PvButton from 'primevue/button'
import PvDialog from 'primevue/dialog'
import PvDivider from 'primevue/divider'
import PvAccordion from 'primevue/accordion'
import PvAccordionPanel from 'primevue/accordionpanel'
import PvAccordionHeader from 'primevue/accordionheader'
import PvAccordionContent from 'primevue/accordioncontent'

const showI18nSettingDialog = ref(false)
const route = useRoute()
const setting = useSetting()

const props = defineProps({
  charId: Number
})

// ---------------------------------------
const isLoading = ref(true)
let mmtData: MomotalkStoryData = {} as unknown as MomotalkStoryData
let charData: StudentInfoDataSimple = {} as unknown as StudentInfoDataSimple
let mmtI18nData: I18nBondInfoData = {} as unknown as I18nBondInfoData
let charName: SchaleDbL10nData = {} as unknown as SchaleDbL10nData

async function loadRemoteResource() {
  mmtData = JSON.parse(await httpGetAsync(`/data/story/momotalk/${route.params.charId}.json`))
  charData = JSON.parse(await httpGetAsync(`/data/common/index_stu.json`))
  mmtI18nData = JSON.parse(await httpGetAsync(`/data/story/i18n/i18n_bond.json`))
  charName = charData[String(route.params.charId)]['Name']
}

const mmtStatus = ref<number[]>([])

// ------------------ ML SERVICE ---------------------
const ML_pinia = useI18nTlControl()
ML_pinia.initAll()

// 创建每一个mmt对话的对应表
const tableMlMmtData: Ref<MlForMomotalk> = ref([] as any)
const ML_in_progress = ref(false)

function clearMlTranslation(baselang: NexonL10nDataLang) {
  for (const [idx, mmtEntry] of mmtData.entries()) {
    // 初始化每一个mmt entry
    if (tableMlMmtData.value.length <= idx) {
      tableMlMmtData.value.push({
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

    // 初始化每一个mmt dialogue entry
    for (let idx2 = 0; idx2 < mmtEntry.Data.length; idx2++) {
      const blankMlData = { 'name': '', 'dialogue': '' }

      if (tableMlMmtData.value[idx][baselang].length <= idx2)
        tableMlMmtData.value[idx][baselang].push(blankMlData)
      else
        tableMlMmtData.value[idx][baselang][idx2] = blankMlData
    }
  }
}

async function updateMlTranslation(baselang: NexonL10nDataLang) {
  ML_in_progress.value = true
  clearMlTranslation(baselang)

  const asyncPool = new AsyncTaskPool(8)
  const actualMlLang = setting.auto_i18n_lang
  for (const [idx, mmtEntry] of mmtData.entries()) {
    const dialogues = mmtEntry.Data

    for (const [idx2, dialogueEntry] of dialogues.entries()) {
      asyncPool.addTask(
        async () => {
          tableMlMmtData.value[idx][baselang][idx2] = await getDialogueMtTranslation(
            setting.auto_i18n_service as MtServiceName,
            charName[baselang] || '',
            dialogueEntry.Message[baselang],
            actualMlLang
          )
        }
      )
    }
  }

  await asyncPool.runAll(ML_pinia.updateProgress)
  ML_in_progress.value = false
}

function initMlData() {
  for (const lang of NexonL10nDataLangConst)
    clearMlTranslation(lang)
  clearMlTranslation('null' as NexonL10nDataLang)
}

watch(
  mtI18nLangStats,
  async (newValue) => {
    await mtPiniaWatchCallback(newValue, updateMlTranslation, clearMlTranslation, ML_pinia.setStatusToComplete)
  }
)

provide('ML_clearAll', initMlData)
provide('ML_table', tableMlMmtData)
provide('ML_in_progress', ML_in_progress)

// ---------------------------------------------------

const urlHashStoryId = (() => {
  const urlHashMatch = window.location.hash.match(/#story-(\d+)/)
  let mmtNo: number

  if (urlHashMatch) {
    mmtNo = Number(urlHashMatch[1]) - 1
  } else {
    mmtNo = -1
  }

  return mmtNo
})()

function scrollToDesignatedElement(eleId: string) {
  const targetEle = document.getElementById(eleId)
  if (targetEle) {
    const targetHeightOffset = targetEle.getBoundingClientRect().y - 70
    window.scrollBy({
      left: 0, top: targetHeightOffset, behavior: 'smooth'
    })

    console.log(targetHeightOffset)
  }
}

async function scrollToMmtByUrlHashtag() {
  if (urlHashStoryId !== -1)
    mmtStatus.value.push(urlHashStoryId)

  // 等待Accordion显示
  await nextTick()
  await nextTick()

  scrollToDesignatedElement(`mmt-story-h2-title-${urlHashStoryId}`)
  console.log(`mmt-story-h2-title-${urlHashStoryId}`)
}

onMounted(async () => {
  await loadRemoteResource()
  initMlData()

  isLoading.value = false

  // 等待DOM更新
  await nextTick()
  scrollToMmtByUrlHashtag()
})
</script>


<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-if="!isLoading">
    <Teleport to="body">
      <div style="position: fixed; right: 5%; bottom: 10%;">
        <PvButton severity="secondary" rounded @click="showI18nSettingDialog = true">
          <span class="pi pi-globe" style="color: var(--color-ba-logo)" />
          <span>L10N</span>
        </PvButton>
      </div>

      <PvDialog v-model:visible="showI18nSettingDialog" modal :closable="true"
                :draggable="false" :dismissableMask="true"
                style="width: 90%">
        <StoryI18nSetting />
      </PvDialog>
    </Teleport>

    <h1 class="view-h1">{{ $t('view-mmt-h1') }}</h1>
    <p>{{ $t('view-mmt-stu-id-p') }}{{ $route.params.charId }}</p>
    <PvDivider />

    <PvAccordion :value="mmtStatus" multiple>
      <PvAccordionPanel v-for="(data, index) in mmtData" :key="index" :value="index">
        <PvAccordionHeader :id="`mmt-story-h2-title-${index}`">
          <div style="text-align: left; color: black; font-size: 1.2em;">
            <MomotalkHeader :data_no="index" :data_mmtid="data.BondScenarioId"
                            :data_l10n="mmtI18nData[data.BondScenarioId][0]" />
            <span>&nbsp;&nbsp;</span>
          </div>
        </PvAccordionHeader>
        <PvAccordionContent>
          <div style="color: black">
            <MomotalkUi :data_charname="charName" :data_data="data" :mmt_entry_pos="index" />
          </div>
        </PvAccordionContent>
      </PvAccordionPanel>
    </PvAccordion>
  </div>
</template>

<style scoped>
.btn-view-story {
  text-decoration-line: none;
}
</style>