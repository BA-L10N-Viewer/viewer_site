import type { useI18nTlControl } from '@/stores/i18nTlControl'
import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import {
  DirectoryDataCommonFileIndexStu,
  DirectoryDataStoryI18nFileI18nBond
} from '@/tool/PreFetchedData'
import {
  getDialogueMtTranslation,
  getTranslation,
  type MtServiceName
} from '@/tool/translate/MtDispatcher'
import type { MlForMomotalk } from '@/types/MachineTranslation'
import type { MomotalkStoryData, NexonL10nDataOfUi } from '@/types/OutsourcedData'
import { NexonL10nDataLang } from '@/types/OutsourcedData'
import type { Ref } from 'vue'

export function initMmtMt(
  /* Basic Data */
  mmtData: MomotalkStoryData,
  tableMlMmtData: Ref<MlForMomotalk>,
  listMlMmtTitle: Ref<{ [mmtId: number]: NexonL10nDataOfUi }>
) {
  for (const data of mmtData) {
    listMlMmtTitle.value[data.BondScenarioId] = {
      j_ja: '',
      j_ko: '',
      g_tw: '',
      g_tw_cn: '',
      g_en: '',
      g_th: '',
      g_ja: '',
      g_ko: '',
      c_cn: '',
      c_cn_tw: '',
      null: ''
    }
  }

  for (const lang of NexonL10nDataLang) {
    clearMmtMt(lang, mmtData, tableMlMmtData, listMlMmtTitle)
  }
  clearMmtMt('null' as NexonL10nDataLang, mmtData, tableMlMmtData, listMlMmtTitle)
}

export function clearMmtMt(
  /* Basic Data */
  baselang: NexonL10nDataLang,
  mmtData: MomotalkStoryData,
  tableMlMmtData: Ref<MlForMomotalk>,
  listMlMmtTitle: Ref<{ [mmtId: number]: NexonL10nDataOfUi }>
) {
  for (const [idx, mmtEntry] of mmtData.entries()) {
    // 初始化每一个mmt title
    listMlMmtTitle.value[mmtEntry.BondScenarioId][baselang] = ''

    // 初始化每一个mmt entry
    if (tableMlMmtData.value.length <= idx) {
      tableMlMmtData.value.push({
        j_ja: [],
        j_ko: [],
        g_tw: [],
        g_tw_cn: [],
        g_en: [],
        g_th: [],
        g_ja: [],
        g_ko: [],
        c_cn: [],
        c_cn_tw: [],
        null: []
      })
    }

    // 初始化每一个mmt dialogue entry
    for (let idx2 = 0; idx2 < mmtEntry.Data.length; idx2++) {
      const blankMlData = { name: '', nickname: '', dialogue: '' }

      if (tableMlMmtData.value[idx][baselang].length <= idx2)
        tableMlMmtData.value[idx][baselang].push(blankMlData)
      else tableMlMmtData.value[idx][baselang][idx2] = blankMlData
    }
  }
}

export async function updateMmtMt(
  baselang: NexonL10nDataLang,
  /* ML Config */
  autoI18nLang: string,
  autoI18nService: MtServiceName,
  /* MMT Data */
  charId: number,
  mmtData: MomotalkStoryData,
  tableMlMmtData: Ref<MlForMomotalk>,
  listMlMmtTitle: Ref<{ [mmtId: number]: NexonL10nDataOfUi }>,
  /* ML Progress */
  ML_in_progress: Ref<boolean>,
  ML_pinia: ReturnType<typeof useI18nTlControl>
) {
  const mmtI18nData = DirectoryDataStoryI18nFileI18nBond.value
  const charName = DirectoryDataCommonFileIndexStu.value[String(charId)]['Name']

  ML_in_progress.value = true
  clearMmtMt(baselang, mmtData, tableMlMmtData, listMlMmtTitle)

  const asyncPool = new AsyncTaskPool(8)
  const actualMlLang = autoI18nLang
  for (const [idx, mmtEntry] of mmtData.entries()) {
    // 对标题的翻译
    asyncPool.addTask(async () => {
      listMlMmtTitle.value[mmtEntry.BondScenarioId][baselang] = await getTranslation(
        autoI18nService,
        mmtI18nData[mmtEntry.BondScenarioId][0][baselang],
        actualMlLang
      )
    })

    const dialogues = mmtEntry.Data
    for (const [idx2, dialogueEntry] of dialogues.entries()) {
      asyncPool.addTask(async () => {
        tableMlMmtData.value[idx][baselang][idx2] = await getDialogueMtTranslation(
          autoI18nService,
          charName[baselang] || '',
          '',
          dialogueEntry.Message[baselang],
          actualMlLang
        )
      })
    }
  }

  await asyncPool.runAll(ML_pinia.updateProgress)
  ML_in_progress.value = false
}
