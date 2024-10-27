import type {
  NexonL10nDataLang,
  NexonL10nDataOfUi,
  SchaleDbStuInfoFullVoicelineCategory, SchaleDbStuInfoFullVoicelineEntry
} from '@/types/OutsourcedData'
import {
  NexonL10nDataLangOfUi
} from '@/types/OutsourcedData'
import type {
  NexonCharVoiceBattle,
  NexonCharVoiceEvent,
  NexonCharVoiceEventTranscriptionType,
  NexonCharVoiceNormal
} from '@/types/OutsourcedDataVoice'
import type { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import { getNexonL10nData } from '@/tool/StoryTool'
import { getTranslation, type MtServiceName } from '@/tool/translate/MtDispatcher'
import { NexonLangMap } from '@/tool/Constant'
import { type Ref, ref } from 'vue'

export type NexonCharVoiceNormalEntryMtData = {
  Id: string;
  Transcription: Record<NexonL10nDataLangOfUi, string[]>
}
export type NexonCharVoiceBattleEntryMtData = {
  Id: string;
  Transcription: NexonL10nDataOfUi
}
/*
export type NexonCharVoiceEventTranscriptionEntryMtData = {
  Type: NexonCharVoiceEventTranscriptionType;
  Data: NexonL10nDataOfUi
}
*/
export type NexonCharVoiceEventVoiceEntryMtData = {
  Id: string;
  Transcription: { [key in NexonCharVoiceEventTranscriptionType]: NexonL10nDataOfUi };
}
export type SchaleDbStuVoicelineEntryMtData = {
  Group: string
  Transcription: NexonL10nDataOfUi
}

export type NexonCharVoiceNormalMtData = { [key: string]: NexonCharVoiceNormalEntryMtData }
export type NexonCharVoiceBattleMtData = { [key: string]: NexonCharVoiceBattleEntryMtData }
export type NexonCharVoiceEventMtData = { [key: string]: NexonCharVoiceEventVoiceEntryMtData }
export type SchaleDbVoicelineCategoryMtData = { [key: string]: SchaleDbStuVoicelineEntryMtData }

export type NexonCharVoiceMtData = Ref<{
  Normal: NexonCharVoiceNormalMtData
  Lobby: NexonCharVoiceNormalMtData
  Battle: NexonCharVoiceBattleMtData
  Event: NexonCharVoiceEventMtData
}>
export type SchaleDbStuVoicelineMtData = Ref<Record<SchaleDbStuInfoFullVoicelineCategory, SchaleDbVoicelineCategoryMtData>>

/* ----------------------------------------
*  MACHINE TRANSLATION - INIT
*  ---------------------------------------- */

export function initNexonCharVoiceNormalMtData(baseVoiceData: NexonCharVoiceNormal) {
  const result: NexonCharVoiceNormalMtData = {}
  for (const group of baseVoiceData) {
    for (const entry of group.Data) {
      const temp: Record<NexonL10nDataLangOfUi, string[]> = {
        j_ja: [],
        j_ko: [],
        g_en: [],
        g_ja: [],
        g_ko: [],
        g_th: [],
        g_tw: [],
        g_tw_cn: [],
        c_cn: [],
        c_cn_tw: [],
        null: []
      }
      for (const lang of NexonL10nDataLangOfUi) {
        for (let i = 0; i < entry.Transcription.j_ja.length; i++)
          temp[lang]!.push('')
      }

      result[entry.Id] = ({ Id: entry.Id, Transcription: temp })
    }
  }

  return result
}

export function initNexonCharVoiceBattleMtData(baseVoiceData: NexonCharVoiceBattle) {
  const result: NexonCharVoiceBattleMtData = {}
  for (const group of baseVoiceData) {
    for (const entry of group.Data)
      result[entry.Id] = {
        Id: entry.Id,
        Transcription: {
          j_ja: '',
          j_ko: '',
          g_en: '',
          g_ja: '',
          g_ko: '',
          g_th: '',
          g_tw: '',
          g_tw_cn: '',
          c_cn: '',
          c_cn_tw: '',
          null: ''
        }
      }
  }

  return result
}

export function initNexonCharVoiceEventMtData(baseVoiceData: NexonCharVoiceEvent) {
  const result: NexonCharVoiceEventMtData = {}
  for (const event of baseVoiceData) {
    for (const group of event.Data) {
      for (const voiceEntry of group.Data) {
        const mtTranscription: Record<NexonCharVoiceEventTranscriptionType, NexonL10nDataOfUi> = {
          FirstTime: {
            j_ja: '',
            j_ko: '',
            g_en: '',
            g_ja: '',
            g_ko: '',
            g_th: '',
            g_tw: '',
            g_tw_cn: '',
            c_cn: '',
            c_cn_tw: '',
            null: ''
          },
          Rerun: {
            j_ja: '',
            j_ko: '',
            g_en: '',
            g_ja: '',
            g_ko: '',
            g_th: '',
            g_tw: '',
            g_tw_cn: '',
            c_cn: '',
            c_cn_tw: '',
            null: ''
          },
          Immortalized: {
            j_ja: '',
            j_ko: '',
            g_en: '',
            g_ja: '',
            g_ko: '',
            g_th: '',
            g_tw: '',
            g_tw_cn: '',
            c_cn: '',
            c_cn_tw: '',
            null: ''
          }
        }
        result[`${event.EventId}_${voiceEntry.Id}`] = {
          Id: `${event.EventId}_${voiceEntry.Id}`,
          Transcription: mtTranscription
        }
      }
    }
  }

  return result
}

export function initSchaleDbVoiceCategoryMtData(baseVoiceData: SchaleDbStuInfoFullVoicelineEntry[]) {
  const result: SchaleDbVoicelineCategoryMtData = {}
  for (const entry of baseVoiceData)
    result[entry.Group] = {
      Group: entry.Group,
      Transcription: {
        j_ja: '',
        j_ko: '',
        g_en: '',
        g_ja: '',
        g_ko: '',
        g_th: '',
        g_tw: '',
        g_tw_cn: '',
        c_cn: '',
        c_cn_tw: '',
        null: ''
      }
    }
  return result
}

/* ----------------------------------------
*  MACHINE TRANSLATION - CLEAR
*  ---------------------------------------- */

export function clearNexonCharVoiceNormalMtData(baseMtData: NexonCharVoiceNormalMtData, lang: NexonL10nDataLangOfUi) {
  for (const value of Object.values(baseMtData)) {
    const temp = []
    for (let i = 0; i < value.Transcription[lang].length; i++)
      temp.push('')
    value.Transcription[lang] = temp
  }
}

export function clearNexonCharVoiceBattleMtData(baseMtData: NexonCharVoiceBattleMtData, lang: NexonL10nDataLangOfUi) {
  for (const value of Object.values(baseMtData))
    value.Transcription[lang] = ''
}

export function clearNexonCharVoiceEventMtData(baseMtData: NexonCharVoiceEventMtData, lang: NexonL10nDataLangOfUi) {
  for (const value of Object.values(baseMtData)) {
    for (const transcription of Object.values(value.Transcription))
      transcription[lang] = ''
  }
}

export function clearSchaleDbVoiceCategoryMtData(baseMtData: SchaleDbVoicelineCategoryMtData, lang: NexonL10nDataLangOfUi) {
  for (const value of Object.values(baseMtData))
    value.Transcription[lang] = ''
}

/* ----------------------------------------
*  MACHINE TRANSLATION - UPDATE TRANSLATION
*  ---------------------------------------- */

export function updateNexonCharVoiceNormalMtData(baseVoiceData: NexonCharVoiceNormal,
                                                 baseMtData: NexonCharVoiceNormalMtData,
                                                 lang: NexonL10nDataLangOfUi,
                                                 mtService: MtServiceName,
                                                 targetLang: string,
                                                 asyncPool: AsyncTaskPool) {
  if (lang === 'null')
    return

  for (const group of baseVoiceData) {
    for (const entry of group.Data) {
      const texts = getNexonL10nData(entry.Transcription, lang as NexonL10nDataLang)
      const actualTexts = texts.map(i => i.join(''))
      for (const [idx, text] of actualTexts.entries()) {
        asyncPool.addTask(
          async function() {
            baseMtData[entry.Id].Transcription[lang][idx] = await getTranslation(
              mtService,
              text,
              targetLang,
              NexonLangMap[lang]
            )
          }
        )
      }
    }
  }
}

export function updateNexonCharVoiceBattleMtData(baseVoiceData: NexonCharVoiceBattle,
                                                 baseMtData: NexonCharVoiceBattleMtData,
                                                 lang: NexonL10nDataLangOfUi,
                                                 mtService: MtServiceName,
                                                 targetLang: string,
                                                 asyncPool: AsyncTaskPool) {
  if (lang === 'null')
    return

  for (const group of baseVoiceData) {
    for (const entry of group.Data) {
      const currText = getNexonL10nData(entry.Transcription, lang as NexonL10nDataLang)
      asyncPool.addTask(async function() {
        baseMtData[entry.Id].Transcription[lang] = await getTranslation(
          mtService, currText, targetLang, NexonLangMap[lang]
        )
      })
    }
  }
}

export function updateNexonCharVoiceEventMtData(baseVoiceData: NexonCharVoiceEvent,
                                                 baseMtData: NexonCharVoiceEventMtData,
                                                 lang: NexonL10nDataLangOfUi,
                                                 mtService: MtServiceName,
                                                 targetLang: string,
                                                 asyncPool: AsyncTaskPool) {
  if (lang === 'null')
    return

  for (const event of baseVoiceData) {
    for (const group of event.Data) {
      for (const voiceEntry of group.Data) {
        for (const transcription of voiceEntry.Transcription) {
          const currType = transcription.Type
          const currText = transcription.Data[lang].join('<br />')

          asyncPool.addTask(async function () {
            baseMtData[`${event.EventId}_${voiceEntry.Id}`].Transcription[currType][lang] = await getTranslation(
              mtService, currText, targetLang, NexonLangMap[lang]
            )
          })
        }
      }
    }
  }
}

export function updateSchaleDbVoiceCategoryMtData(baseVoiceData: SchaleDbStuInfoFullVoicelineEntry[],
                                                  baseMtData: SchaleDbVoicelineCategoryMtData,
                                                  lang: NexonL10nDataLangOfUi,
                                                  mtService: MtServiceName,
                                                  targetLang: string,
                                                  asyncPool: AsyncTaskPool) {
  if (lang === 'null')
    return

  for (const entry of baseVoiceData) {
    const currText = entry.Transcription[lang]
    asyncPool.addTask(async function () {
      baseMtData[entry.Group].Transcription[lang] = await getTranslation(
        mtService, currText, targetLang, NexonLangMap[lang]
      )
    })
  }
}
