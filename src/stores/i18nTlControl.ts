import { defineStore } from 'pinia'

export const useI18nTlControl = defineStore('I18nTlControl', {
  state: () => {
    return {
      'i18n_l1': 'init',
      'i18n_l2': 'init',
      'i18n_l3': 'init',
    }
  },
  actions: {
    /* 源文本语言切换/重新翻译 */
    setStatusTranslate(id: string) {
      const status = `t,${new Date()}`

      if (id === 'i18n_l1') {
        this.i18n_l1 = status
      }
      else if (id === 'i18n_l2') {
        this.i18n_l2 = status
      }
      else if (id === 'i18n_l3') {
        this.i18n_l3 = status
      } else throw new Error('Invalid variable id ' + id)
    },
    setStatusClear(id: string) {
      const status = `c,${new Date()}`

      if (id === 'i18n_l1') {
        this.i18n_l1 = status
      }
      else if (id === 'i18n_l2') {
        this.i18n_l2 = status
      }
      else if (id === 'i18n_l3') {
        this.i18n_l3 = status
      } else throw new Error('Invalid variable id')
    },
    setStatusToComplete(id: string) {
      const status = `f,${new Date()}`

      if (id === 'i18n_l1') {
        this.i18n_l1 = status
      }
      else if (id === 'i18n_l2') {
        this.i18n_l2 = status
      }
      else if (id === 'i18n_l3') {
        this.i18n_l3 = status
      } else throw new Error('Invalid variable id')
    },
    initAll() {
      this.i18n_l1 = 'init'
      this.i18n_l2 = 'init'
      this.i18n_l3 = 'init'
    }
  }
})
