import { defineStore } from 'pinia'
import { convertLangToNormal, getUserLang } from '@/tool/BrowserTool'
import {
  defaultLangForNexonL10nLang,
  paginationScenarioControl,
  type SiteUiLang
} from '@/tool/Constant'
import type { CharVoiceUiDataSource } from '@/types/CharVoiceComp'
import type { NexonL10nDataLangOfUi } from '@/types/OutsourcedData'
import type { MtServiceName } from '@/tool/translate/MtDispatcher'

export const useSetting = defineStore('setting', {
  state: () => {
    const uiLang = convertLangToNormal(getUserLang())
    const defaultLang = defaultLangForNexonL10nLang[uiLang]

    return {
      username: 'Sensei',

      ui_lang: uiLang as SiteUiLang,
      ui_force_mobile: false,
      ui_show_char_icon: true,

      char_voice_data_source: 'nexon' as CharVoiceUiDataSource,
      show_lang_zh: false,
      show_story_desc: true,

      i18n_lang1: defaultLang[0] as NexonL10nDataLangOfUi,
      i18n_lang2: defaultLang[1] as NexonL10nDataLangOfUi,
      i18n_lang3: defaultLang[2] as NexonL10nDataLangOfUi,
      i18n_lang4: defaultLang[3] as NexonL10nDataLangOfUi,
      i18n_lang5: defaultLang[4] as NexonL10nDataLangOfUi,

      auto_i18n_service: 'google' as MtServiceName,
      auto_i18n_lang: 'en',
      auto_i18n_showauto: false,

      scenario_pagination_perPage: paginationScenarioControl.perPageDefault,
      scenario_display_mode: 1,

      temp: 'get_this_done'
    }
  },
  actions: {
    forcePersist() {
      this.temp = 'force_persist_update'
    },
    init_watcher() {}
  },

  persist: true
})
