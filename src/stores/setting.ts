import { watch } from 'vue'
import { defineStore } from 'pinia'
import { getUserLang, convertLangToNormal } from '../tool/BrowserTool'
import { paginationScenarioControl } from '@/tool/Constant'


export const useSetting = defineStore('setting', {
  state: () => {
    return {
      'username': 'Sensei',
      'ui_lang': convertLangToNormal(getUserLang()),
      'ui_force_mobile': false,
      'ui_show_char_icon': true,
      'i18n_lang1': 'j_ja',
      'i18n_lang2': 'null',
      'i18n_lang3': 'null',
      'auto_i18n_service': 'google',
      'auto_i18n_lang': 'en',
      'auto_i18n_showauto': false,
      'scenario_pagination_perPage': paginationScenarioControl.perPageDefault,
      'temp': 'get_this_done'
    }
  },
  actions: {
    forcePersist() {
      this.temp = 'force_persist_update'
    },
    init_watcher() {

    }
  },

  persist: true
})