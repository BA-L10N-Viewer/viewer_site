import { defineStore } from 'pinia'

export const useSearchVars = defineStore('search', {
  state: () => {
    return {
      s_cascaderMode: [],
      n_selectType: '',
      n_selectEventName: '',
      n_selectBondChar: '',
      n_selectMainVolume: '',
      n_selectMainChapter: '',
      m_inputQuery: ''
    }
  },
  actions: {
    setSearchModeVars(cascaderMode: []): void {
      this.s_cascaderMode = cascaderMode
    },
    setNormalSearchVars(
      selectType: string,
      selectEventName: string,
      selectBondChar: string,
      selectMainVolume: string,
      selectMainChapter: string
    ): void {
      this.n_selectType = selectType
      this.n_selectEventName = selectEventName
      this.n_selectBondChar = selectBondChar
      this.n_selectMainVolume = selectMainVolume
      this.n_selectMainChapter = selectMainChapter
    },
    setMomotalkSearchVars(inputQuery: string): void {
      this.m_inputQuery = inputQuery
    },
    clear(): void {
      this.s_cascaderMode = []
      this.n_selectType = ''
      this.n_selectEventName = ''
      this.n_selectBondChar = ''
      this.n_selectMainVolume = ''
      this.n_selectMainChapter = ''
      this.m_inputQuery = ''
    }
  }
})
