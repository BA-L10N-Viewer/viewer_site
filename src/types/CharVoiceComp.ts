import type {
  SchaleDbStuInfoFullVoicelineCategory
} from '@/types/OutsourcedData'
import type { NexonCharVoiceEventTranscriptionType } from '@/types/OutsourcedDataVoice'
import { selectCharVoiceCurrTabName } from '@/tool/Constant'

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
