import type {
  SchaleDbStuInfoFullVoiceline,
  SchaleDbStuInfoFullVoicelineCategory
} from '@/types/OutsourcedData'
import type { NexonCharVoiceEntry, NexonCharVoiceEventTranscriptionType } from '@/types/OutsourcedDataVoice'
import { selectCharVoiceCurrTabName } from '@/tool/Constant'
import type { InjectionKey, Ref, ShallowRef } from 'vue'
import type { NexonCharVoiceMtData, SchaleDbStuVoicelineMtData } from '@/tool/CharVoiceMt'

export type CharVoiceUiTabName = SchaleDbStuInfoFullVoicelineCategory
export type CharVoiceUiDataSource = 'nexon' | 'schaledb'

export type CharVoiceUiTabAvailabilityList = { value: CharVoiceUiTabName; label: string; disabled: boolean }[]
export const CharVoiceUiTabAvailabilityList = selectCharVoiceCurrTabName.slice(0)
export type CharVoiceUiTabAvailabilityDict = Record<CharVoiceUiTabName, boolean>
export const CharVoiceUiTabAvailabilityDict: CharVoiceUiTabAvailabilityDict = {
  Normal: false,
  Lobby: false,
  Event: false,
  Battle: false
}

export type CharVoiceUiEventDisplayMode = NexonCharVoiceEventTranscriptionType[]

export const symbolDataCharVoiceNexon = Symbol('CharVoiceDataNexon') as InjectionKey<NexonCharVoiceEntry>
export const symbolDataCharVoiceSdb = Symbol('CharVoiceDataSdb') as InjectionKey<SchaleDbStuInfoFullVoiceline>
export const symbolMtDataCharVoiceNexon = Symbol('CharVoiceMtDataNexon') as InjectionKey<Ref<NexonCharVoiceMtData>>
export const symbolMtDataCharVoiceSdb = Symbol('CharVoiceMtDataSdb') as InjectionKey<Ref<SchaleDbStuVoicelineMtData>>
export const symbolDataCharVoiceI18n = Symbol('CharVoiceMtDataI18n') as InjectionKey<ShallowRef<{ [key: string]: string }>>
