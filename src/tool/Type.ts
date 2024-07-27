export type ElementPlusTree = {
  label: string
  children?: ElementPlusTree[]
}

export type NexonI18nData = {
  j_ja: string,
  j_ko: string,
  g_ja?: string,
  g_ko?: string,
  g_tw?: string,
  g_tw_cn?: string,
  g_th?: string,
  g_en?: string
  c_cn?: string
  c_cn_tw?: string
}

export type SchaleDbI18nData = {
  j_ja: string,
  j_ko: string,
  g_ja: string,
  g_ko: string,
  g_tw: string,
  g_tw_cn: string,
  g_th: string,
  g_en: string
  c_cn: string
  c_cn_tw: string
  c_zh: string,
  c_zh_tw: string
}

export type NexonMomotalkDialogue = {
  GroupId: number,
  Id: number,
  CharacterId: number,
  MessageCondition: string,
  FavorScheduleId: number,
  NextGroupId: number,
  MessageBgColor: string
  Message: NexonI18nData
}

export type NexonMomotalkData = {
  BondScenarioId: number,
  Data: [NexonMomotalkDialogue],
}