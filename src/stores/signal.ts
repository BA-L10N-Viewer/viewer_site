import { defineStore } from 'pinia'
import { convertLangToNormal, getUserLang } from '@/tool/BrowserTool'

export const useSignalI18n = defineStore('signalI18n', {
  state: () => {
    return {
      'reset_i18n_all': false,
    }
  },
})