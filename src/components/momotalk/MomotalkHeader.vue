<script setup lang="ts">
import { defineProps, type PropType } from 'vue'
import type { NexonL10nData } from '@/types/OutsourcedData'

import PvTag from 'primevue/tag'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'

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
  },
  data_l10n_mt: {
    type: {} as PropType<NexonL10nData>,
    default: {
      j_ja: '',
      j_ko: '',
      g_ja: '',
      g_ko: '',
      g_en: '',
      g_th: '',
      g_tw: '',
      g_tw_cn: '',
      c_cn: '',
      c_cn_tw: '',
      c_zh: '',
      c_zh_tw: ''
    }
  },
  is_l2d: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <PvTag severity="warn">{{ data_mmtid }}</PvTag>
  <span>&nbsp;&nbsp;</span>
  <span :style="is_l2d ? `color: var(--color-ba-mmt)` : ``">
    <span>{{ data_no + 1 }}.&nbsp;</span>
    <span><NexonI18nDataOutput :data="data_l10n" :data-mt="data_l10n_mt" /></span>
  </span>
</template>
