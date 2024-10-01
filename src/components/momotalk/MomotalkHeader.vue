<script setup lang="ts">
import { defineProps, type PropType } from 'vue'
import type { NexonL10nData } from '@/types/OutsourcedData'
import { i18nLangAll, i18nToUiLangAll } from '../../tool/ConstantComputed'

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
</script>

<template>
  <el-tag type="warning">{{ data_mmtid }}</el-tag>
  <span>&nbsp;&nbsp;</span>
  <span>
    <span>{{ data_no + 1 }}.&nbsp;</span>
    <span :lang="i18nToUiLangAll[0]">{{ data_l10n[i18nLangAll[0]] }}</span>
    <span>&nbsp;/&nbsp;</span>
    <span :lang="i18nToUiLangAll[1]">{{ data_l10n[i18nLangAll[1]] }}</span>
    <span>&nbsp;/&nbsp;</span>
    <span :lang="i18nToUiLangAll[2]">{{ data_l10n[i18nLangAll[2]] }}</span>
  </span>
</template>