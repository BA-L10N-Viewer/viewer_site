<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { NexonLangMap } from '@/tool/Constant'
import type { NexonI18nData, NexonMomotalkData } from '@/tool/Type'
import { httpGetBlocking } from '@/tool/HttpRequest'
import { type Ref, ref, watch } from 'vue'

const setting = useSetting()

const i18nL1: Ref = ref(setting.i18n_lang1)
const i18nL2: Ref = ref(setting.i18n_lang2)
const i18nL3: Ref = ref(setting.i18n_lang3)

const langL1: Ref = ref(NexonLangMap[i18nL1.value])
const langL2: Ref = ref(NexonLangMap[i18nL2.value])
const langL3: Ref = ref(NexonLangMap[i18nL3.value])

watch(
  () => {
    return [setting.i18n_lang1, setting.i18n_lang2, setting.i18n_lang3]
  },
  () => {
    i18nL1.value = setting.i18n_lang1
    i18nL2.value = setting.i18n_lang2
    i18nL3.value = setting.i18n_lang3
    langL1.value = NexonLangMap[i18nL1.value]
    langL2.value = NexonLangMap[i18nL2.value]
    langL3.value = NexonLangMap[i18nL3.value]
  },
  {immediate: true}
)

const mmtI18nData: { number: [NexonI18nData] } = JSON.parse(httpGetBlocking(`/data/story/i18n/i18n_bond.json`))
</script>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    'data_no': {
      type: Number,
      required: true
    },
    'data_mmtid': {
      type: Number,
      required: true
    }
  }
})
</script>

<template>
  <el-tag type="warning">{{ data_mmtid }}</el-tag>
  <span>&nbsp;&nbsp;</span>
  <span>
    <span>{{ data_no + 1 }}.&nbsp;</span>
    <span :lang="langL1">{{ mmtI18nData[data_mmtid][0][i18nL1] }}</span>
    <span>&nbsp;/&nbsp;</span>
    <span :lang="langL2">{{ mmtI18nData[data_mmtid][0][i18nL2] }}</span>
    <span>&nbsp;/&nbsp;</span>
    <span :lang="langL3">{{ mmtI18nData[data_mmtid][0][i18nL3] }}</span>
  </span>
</template>