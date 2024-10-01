<script setup lang="ts">
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { onMounted, provide, type Ref, ref, watch } from 'vue'
import { Setting } from '@element-plus/icons-vue'
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

const mmtStatus: Ref<boolean[]> = ref([false, false, false, false, false, false])

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

  await asyncPool.runAll()
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

  if (mmtNo !== -1 && (mmtNo >= 0 && mmtNo < mmtStatus.value.length)) {
    mmtStatus.value[mmtNo] = true
  }

  return mmtNo
})()

/* 对通过以 `#story-x` 形式指定的链接，自动展开该Momotalk并移动到那个位置 */
const isMmtDefaultShow = (function() {
  let isFirstTime = true

  return (mmtIndex: number) => {
    if (isFirstTime) {
      if (urlHashStoryId === mmtIndex) {
        isFirstTime = false

        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
})()

onMounted(async () => {
  await loadRemoteResource()
  initMlData()

  isLoading.value = false
})
</script>


<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-if="!isLoading">
    <el-backtop :right="50" :bottom="100" @click="showI18nSettingDialog = true">
      <el-icon>
        <Setting />
      </el-icon>
    </el-backtop>
    <el-dialog
      v-model="showI18nSettingDialog"
      width="80%">
      <StoryI18nSetting />
    </el-dialog>

    <h1 class="view-h1">{{ $t('view-mmt-h1') }}</h1>
    <p>{{ $t('view-mmt-stu-id-p') }}{{ $route.params.charId }}</p>
    <StoryI18nSetting />
    <el-divider></el-divider>

    <div v-for="(data, index) in mmtData" :key="index">
      <h2 style="background-color: white;" :id="'mmt-story-h2-title-' + String(index)">
        <MomotalkHeader :data_no="index" :data_mmtid="data.BondScenarioId"
                        :data_l10n="mmtI18nData[data.BondScenarioId][0]" />
        <span>&nbsp;&nbsp;</span>
        <el-button type="primary" class="btn-view-story"
                   tag="RouterLink" :to="`/scenario/${data.BondScenarioId}`">
          {{ $t('view-mmt-btn-view') }}
        </el-button>
        <span>&nbsp;&nbsp;</span>
        <el-switch
          v-model="mmtStatus[index]"
          size="default"
          :active-text="$t('btn-show-content')"
        />
      </h2>
      <div v-if="mmtStatus[index]">
        <MomotalkUi :data_charname="charName" :data_data="data" :mmt_entry_pos="index"
                    :is_default_show="isMmtDefaultShow(index)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-view-story {
  text-decoration-line: none;
}
</style>