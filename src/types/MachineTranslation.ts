import type { NexonL10nDataLang } from '@/types/OutsourcedData'

export type NexonL10nDataMlData = Record<NexonL10nDataLang | 'null', { 'name': string; 'dialogue': string }[]>

export type MlForScenario = NexonL10nDataMlData
export type MlForMomotalk = [NexonL10nDataMlData]
