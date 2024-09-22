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
      'i18n_lang1': 'j_ja',
      'i18n_lang2': 'null',
      'i18n_lang3': 'null',
      'auto_i18n_service': 'google',
      'auto_i18n_lang': 'en',
      'auto_i18n_showauto': false,
      'auto_i18n_showboth': true,
      'scenario_pagination_perPage': paginationScenarioControl.perPageDefault,
      'temp': 'get_this_done'
    }
  },
  actions: {
    forcePersist() {
      this.temp = 'force_persist_update'
    },
    init_watcher() {
      watch(() => {
          return useSetting().auto_i18n_showauto
        },
        () => {
          useSetting().auto_i18n_showboth = !useSetting().auto_i18n_showauto
        },
        {
          immediate: true
        }
      )
      watch(() => {
          return useSetting().auto_i18n_showboth
        },
        () => {
          useSetting().auto_i18n_showauto = !useSetting().auto_i18n_showboth
        },
        {
          immediate: true
        }
      )
    }
  },

  persist: true
})