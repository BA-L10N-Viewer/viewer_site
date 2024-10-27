import type {
  NexonL10nDataLang,
  NexonL10nDataLangOfUi,
  SchaleDbStuInfoFullVoicelineEntry
} from '@/types/OutsourcedData'
import type {
  NexonCharVoiceBattle,
  NexonCharVoiceBattleEntry,
  NexonCharVoiceBattleGroup, NexonCharVoiceEvent,
  NexonCharVoiceEventEntry,
  NexonCharVoiceEventGroupEntry,
  NexonCharVoiceEventTranscriptionType,
  NexonCharVoiceEventVoiceEntry,
  NexonCharVoiceEventVoiceEntryParam, NexonCharVoiceNormal,
  NexonCharVoiceNormalEntry,
  NexonCharVoiceNormalGroup
} from '@/types/OutsourcedDataVoice'
import { getNexonL10nData } from '@/tool/StoryTool'

/* -----------------------------------------------------
*  CHARACTER VOICE (ENTRY)
*  ENTRY (X) > GROUP ( ) > DATA ( )
*  ----------------------------------------------------- */

export type NexonCharVoiceTableTranscription = {
  Transcription: string;
  TranscriptionLang: NexonL10nDataLang
}

export type NexonCharVoiceNormalEntryForTable = {
  Id: string;
  CostumePos: number;
} & NexonCharVoiceTableTranscription
export type NexonCharVoiceBattleEntryForTable = {
  Id: string;
} & NexonCharVoiceTableTranscription
export type NexonCharVoiceEventEntryForTable = {
  Id: string;
  EventType: NexonCharVoiceEventTranscriptionType
} & NexonCharVoiceTableTranscription
export type SchaleDbVoiceEntryForTable = {
  Id: string;
  Transcription: string;
  TranscriptionLang: NexonL10nDataLang
}

export function convertNexonCharVoiceNormalEntryForTable(entry: NexonCharVoiceNormalEntry, langs: NexonL10nDataLangOfUi[]) {
  const temp: NexonCharVoiceNormalEntryForTable[][] = []
  for (const lang of langs) {
    if (lang === 'null')
      continue

    const texts = entry.Transcription[lang]
    if (texts) {
      for (const [idx, text] of texts.entries()) {
        let currCostume = temp[idx]
        if (!currCostume) {
          temp.push([])
          currCostume = temp[idx]
        }

        currCostume.push({
          Id: entry.Id,
          CostumePos: idx,
          Transcription: text.join('<br />'),
          TranscriptionLang: lang
        })
      }
    }
  }

  let result: NexonCharVoiceNormalEntryForTable[] = []
  for (const entryList of temp)
    result = result.concat(entryList)
  return result
}

export function convertNexonCharVoiceBattleEntryForTable(entry: NexonCharVoiceBattleEntry, langs: NexonL10nDataLangOfUi[]) {
  const result: NexonCharVoiceBattleEntryForTable[] = []
  for (const lang of langs) {
    if (lang === 'null')
      continue

    const text = getNexonL10nData(entry.Transcription, lang)
    result.push({
      Id: entry.Id,
      Transcription: text,
      TranscriptionLang: lang
    })
  }

  return result
}

export function convertNexonCharVoiceEventEntryForTable(entry: NexonCharVoiceEventVoiceEntry, langs: NexonL10nDataLangOfUi[]) {
  const temp: Record<NexonCharVoiceEventTranscriptionType, NexonCharVoiceEventEntryForTable[]> = {
    FirstTime: [], Rerun: [], Immortalized: []
  }

  for (const transcription of entry.Transcription) {
    const currType = transcription.Type
    const currTexts = transcription.Data
    for (const lang of langs) {
      if (lang === 'null')
        continue

      let currText = ''
      if (lang in currTexts)
        currText = currTexts[lang].join('<br />')
      temp[currType].push({
        Id: entry.Id,
        EventType: currType,
        Transcription: currText,
        TranscriptionLang: lang
      })
    }
  }

  const result = [temp.FirstTime, temp.Rerun, temp.Immortalized].flat()
  return result
}

export function convertSchaleDbVoiceEntryForTable(entry: SchaleDbStuInfoFullVoicelineEntry, langs: NexonL10nDataLangOfUi[]) {
  const result: SchaleDbVoiceEntryForTable[] = []
  for (const lang of langs) {
    if (lang === 'null')
      continue

    let text = ''
    if (lang in entry.Transcription)
      text = entry.Transcription[lang]
    result.push({
      Id: entry.Group,
      Transcription: text,
      TranscriptionLang: lang
    })
  }
  return result
}

/* -----------------------------------------------------
*  CHARACTER VOICE (GROUP)
*  ENTRY ( ) > GROUP (X) > DATA ( )
*  ----------------------------------------------------- */

export type NexonCharVoiceNormalGroupEntryForTable = {
  GroupId: string;
  Data: NexonCharVoiceNormalEntryForTable[][]
}
export type NexonCharVoiceBattleGroupEntryForTable = {
  GroupId: string;
  Data: NexonCharVoiceBattleEntryForTable[][]
}
export type NexonCharVoiceEventGroupEntryForTable = {
  GroupId: string;
  Data: {
    Param: NexonCharVoiceEventVoiceEntryParam;
    Data: NexonCharVoiceEventEntryForTable[];
  }[]
}

export function convertNexonCharVoiceNormalGroupEntryForTable(entry: NexonCharVoiceNormalGroup, langs: NexonL10nDataLangOfUi[]): NexonCharVoiceNormalGroupEntryForTable {
  const temp: NexonCharVoiceNormalEntryForTable[][] = []
  for (const voiceEntry of entry.Data)
    temp.push(convertNexonCharVoiceNormalEntryForTable(voiceEntry, langs))
  return { GroupId: entry.GroupId, Data: temp }
}

export function convertNexonCharVoiceBattleGroupEntryForTable(entry: NexonCharVoiceBattleGroup, langs: NexonL10nDataLangOfUi[]): NexonCharVoiceBattleGroupEntryForTable {
  const temp: NexonCharVoiceBattleEntryForTable[][] = []
  for (const voiceEntry of entry.Data)
    temp.push(convertNexonCharVoiceBattleEntryForTable(voiceEntry, langs))
  return { GroupId: entry.GroupId, Data: temp }
}

export function convertNexonCharVoiceEventGroupEntryForTable(entry: NexonCharVoiceEventGroupEntry, langs: NexonL10nDataLangOfUi[]): NexonCharVoiceEventGroupEntryForTable {
  const temp = []
  for (const voiceEntry of entry.Data) {
    temp.push({
      Param: voiceEntry.Param,
      Data: convertNexonCharVoiceEventEntryForTable(voiceEntry, langs)
    })
  }
  return { GroupId: entry.GroupId, Data: temp }
}

/* -----------------------------------------------------
*  CHARACTER VOICE (GROUP)
*  ENTRY ( ) > GROUP ( ) > DATA (X)
*  ----------------------------------------------------- */

export type NexonCharVoiceNormalCategoryForTable = NexonCharVoiceNormalGroupEntryForTable[]
export type NexonCharVoiceBattleCategoryForTable = NexonCharVoiceBattleGroupEntryForTable[]
export type NexonCharVoiceEventCategoryForTable = { EventId: string; Data: NexonCharVoiceEventGroupEntryForTable[] }[]
export type SchaleDbVoiceCategoryForTable = SchaleDbVoiceEntryForTable[][]

export function convertNexonCharVoiceNormalCategoryForTable(entry: NexonCharVoiceNormal, langs: NexonL10nDataLangOfUi[]) {
  const result: NexonCharVoiceNormalCategoryForTable = []
  for (const voiceGroup of entry)
    result.push(convertNexonCharVoiceNormalGroupEntryForTable(voiceGroup, langs))
  return result
}

export function convertNexonCharVoiceBattleCategoryForTable(entry: NexonCharVoiceBattle, langs: NexonL10nDataLangOfUi[]) {
  const result: NexonCharVoiceBattleCategoryForTable = []
  for (const voiceGroup of entry)
    result.push(convertNexonCharVoiceBattleGroupEntryForTable(voiceGroup, langs))
  return result
}

export function convertNexonCharVoiceEventCategoryForTable(entry: NexonCharVoiceEvent, langs: NexonL10nDataLangOfUi[]) {
  const result: NexonCharVoiceEventCategoryForTable = []
  for (const entryEvent of entry) {
    const temp = []
    for (const voiceGroup of entryEvent.Data)
      temp.push(convertNexonCharVoiceEventGroupEntryForTable(voiceGroup, langs))
    result.push({EventId: entryEvent.EventId, Data: temp})
  }
  return result
}

export function convertSchaleDbVoiceCategoryForTable(entry: SchaleDbStuInfoFullVoicelineEntry[], langs: NexonL10nDataLangOfUi[]) {
  const result: SchaleDbVoiceCategoryForTable = []
  for (const voiceGroup of entry)
    result.push(convertSchaleDbVoiceEntryForTable(voiceGroup, langs))
  return result
}
