import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import {
  DirectoryDataCommonFileIndexScenarioChar,
  DirectoryDataCommonFileIndexStu
} from '@/tool/PreFetchedData'
import {
  getDialogueMtTranslation,
  getTranslation,
  type MtServiceName
} from '@/tool/translate/MtDispatcher'
import type {
  MlForMomotalk,
  MlForScenario,
  NexonL10nDataMlDataEntry
} from '@/types/MachineTranslation'
import {
  NexonL10nDataLang,
  NexonL10nDataLangOfUi,
  type CommonStoryDataDialog,
  type CommonStoryDataEntry,
  type MomotalkStoryData,
  type MomotalkStoryDataEntry,
  type NexonL10nData
} from '@/types/OutsourcedData'

import { useI18nTlControl } from '@/stores/i18nTlControl'
import type { ComputedRef, Ref } from 'vue'
import { createDictionaryWithDefault } from '@/tool/Utils'

export function getScenarioDataEntryCharName(entry: CommonStoryDataEntry) {
  const scenarioChar = DirectoryDataCommonFileIndexScenarioChar.value

  if (entry.DataType === 'cmd') return scenarioChar['-1']

  const charId = String(entry.CharacterId)
  if (charId !== '-1') {
    const data = scenarioChar[charId]
    if (data) return data
    else return scenarioChar['-1']
  } else {
    return scenarioChar['-1']
  }
}

export function initScenarioMt(
  initMmt: boolean = false,
  mmtData: Ref<MomotalkStoryData>,
  scenarioNameDescMt: Ref<NexonL10nData[]>,
  tableMmtTranslated: Ref<MlForMomotalk>,
  tableDialogueTranslated: Ref<MlForScenario>,
  mmtCharId: Ref<number>,
  mmtDataCurrPos: Ref<number>,
  mmtDataCurrEntry: ComputedRef<MomotalkStoryDataEntry | null>
) {
  tableDialogueTranslated.value = createDictionaryWithDefault(
    NexonL10nDataLangOfUi,
    () => new Map<string, NexonL10nDataMlDataEntry>()
  )

  if (initMmt) {
    tableMmtTranslated.value = [] as unknown as MlForMomotalk
    for (let i = 0; i < mmtData.value.length; i++)
      tableMmtTranslated.value.push({
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
  scenarioNameDescMt.value = [
    createDictionaryWithDefault(NexonL10nDataLang, () => {
      return ''
    }),
    createDictionaryWithDefault(NexonL10nDataLang, () => {
      return ''
    })
  ]

  for (const lang of NexonL10nDataLang) {
    clearScenarioMt(
      lang,
      scenarioNameDescMt,
      tableMmtTranslated,
      tableDialogueTranslated,
      mmtCharId,
      mmtDataCurrPos,
      mmtDataCurrEntry
    )
  }
  clearScenarioMt(
    'null' as NexonL10nDataLang,
    scenarioNameDescMt,
    tableMmtTranslated,
    tableDialogueTranslated,
    mmtCharId,
    mmtDataCurrPos,
    mmtDataCurrEntry
  )
}

export function clearScenarioMt(
  baselang: NexonL10nDataLang,
  scenarioNameDescMt: Ref<NexonL10nData[]>,
  tableMmtTranslated: Ref<MlForMomotalk>,
  tableDialogueTranslated: Ref<MlForScenario>,
  mmtCharId: Ref<number>,
  mmtDataCurrPos: Ref<number>,
  mmtDataCurrEntry: ComputedRef<MomotalkStoryDataEntry | null>
) {
  const blankData = { name: '', dialogue: '', nickname: '' }

  scenarioNameDescMt.value[0][baselang] = ''
  scenarioNameDescMt.value[1][baselang] = ''

  if (mmtCharId.value !== -1 && mmtDataCurrEntry.value) {
    const mmtEntry = mmtDataCurrEntry.value.Data
    const mmtMtEntry = tableMmtTranslated.value[mmtDataCurrPos.value]
    for (let i = 0; i < mmtEntry.length; i++) {
      if (mmtMtEntry[baselang].length <= i) mmtMtEntry[baselang].push(blankData)
      else mmtMtEntry[baselang][i] = blankData
    }
  }

  const actualTable = tableDialogueTranslated.value
  for (const key of actualTable[baselang].keys()) {
    actualTable[baselang].set(key, blankData)
  }
}

export async function updateScenarioMt(
  /* Basic Data */
  baselang: NexonL10nDataLang,
  actualMlLang: string,
  autoI18nService: MtServiceName,
  mtInProgress: Ref<boolean>,
  mtPinia: ReturnType<typeof useI18nTlControl>,
  /* Scenario Name & Desc */
  scenarioNameDesc: Ref<NexonL10nData[]>,
  scenarioNameDescMt: Ref<NexonL10nData[]>,
  scenarioDataText: Ref<CommonStoryDataDialog[]>,
  /* Table Data (TLed) */
  tableMmtTranslated: Ref<MlForMomotalk>,
  tableDialogueTranslated: Ref<MlForScenario>,
  /* MMT Data */
  mmtCharId: Ref<number>,
  mmtDataCurrPos: Ref<number>,
  mmtDataCurrEntry: ComputedRef<MomotalkStoryDataEntry | null>
) {
  mtInProgress.value = true
  clearScenarioMt(
    baselang,
    scenarioNameDescMt,
    tableMmtTranslated,
    tableDialogueTranslated,
    mmtCharId,
    mmtDataCurrPos,
    mmtDataCurrEntry
  )

  const asyncPool = new AsyncTaskPool(8)
  asyncPool.addTask(async () => {
    scenarioNameDescMt.value[0][baselang] = await getTranslation(
      autoI18nService,
      scenarioNameDesc.value[0][baselang],
      actualMlLang
    )
    scenarioNameDescMt.value[1][baselang] = await getTranslation(
      autoI18nService,
      scenarioNameDesc.value[1][baselang],
      actualMlLang
    )
  })
  if (mmtCharId.value !== -1 && mmtDataCurrEntry.value) {
    const mmtEntry = mmtDataCurrEntry.value.Data
    const mmtMtEntry = tableMmtTranslated.value[mmtDataCurrPos.value]
    const mmtStu = DirectoryDataCommonFileIndexStu.value[String(mmtCharId.value)]

    for (const [idx, entry] of mmtEntry.entries()) {
      asyncPool.addTask(async () => {
        mmtMtEntry[baselang][idx] = await getDialogueMtTranslation(
          autoI18nService,
          mmtStu.Name[baselang] || '',
          '',
          entry.Message[baselang],
          actualMlLang
        )
      })
    }
  }
  for (const entry of scenarioDataText.value) {
    asyncPool.addTask(async () => {
      tableDialogueTranslated.value[baselang].set(
        String(entry.ActualPos),
        await getDialogueMtTranslation(
          autoI18nService,
          getScenarioDataEntryCharName(entry).Name[baselang],
          getScenarioDataEntryCharName(entry).Nickname[baselang],
          entry.Message[baselang],
          actualMlLang
        )
      )
    })
  }

  await asyncPool.runAll(mtPinia.updateProgress)
  mtInProgress.value = false
}
