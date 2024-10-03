import type { NexonL10nDataLang } from '@/types/OutsourcedData'

export type CharVoiceNormalTranscription = Record<NexonL10nDataLang, string[][]>
export type CharVoiceNormalEntry = {
  Id: string;
  FilePath: string[];
  Transcription: CharVoiceNormalTranscription;
}
export type CharVoiceNormalGroup = {
  GroupId: string;
  Data: CharVoiceNormalEntry[]
}
export type CharVoiceNormal = CharVoiceNormalGroup[]

export type CharVoiceEventTranscriptionData = Record<NexonL10nDataLang, string[]>
export type CharVoiceEventTranscriptionType = 'FirstTime' | 'Rerun' | 'Immortalized'
export type CharVoiceEventTranscriptionEntry = {
  Type: CharVoiceEventTranscriptionType;
  Data: CharVoiceEventTranscriptionData;
}
export type CharVoiceEventEntryParam = {
  DialogConditionDetail: string;
  DialogConditionDetailValue: number;
}
export type CharVoiceEventVoiceEntry = {
  Id: string;
  FilePath: string[];
  Transcription: CharVoiceEventTranscriptionEntry;
  Param: CharVoiceEventEntryParam
}
export type CharVoiceEventGroupEntry = {
  GroupId: string;
  Data: CharVoiceEventVoiceEntry[];
}
export type CharVoiceEventEntry = {
  EventId: string;
  Data: CharVoiceEventGroupEntry;
}
export type CharVoiceEvent = CharVoiceEventEntry[]

export type CharVoiceEntry = {
  Normal: CharVoiceNormal;
  Lobby?: CharVoiceNormal;
  Battle?: CharVoiceNormal;
  Event?: CharVoiceEvent;
}
