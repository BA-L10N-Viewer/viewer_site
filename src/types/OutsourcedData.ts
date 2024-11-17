export const NexonL10nDataLang: NexonL10nDataLang[] = ['j_ja', 'j_ko', 'g_tw', 'g_tw_cn', 'g_en', 'g_th', 'g_ja', 'g_ko', 'c_cn', 'c_cn_tw']
export type NexonL10nDataLang =
  'j_ja'
  | 'j_ko'
  | 'g_tw'
  | 'g_tw_cn'
  | 'g_en'
  | 'g_th'
  | 'g_ja'
  | 'g_ko'
  | 'c_cn'
  | 'c_cn_tw'
export type NexonL10nData = Record<NexonL10nDataLang, string>
export type NexonL10nDataDict = {
  [key: string]: NexonL10nData
}

export type NexonL10nDataLangOfUi = NexonL10nDataLang | 'null'
export const NexonL10nDataLangOfUi: NexonL10nDataLangOfUi[] = [...NexonL10nDataLang, 'null']
export type NexonL10nDataOfUi = Record<NexonL10nDataLangOfUi, string>
export type NexonL10nDataLangDataOfUiDict = {
  [key: string]: NexonL10nDataOfUi
}

export type SchaleDbL10nDataLang = NexonL10nDataLang | 'c_zh' | 'c_zh_tw'
export type SchaleDbL10nData = Record<SchaleDbL10nDataLang, string>

/*  Common Story File (e.g. 1101.json)  */
export type CommonStoryDataDialogDataType =
  'title'
  | 'st'
  | 'stm'
  | 'place'
  | 'nextEpisode'
  | 'na'
  | 'option'
  | 'speaker'
export type CommonStoryDataDialogTextColor = 'black' | '#4EA24E' | '#59ADF8' | '#FF3333' | '#FF7800' | '#800000'
export type CommonStoryDataDialog = {
  AbsolutePos: number;
  SelectionGroup: number;
  SelectionToGroup: number;
  PopupFileName: string;
  Message: NexonL10nData;
  CharacterId: number;
  DataType: CommonStoryDataDialogDataType;
  Script: string;
  BGMId: number;
  Sound: string;
  BGName: number;
  ShowTextColor: CommonStoryDataDialogTextColor;
}

/* Bond Name/Desc (i18n_bond.json) */
export type I18nBondInfoDataEntry = [NexonL10nData, NexonL10nData]
export type I18nBondInfoData = {
  [momotalkId: string]: I18nBondInfoDataEntry
}

/* I18n String (BOI) => xxhash-ed String
 *  (i18n_event_index.json / i18n_main_index.json) */
export type I18nStoryInfoIdToXxhash = {
  [i18nId: string]: number
}

/* xxhash => actual L10n String (Nexon) (i18n_story.json) */
export type I18nStoryXxhashToL10nData = {
  [xxhashId: string]: NexonL10nData
}

/* Momotalk Data (e.g. 10041.json) */
export type MomotalkStoryDataDialogBgColor = 'white' | 'green' | 'blue'
export type MomotalkStoryDataDialog = {
  GroupId: number;
  Id: number;
  CharacterId: number;
  MessageCondition: string;
  FavorScheduleId: number;
  NextGroupId: number;
  Message: NexonL10nData;
  MessageBgColor: MomotalkStoryDataDialogBgColor;
}
export type MomotalkStoryDataEntry = {
  BondScenarioId: number;
  Data: MomotalkStoryDataDialog[];
}
export type MomotalkStoryData = MomotalkStoryDataEntry[]

/* Momotalk <==> Character Id table */
export type IndexMomotalkToCharacter = string
export type IndexCharacterToMomotalk = number[]
export type IndexMomotalkData = {
  [key: string]: IndexMomotalkToCharacter | IndexCharacterToMomotalk
}

/* xxhash (Nexon) story character table */
export type IndexScenarioCharacterDataEntry = {
  CharacterName: number;
  SmallPortrait: string;
  Name: NexonL10nData;
  NickName: NexonL10nData;
}
export type IndexScenarioCharacterData = {
  [key: string]: IndexScenarioCharacterDataEntry
}

/* Story Info => BOI I18n (index_scenario_i18n_event/main.json) */
export type IndexScenarioInfoToI18nId = {
  [key: string]: string[]
}

/* 故事目录结构信息 (index_scenario_manifest_main/event.json) */
export type IndexManifestScenarioEntry_BaseType = {
  id: string;
  name: string;
  desc: string;
}
export type IndexManifestScenarioChildEntry = IndexManifestScenarioEntry_BaseType & {
  type: 'child';
  data: number[]
}
export type IndexManifestScenarioParentEntry = IndexManifestScenarioEntry_BaseType & {
  type: 'parent';
  data: IndexManifestScenarioChildEntry[]
}
export type IndexManifestScenarioEntry = IndexManifestScenarioParentEntry | IndexManifestScenarioChildEntry
export type IndexManifestScenarioEntryType = IndexManifestScenarioEntry['type']

export type IndexManifestScenarioData = {
  main: IndexManifestScenarioParentEntry[]; side: IndexManifestScenarioChildEntry[];
  short: IndexManifestScenarioChildEntry[]; other: IndexManifestScenarioChildEntry[];
}

/* 学生索引表（简单） */
export type StudentInfoDataSimpleEntry = {
  Id: number;
  FamilyName: SchaleDbL10nData;
  Name: SchaleDbL10nData;
  School: string;
  Club: string;
}
export type StudentInfoDataSimple = {
  [stuId: string]: StudentInfoDataSimpleEntry
}

/* 学生详细信息 */
export type SchaleDbStuInfoFullVoicelineEntry = {
  Group: string;
  Transcription: SchaleDbL10nData;
}
export type SchaleDbStuInfoFullVoicelineCategory = 'Normal' | 'Lobby' | 'Event' | 'Battle'
export const SchaleDbStuInfoFullVoicelineCategory: SchaleDbStuInfoFullVoicelineCategory[] = ['Normal', 'Lobby', 'Battle', 'Event']
export type SchaleDbStuInfoFullVoiceline = Record<SchaleDbStuInfoFullVoicelineCategory, SchaleDbStuInfoFullVoicelineEntry[]>
export type SchaleDbStuInfoFull = {
  Id: number;
  School: string;
  Club: string;
  StatusMessage: SchaleDbL10nData;
  Hobby: SchaleDbL10nData;
  WeaponName: SchaleDbL10nData;
  WeaponDesc: SchaleDbL10nData;
  Profile: SchaleDbL10nData;
  CharacterSSRNew: SchaleDbL10nData;
  Voicelines: SchaleDbStuInfoFullVoiceline;
  FamilyName: SchaleDbL10nData;
  Name: SchaleDbL10nData;
}

/* index_related_manifest_parent.json 父项信息 */
export type RelatedScenarioParentInfoDataEntry = [number, number]
export type RelatedScenarioParentInfoData = Record<string, RelatedScenarioParentInfoDataEntry>

/* index_related_manifest_scenario.json Scenario->父项信息 */
export type RelatedScenarioInfoDataEntryMain = [
  [null | number, null | number], // 上一故事ID，下一故事ID
  number,                         // 当前故事pos 0-indexed
  [string, string]                // 父项信息key
]
export type RelatedScenarioInfoDataEntryEvent = [
  [null | number, null | number], // 上一故事ID，下一故事ID
  number,                         // 当前故事pos 0-indexed
  [string]                        // 父项信息key [活动ID]
]
export type RelatedScenarioInfoDataEntryBond = [
  [null | number, null | number], // 上一故事ID，下一故事ID
  number,                         // 当前故事pos 0-indexed
  [string]                        // 父项信息key [人物ID]
]
export type RelatedScenarioInfoDataEntry =
  RelatedScenarioInfoDataEntryMain
  | RelatedScenarioInfoDataEntryEvent
  | RelatedScenarioInfoDataEntryBond

export type RelatedScenarioInfoData = {
  main: Record<string, RelatedScenarioInfoDataEntryMain>,
  bond: Record<string, RelatedScenarioInfoDataEntryBond>,
  event: Record<string, RelatedScenarioInfoDataEntryEvent>,
}
