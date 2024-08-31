<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { NexonLangMap } from '@/tool/Constant'
import { defineProps, type PropType, type Ref, ref, watch } from 'vue'
import type { NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'

const props = defineProps({
  data_no: {
    type: Number,
    required: true
  },
  data_mmtid: {
    type: Number,
    required: true
  },
  data_l10n: {
    type: {} as PropType<NexonL10nData>,
    required: true
  }
})

const setting = useSetting()

const i18nL1: Ref<NexonL10nDataLang> = ref(setting.i18n_lang1 as NexonL10nDataLang)
const i18nL2: Ref<NexonL10nDataLang> = ref(setting.i18n_lang2 as NexonL10nDataLang)
const i18nL3: Ref<NexonL10nDataLang> = ref(setting.i18n_lang3 as NexonL10nDataLang)

const langL1: Ref<string> = ref(NexonLangMap[i18nL1.value])
const langL2: Ref<string> = ref(NexonLangMap[i18nL2.value])
const langL3: Ref<string> = ref(NexonLangMap[i18nL3.value])

watch(
  () => {
    return [setting.i18n_lang1, setting.i18n_lang2, setting.i18n_lang3]
  },
  () => {
    i18nL1.value = setting.i18n_lang1 as NexonL10nDataLang
    i18nL2.value = setting.i18n_lang2 as NexonL10nDataLang
    i18nL3.value = setting.i18n_lang3 as NexonL10nDataLang
    langL1.value = NexonLangMap[i18nL1.value]
    langL2.value = NexonLangMap[i18nL2.value]
    langL3.value = NexonLangMap[i18nL3.value]
  },
  {immediate: true}
)
</script>

<template>
  <el-tag type="warning">{{ data_mmtid }}</el-tag>
  <span>&nbsp;&nbsp;</span>
  <span>
    <span>{{ data_no + 1 }}.&nbsp;</span>
    <span :lang="langL1">{{ data_l10n[i18nL1] }}</span>
    <span>&nbsp;/&nbsp;</span>
    <span :lang="langL2">{{ data_l10n[i18nL2] }}</span>
    <span>&nbsp;/&nbsp;</span>
    <span :lang="langL3">{{ data_l10n[i18nL3] }}</span>
  </span>
</template>