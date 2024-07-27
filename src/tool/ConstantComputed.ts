import { useSetting } from '@/stores/setting'
import { computed, ref, type Ref } from 'vue'
import { NexonLangMap } from '@/tool/Constant'


export const i18nLangAll = computed(
  (): [String, String, String] => {
    const setting = useSetting()
    const i18nL1 = setting.i18n_lang1
    const i18nL2 = setting.i18n_lang2
    const i18nL3 = setting.i18n_lang3
    return [i18nL1, i18nL2, i18nL3]
  }
)

export const i18nToUiLangAll = computed(
  (): [String, String, String] => {
    const setting = useSetting()
    const langL1 = NexonLangMap[setting.i18n_lang1]
    const langL2 = NexonLangMap[setting.i18n_lang2]
    const langL3 = NexonLangMap[setting.i18n_lang3]
    return [langL1, langL2, langL3]
  }
)

