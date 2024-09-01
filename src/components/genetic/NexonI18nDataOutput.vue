<script setup lang="ts">
import { defineProps, type PropType, ref, type Ref, watch } from 'vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { useSetting } from '@/stores/setting'
import type { NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'

const props = defineProps({
  data: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  htmlElementName: {
    type: String,
    default: 'span'
  }
})

const setting = useSetting()

const i18nL1: Ref<NexonL10nDataLang> = ref('' as NexonL10nDataLang)
const i18nL2: Ref<NexonL10nDataLang> = ref('' as NexonL10nDataLang)
const i18nL3: Ref<NexonL10nDataLang> = ref('' as NexonL10nDataLang)

const langL1: Ref<string> = ref('')
const langL2: Ref<string> = ref('')
const langL3: Ref<string> = ref('')

watch(
  () => {
    return [setting.i18n_lang1, setting.i18n_lang2, setting.i18n_lang3]
  },
  () => {
    const i18nAll = i18nLangAll.value
    i18nL1.value = i18nAll[0] as NexonL10nDataLang
    i18nL2.value = i18nAll[1] as NexonL10nDataLang
    i18nL3.value = i18nAll[2] as NexonL10nDataLang

    const langAll = i18nToUiLangAll.value
    langL1.value = langAll[0]
    langL2.value = langAll[1]
    langL3.value = langAll[2]
  },
  {immediate: true}
)
</script>

<template>
  <span :lang="langL1" v-if="htmlElementName === 'span'">{{ data[i18nL1] }}</span>
  <span v-if="htmlElementName === 'span'">&nbsp;/&nbsp;</span>
  <span :lang="langL2" v-if="htmlElementName === 'span'">{{ data[i18nL2] }}</span>
  <span v-if="htmlElementName === 'span'">&nbsp;/&nbsp;</span>
  <span :lang="langL3" v-if="htmlElementName === 'span'">{{ data[i18nL3] }}</span>

  <li :lang="langL1" v-if="htmlElementName === 'li'">{{ data[i18nL1] }}</li>
  <li :lang="langL2" v-if="htmlElementName === 'li'">{{ data[i18nL2] }}</li>
  <li :lang="langL3" v-if="htmlElementName === 'li'">{{ data[i18nL3] }}</li>
</template>

<style scoped>

</style>