import { defineStore } from 'pinia'

export const useI18nTlControl = defineStore('I18nTlControl', {
  state: () => {
    return {
      'i18n_l1': 'init',
      'i18n_l2': 'init',
      'i18n_l3': 'init',
      'i18n_l4': 'init',
      'i18n_l5': 'init'
    }
  },
  actions: {
    /* 源文本语言切换/重新翻译 */
    setStatusTranslate(id: string) {
      const status = `t,${new Date()}`
      this._setStatus(id, status)
    },
    setStatusClear(id: string) {
      const status = `c,${new Date()}`
      this._setStatus(id, status)
    },
    setStatusToComplete(id: string) {
      const status = `f,${new Date()}`
      this._setStatus(id, status)
    },
    _setStatus(id: string, status: string) {
      if (id === 'i18n_l1')
        this.i18n_l1 = status
      else if (id === 'i18n_l2')
        this.i18n_l2 = status
      else if (id === 'i18n_l3')
        this.i18n_l3 = status
      else if (id === 'i18n_l4')
        this.i18n_l4 = status
      else if (id === 'i18n_l5')
        this.i18n_l5 = status
      else throw new Error('Invalid variable id')
    },
    initAll() {
      this.i18n_l1 = 'init'
      this.i18n_l2 = 'init'
      this.i18n_l3 = 'init'
      this.i18n_l4 = 'init'
      this.i18n_l5 = 'init'
    }
  }
})
