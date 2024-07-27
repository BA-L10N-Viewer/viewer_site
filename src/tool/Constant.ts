import type { NexonI18nData } from '@/tool/Type'

export const MOBILE_WIDTH = 800
export const MOBILE_WIDTH_WIDER = 1200
export const SITE_VERSION = "20240727"

export const searchCascaderModeOptions = [
  {
    value: 'story', label: 'Story', children: []
  },
  { value: 'mmt', label: 'Momotalk', children: [] },
  {
    value: 'reverse', label: 'Reverse Search', disabled: true, children: [
      { value: 'track', label: 'Track', children: [] },
      { value: 'character', label: 'Character', children: [] },
      { value: 'background', label: 'Background', children: [] }
    ]
  }
]

interface Dictionary<T> {
  [key: string]: T;
}

export const NexonLangMap: Dictionary<string> = {
  'g_en': 'en',
  'g_tw': 'zh_TW',
  'g_ko': 'ko',
  'g_ja': 'ja',
  'g_th': 'th',
  'j_ja': 'ja',
  'j_ko': 'ko',
  'c_cn': 'zh_CN',
  'g_tw_cn': 'zh_CN',
  'c_cn_tw': 'zh_TW'
}

export const autoTranslateService = [
  { value: 'google', label: 'i18n-setting-google' },
  { value: 'deepl', label: 'i18n-setting-deepl' }
]

export const autoTranslateLanguage = [
  { value: 'en', label: 'i18n-setting-lang-en' },
  { value: 'ja', label: 'i18n-setting-lang-ja' },
  { value: 'zh_CN', label: 'i18n-setting-lang-zh-cn' },
  { value: 'zh_TW', label: 'i18n-setting-lang-zh-tw' }
]

export const nexonDataLangSelect = [
  { value: 'null', label: 'i18n-nexon-null' },
  { value: 'j_ja', label: 'i18n-nexon-j-ja' },
  { value: 'j_ko', label: 'i18n-nexon-j-ko' },
  { value: 'g_ja', label: 'i18n-nexon-g-ja' },
  { value: 'g_ko', label: 'i18n-nexon-g-ko' },
  { value: 'g_en', label: 'i18n-nexon-g-en' },
  { value: 'g_th', label: 'i18n-nexon-g-th' },
  { value: 'g_tw', label: 'i18n-nexon-g-tw' },
  { value: 'g_tw_cn', label: 'i18n-nexon-g-tw-cn' },
  { value: 'c_cn', label: 'i18n-nexon-c-cn' },
  { value: 'c_cn_tw', label: 'i18n-nexon-c-cn-tw' }
]

export const NexonLangMapReverse: Dictionary<String[]> = {
  'en': ['g_en'],
  'zh_TW': ['g_tw', 'c_zh', 'c_cn_tw'],
  'zh_CN': ['c_zh', 'g_tw_cn', 'c_cn'],
  'ja': ['j_ja'],
  'ko': ['j_ko'],
  'th': ['g_th']
}

export const SchaleDbLangMap: Dictionary<string> = {
  'g_en': 'en',
  'g_tw': 'zh_TW',
  'g_ko': 'ko',
  'g_ja': 'ja',
  'g_th': 'th',
  'j_ja': 'ja',
  'j_ko': 'ko',
  'c_cn': 'zh_CN',
  'g_tw_cn': 'zh_CN',
  'c_cn_tw': 'zh_TW',
  'c_zh': 'zh_CN',
  'c_zh_TW': 'zh_TW'
}

export const siteUiLangSelect = [
  {label: "Chinese Simp. / 中文(简体)", value: "zh_CN"},
  {label: "Chinese Trad. / 中文(繁体)", value: "zh_TW"},
  {label: "English", value: "en"}
]

export function getNexonI18nDataDefault(text: string = '[NO DATA]'): NexonI18nData {
  const temp: NexonI18nData = {
    j_ja: text, j_ko: text,
    g_ja: text, g_ko: text, g_tw: text, g_tw_cn: text, g_th: text, g_en: text,
    c_cn: text, c_cn_tw: text
  }
  return temp
}
