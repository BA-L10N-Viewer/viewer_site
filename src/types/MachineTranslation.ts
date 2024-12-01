import type { NexonL10nDataLang, SchaleDbL10nData, SchaleDbStuInfoFull } from '@/types/OutsourcedData'

export type NexonL10nDataMlData = Record<NexonL10nDataLang | 'null', { 'name': string; 'dialogue': string }[]>
export type MlForCharProfile = Record<Exclude<keyof SchaleDbStuInfoFull, 'Id' | 'Voicelines'>, SchaleDbL10nData>

export type MlForScenario = NexonL10nDataMlData
export type MlForMomotalk = [NexonL10nDataMlData]

export type MlProgessInfo = {
  completed: number;
  total: number;
}
