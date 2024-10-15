import type { NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'

export type NexonCharVoiceNormalTranscription = Record<NexonL10nDataLang, string[][]>
export type NexonCharVoiceNormalEntry = {
  Id: string;
  FilePath: string[];
  Transcription: NexonCharVoiceNormalTranscription;
}
export type NexonCharVoiceNormalGroup = {
  GroupId: string;
  Data: NexonCharVoiceNormalEntry[]
}
export type NexonCharVoiceNormal = NexonCharVoiceNormalGroup[]

export type NexonCharVoiceEventTranscriptionData = Record<NexonL10nDataLang, string[]>
export type NexonCharVoiceEventTranscriptionType = 'FirstTime' | 'Rerun' | 'Immortalized'
export type NexonCharVoiceEventTranscriptionEntry = {
  Type: NexonCharVoiceEventTranscriptionType;
  Data: NexonCharVoiceEventTranscriptionData;
}
export type NexonCharVoiceEventVoiceEntryParam = {
  DialogConditionDetail: string;
  DialogConditionDetailValue: number;
}
export type NexonCharVoiceEventVoiceEntry = {
  Id: string;
  FilePath: string[];
  Transcription: NexonCharVoiceEventTranscriptionEntry[];
  Param: NexonCharVoiceEventVoiceEntryParam
}
export type NexonCharVoiceEventGroupEntry = {
  GroupId: string;
  Data: NexonCharVoiceEventVoiceEntry[];
}
export type NexonCharVoiceEventEntry = {
  EventId: string;
  Data: NexonCharVoiceEventGroupEntry;
}
export type NexonCharVoiceEvent = NexonCharVoiceEventEntry[]

export type NexonCharVoiceBattleTranscription = NexonL10nData
export type NexonCharVoiceBattleEntry = {
  Id: string;
  FilePath: string;
  Transcription: NexonCharVoiceBattleTranscription
}
export type NexonCharVoiceBattleGroup = {
  GroupId: string;
  Data: NexonCharVoiceBattleEntry[];
}
export type NexonCharVoiceBattle = NexonCharVoiceBattleGroup[]

export type NexonCharVoiceEntry = {
  Normal: NexonCharVoiceNormal;
  Lobby?: NexonCharVoiceNormal;
  Battle?: NexonCharVoiceBattle;
  Event?: NexonCharVoiceEvent;
}
