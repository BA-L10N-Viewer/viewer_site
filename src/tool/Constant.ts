import type { NexonL10nData, SchaleDbL10nDataLang } from '@/types/OutsourcedData'
import type { MtServiceName } from '@/tool/translate/MtDispatcher'
import type { CharVoiceUiDataSource, CharVoiceUiTabAvailabilityList, CharVoiceUiTabName } from '@/types/CharVoiceComp'
import type { NexonCharVoiceEventTranscriptionType } from '@/types/OutsourcedDataVoice'

export const MOBILE_WIDTH = 800
export const MOBILE_WIDTH_WIDER = 1200
export const SITE_VERSION = '20240727'

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

export const NexonLangMap: Record<string, string> = {
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
  'null': ''
}

export const selectAutoTranslateService: { value: MtServiceName, label: string }[] = [
  { value: 'google', label: 'i18n-setting-google' }
  // { value: 'deepl', label: 'i18n-setting-deepl' } // disabled for rate limit
]

export const selectCharVoiceDataSource: { value: CharVoiceUiDataSource, label: string }[] = [
  { value: 'nexon', label: 'char-voice-ui-select-source-nexon' },
  { value: 'schaledb', label: 'char-voice-ui-select-source-schaledb' }
]

export const selectCharVoiceCurrTabName: CharVoiceUiTabAvailabilityList = [
  { value: 'Normal', label: 'char-voice-ui-select-tab-normal', disabled: false },
  { value: 'Lobby', label: 'char-voice-ui-select-tab-lobby', disabled: false },
  { value: 'Battle', label: 'char-voice-ui-select-tab-battle', disabled: false },
  { value: 'Event', label: 'char-voice-ui-select-tab-event', disabled: false }
]

export const selectCharVoiceEventDisplayMode: { value: NexonCharVoiceEventTranscriptionType, label: string }[] = [
  { value: 'FirstTime', label: 'char-voice-ui-checkbox-event-firsttime' },
  { value: 'Rerun', label: 'char-voice-ui-checkbox-event-rerun' },
  { value: 'Immortalized', label: 'char-voice-ui-checkbox-event-immortalized' }
]

export const autoTranslateLanguage = [
  { value: 'en', label: 'i18n-setting-lang-en' },
  { value: 'ja', label: 'i18n-setting-lang-ja' },
  { value: 'ko', label: 'i18n-setting-lang-ko' },
  { value: 'th', label: 'i18n-setting-lang-th' },
  { value: 'zh_CN', label: 'i18n-setting-lang-zh-cn' },
  { value: 'zh_TW', label: 'i18n-setting-lang-zh-tw' },
  { value: 'fr', label: 'i18n-setting-lang-fr' },
  { value: 'de', label: 'i18n-setting-lang-de' },
  { value: 'it', label: 'i18n-setting-lang-it' },
  { value: 'ru', label: 'i18n-setting-lang-ru' },
  { value: 'pt', label: 'i18n-setting-lang-pt' },
  { value: 'vi', label: 'i18n-setting-lang-vi' },
  { value: 'pt-PT', label: 'i18n-setting-lang-pt-PT' }
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

export const NexonLangMapReverse: { [k: string]: string[] } = {
  'en': ['g_en'],
  'zh_TW': ['g_tw', 'c_zh', 'c_cn_tw'],
  'zh_CN': ['c_zh', 'g_tw_cn', 'c_cn'],
  'ja': ['j_ja'],
  'ko': ['j_ko'],
  'th': ['g_th']
}

export const SchaleDbLangMap: Record<SchaleDbL10nDataLang, string> = {
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
  'c_zh_tw': 'zh_TW'
}

export const siteUiLangSelect = [
  { label: 'Chinese Simp. / 中文(简体)', value: 'zh_CN' },
  { label: 'Chinese Trad. / 中文(繁体)', value: 'zh_TW' },
  { label: 'English', value: 'en' }
]

export function getNexonI18nDataDefault(text: string = '[NO DATA]'): NexonL10nData {
  const temp: NexonL10nData = {
    j_ja: text, j_ko: text,
    g_ja: text, g_ko: text, g_tw: text, g_tw_cn: text, g_th: text, g_en: text,
    c_cn: text, c_cn_tw: text
  }
  return temp
}

export const paginationScenarioControl = {
  perPage: [20, 50, 100, 150],
  perPageDefault: 20
}

export const i18nDesktopLoopIdx = [0, 1, 2]
export const i18nMobileLoopIdx = [0, 1, 2, 3, 4]
