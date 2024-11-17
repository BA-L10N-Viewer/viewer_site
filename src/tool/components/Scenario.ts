import type { NexonL10nData } from '@/types/OutsourcedData'

export type ScenarioDataStatusType = 'released' | 'unreleased' | 'unknown'

/* PARENT DATA */
export type ScenarioParentDataEvent = {
  Type: 'event';
  Data: {
    EventId: number | string;
    EventName: NexonL10nData;
  }
}
export type ScenarioParentDataBond = {
  Type: 'bond';
  Data: {
    CharId: number | string;
    CharName: NexonL10nData;
  }
}
export type ScenarioParentDataMain = {
  Type: 'main';
  Data: {
    Category: 'main' | 'side' | 'short' | 'other';
    VolumeName?: NexonL10nData;
    ChapterName: NexonL10nData;
  }
}
export type ScenarioParentData = ScenarioParentDataMain | ScenarioParentDataBond | ScenarioParentDataEvent
export type ScenarioParentDataType = ScenarioParentData['Type']
export type ScenarioParentDataMainCategory = ScenarioParentDataMain['Data']['Category']


export function inferScenarioTypeById(scenarioId: number | string): ScenarioParentDataType {
  const temp = String(scenarioId)
  if (temp.length === 8 || temp.length === 11) {
    if (temp.startsWith('900'))
      return 'main'
    else if (temp.length === 8 && temp.startsWith('700'))
      return 'main'
    else
      return 'event'
  } else if (temp.length === 7)
    return 'bond'
  else
    return 'main'
}

export function inferScenarioMainCategoryById(scenarioId: number | string): ScenarioParentDataMainCategory {
  const temp = String(scenarioId)
  if (temp.length === 3)
    return 'other'
  else if (temp.length === 4)
    return 'side'
  else if (temp.length === 8)
    return 'short'
  else
    return 'main'
}

export function getScenarioDataStatus(data: NexonL10nData): ScenarioDataStatusType[] {
  const result: ScenarioDataStatusType[] = []
  if (data.j_ja && (data.j_ja !== '' && data.j_ja !== 'LocalizeError'))
    result.push('released')
  else
    result.push('unreleased')
  if (data.g_en && (data.g_en !== '' && data.g_en !== 'LocalizeError'))
    result.push('released')
  else
    result.push('unreleased')
  if (data.c_cn && (data.c_cn !== '' && data.c_cn !== 'LocalizeError')) {
    if (data.c_cn!.indexOf('not found') !== -1)
      result.push('released')
    else
      result.push('unknown')
  }
  else
    result.push('unreleased')

  return result
}
