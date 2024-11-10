<script setup lang="ts">
import { i18nDesktopLoopIdx } from '@/tool/Constant'
import { defineProps, type PropType } from 'vue'
import type { NexonL10nData } from '@/types/OutsourcedData'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'

import PvTag from 'primevue/tag'


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
  <PvTag severity="warn">{{ data_mmtid }}</PvTag>
  <span>&nbsp;&nbsp;</span>
  <span>
    <span>{{ data_no + 1 }}.&nbsp;</span>
    <template v-for="idx in i18nDesktopLoopIdx" :key="idx">
      <template v-if="i18nLangAll[idx] as string !== 'null'">
        <span :lang="i18nToUiLangAll[idx]">{{ data_l10n[i18nLangAll[idx]] }}</span>
        <span v-if="idx + 1 < i18nDesktopLoopIdx.length">&nbsp;/&nbsp;</span>
      </template>
    </template>
  </span>
</template>