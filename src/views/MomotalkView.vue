<script setup lang="ts">
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { nextTick, onBeforeUnmount, onMounted, provide, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { httpGetJsonAsync } from '@/tool/HttpRequest'
import MomotalkHeader from '@/components/momotalk/MomotalkHeader.vue'
import MomotalkUi from '@/components/MomotalkUi.vue'
import type {
  I18nBondInfoData,
  MomotalkStoryData,
  NexonL10nDataLang,
  NexonL10nDataOfUi,
  SchaleDbL10nData,
  StudentInfoDataSimple
} from '@/types/OutsourcedData'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import { useSetting } from '@/stores/setting'
import { mtI18nLangStats } from '@/tool/ConstantComputed'
import type { MlForMomotalk } from '@/types/MachineTranslation'
import { mtPiniaWatchCallback, symbolForMomotalkMtData } from '@/tool/translate/MtUtils'

import PvButton from 'primevue/button'
import PvDialog from 'primevue/dialog'
import PvDivider from 'primevue/divider'
import PvAccordion from 'primevue/accordion'
import PvAccordionPanel from 'primevue/accordionpanel'
import PvAccordionHeader from 'primevue/accordionheader'
import PvAccordionContent from 'primevue/accordioncontent'
import CharacterSheet from '@/components/CharacterSheet.vue'
import {
  DirectoryDataCommonFileIndexMomoL2d,
  DirectoryDataCommonFileIndexStu,
  DirectoryDataStoryI18nFileI18nBond
} from '@/tool/PreFetchedData'
import { AppPageCategoryToI18nCode, changeAppPageTitle } from '@/tool/AppTitleChanger'
import { useI18n } from 'vue-i18n'
import { allLangcodeOfSchaleDbBySiteUiLang } from '@/tool/Constant'
import { clearMmtMt, initMmtMt, updateMmtMt } from '@/script/MomotalkViewMt'
import { scrollToDesignatedElement } from '@/tool/UtilsPage'

const showI18nSettingDialog = ref(false)
const route = useRoute()
const setting = useSetting()
const i18n = useI18n()

const charId = Number(String(route.params.charId))
const titleChanger = ref<() => void>(() => {})

// ---------------------------------------
const isLoading = ref(true)
let mmtData: MomotalkStoryData = [] as unknown as MomotalkStoryData
let charData: StudentInfoDataSimple = {} as unknown as StudentInfoDataSimple
let mmtI18nData: I18nBondInfoData = {} as unknown as I18nBondInfoData
let charName: SchaleDbL10nData = {} as unknown as SchaleDbL10nData
let bondL2dData: Record<string, number> = {} as unknown as Record<string, number>

async function loadRemoteResource() {
  await Promise.allSettled([
    httpGetJsonAsync(mmtData, `/data/story/momotalk/${route.params.charId}.json`)
  ])
  charData = DirectoryDataCommonFileIndexStu.value
  mmtI18nData = DirectoryDataStoryI18nFileI18nBond.value
  bondL2dData = DirectoryDataCommonFileIndexMomoL2d.value

  charName = charData[String(charId)]['Name']
}

const mmtStatus = ref<number[]>([])

// ------------------ ML SERVICE ---------------------
const mtControl = {
  inProgress: ref(false),
  pinia: useI18nTlControl()
}
mtControl.pinia.initAll()

// 创建每一个mmt对话的对应表
const tableMlMmtData: Ref<MlForMomotalk> = ref([] as any)
const listMlMmtTitle: Ref<{ [mmtId: number]: NexonL10nDataOfUi }> = ref({})

function clearMlTranslation(baselang: NexonL10nDataLang) {
  clearMmtMt(baselang, mmtData, tableMlMmtData, listMlMmtTitle)
}

async function updateMlTranslation(baselang: NexonL10nDataLang) {
  await updateMmtMt(
    baselang,
    setting.auto_i18n_lang,
    setting.auto_i18n_service,
    charId,
    mmtData,
    tableMlMmtData,
    listMlMmtTitle,
    mtControl.inProgress,
    mtControl.pinia
  )
}

function initMlData() {
  initMmtMt(mmtData, tableMlMmtData, listMlMmtTitle)
}

watch(mtI18nLangStats, async (newValue) => {
  await mtPiniaWatchCallback(
    newValue,
    updateMlTranslation,
    clearMlTranslation,
    mtControl.pinia.setStatusToComplete
  )
})

provide(symbolForMomotalkMtData, tableMlMmtData)

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

async function scrollToMmtByUrlHashtag() {
  if (urlHashStoryId !== -1) mmtStatus.value.push(urlHashStoryId)

  // 等待Accordion显示
  await nextTick()
  await nextTick()

  scrollToDesignatedElement(`mmt-story-h2-title-${urlHashStoryId}`)
  // console.log(`mmt-story-h2-title-${urlHashStoryId}`)
}

onMounted(async () => {
  await loadRemoteResource()
  initMlData()

  titleChanger.value = watch(
    () => setting.ui_lang,
    (newValue) => {
      changeAppPageTitle(
        i18n.t(AppPageCategoryToI18nCode['momotalk']),
        charName,
        allLangcodeOfSchaleDbBySiteUiLang[newValue]
      )
    },
    { immediate: true }
  )

  isLoading.value = false

  // 等待DOM更新
  await nextTick()
  scrollToMmtByUrlHashtag()
})

onBeforeUnmount(() => {
  titleChanger.value()
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-if="!isLoading">
    <Teleport to="body">
      <div style="position: fixed; right: 5%; bottom: 10%">
        <PvButton severity="secondary" rounded @click="showI18nSettingDialog = true">
          <span class="pi pi-globe" style="color: var(--color-ba-logo)" />
          <span>L10N</span>
        </PvButton>
      </div>

      <PvDialog
        v-model:visible="showI18nSettingDialog"
        modal
        :closable="true"
        :draggable="false"
        :dismissableMask="true"
        style="width: 90%"
      >
        <StoryI18nSetting />
      </PvDialog>
    </Teleport>

    <h1 class="view-h1">{{ $t('view-mmt-h1') }}</h1>
    <CharacterSheet :is-mmt="true" :char-id="String(route.params.charId)" />
    <PvDivider />

    <PvAccordion :value="mmtStatus" multiple>
      <PvAccordionPanel v-for="(data, index) in mmtData" :key="index" :value="index">
        <PvAccordionHeader :id="`mmt-story-h2-title-${index}`">
          <div style="text-align: left; color: black; font-size: 1.2em">
            <MomotalkHeader
              :data_no="index"
              :data_mmtid="data.BondScenarioId"
              :data_l10n="mmtI18nData[data.BondScenarioId][0]"
              :data_l10n_mt="listMlMmtTitle[data.BondScenarioId]"
              :is_l2d="data.BondScenarioId === bondL2dData[String(charId)]"
            />
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
