import type {
  NexonL10nDataLang,
  SchaleDbL10nData,
  SchaleDbStuInfoFull
} from '@/types/OutsourcedData'

export type NexonL10nDataMlDataEntry = { name: string; dialogue: string; nickname: string }
export type NexonL10nDataMlData = Record<NexonL10nDataLang | 'null', NexonL10nDataMlDataEntry[]>
export type MlForCharProfile = Record<
  Exclude<keyof SchaleDbStuInfoFull, 'Id' | 'Voicelines'>,
  SchaleDbL10nData
>

export type MlForScenarioLang = Map<string, NexonL10nDataMlDataEntry>
export type MlForScenario = Record<NexonL10nDataLang | 'null', MlForScenarioLang>
export type MlForMomotalk = [NexonL10nDataMlData]

export type MlProgessInfo = {
  completed: number
  total: number
}
