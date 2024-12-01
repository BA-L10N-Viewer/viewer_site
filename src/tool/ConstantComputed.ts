import { useSetting } from '@/stores/setting'
import { computed, type ComputedRef } from 'vue'
import { i18nDesktopLoopIdx, NexonLangMap } from '@/tool/Constant'
import type { NexonL10nDataLang } from '@/types/OutsourcedData'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import { range } from 'lodash'


export const i18nLangAll = computed(
  () => {
    const setting = useSetting()
    const i18nL1 = setting.i18n_lang1 as NexonL10nDataLang
    const i18nL2 = setting.i18n_lang2 as NexonL10nDataLang
    const i18nL3 = setting.i18n_lang3 as NexonL10nDataLang
    const i18nL4 = setting.i18n_lang4 as NexonL10nDataLang
    const i18nL5 = setting.i18n_lang5 as NexonL10nDataLang
    return [i18nL1, i18nL2, i18nL3, i18nL4, i18nL5]
  }
)

export const i18nToUiLangAll = computed(
  () => {
    const setting = useSetting()
    const langL1 = NexonLangMap[setting.i18n_lang1]
    const langL2 = NexonLangMap[setting.i18n_lang2]
    const langL3 = NexonLangMap[setting.i18n_lang3]
    const langL4 = NexonLangMap[setting.i18n_lang4]
    const langL5 = NexonLangMap[setting.i18n_lang5]
    return [langL1, langL2, langL3, langL4, langL5]
  }
)

export const numberOfSelectedLangForDesktop = computed(() => {
  let count = 0
  for (const idx of i18nDesktopLoopIdx) {
    if (i18nLangAll.value[idx] as string !== 'null') {
      count += 1
    }
  }
  return count
})

export const numberOfSelectedLangForMobile = computed(() => {
  let count = 0
  for (const idx of range(0, 5)) {
    if (i18nLangAll.value[idx] as string !== 'null') {
      count += 1
    }
  }
  return count
})

export const listOfPosOfSelectedLangForMobile = computed(() => {
  const pos: number[] = []
  for (const idx of range(0, 5)) {
    if (i18nLangAll.value[idx] as string !== 'null') {
      pos.push(idx)
    }
  }
  return pos
})

export const langsOfSelectedLangForMobile = computed(() => {
  const lang: NexonL10nDataLang[] = []
  for (const pos of listOfPosOfSelectedLangForMobile.value)
    lang.push(i18nLangAll.value[pos])
  return lang
})

export const mtI18nLangStats: ComputedRef<[string, string, string, string, string]> = computed(() => {
  const mtPinia = useI18nTlControl()
  return [mtPinia.i18n_l1, mtPinia.i18n_l2, mtPinia.i18n_l3,
    mtPinia.i18n_l4, mtPinia.i18n_l5]
})
