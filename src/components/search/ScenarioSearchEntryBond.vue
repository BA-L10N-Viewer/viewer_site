<script setup lang="ts">
import { computed, defineProps, type PropType } from 'vue'
import MomotalkHeader from '@/components/momotalk/MomotalkHeader.vue'
import type { I18nBondInfoDataEntry, NexonL10nData } from '@/types/OutsourcedData'

const props = defineProps({
  data: {
    type: {} as PropType<{ id: number; data: I18nBondInfoDataEntry }>,
    required: true
  },
  dataMt: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  data_no: {
    type: Number,
    required: true
  },
  char_id: {
    type: String,
    required: true
  },
  isL2d: {
    type: Boolean,
    required: true
  }
})
const mmtId = computed(() => props.data.id)
</script>

<template>
  <h3>
    <MomotalkHeader
      :data_mmtid="data.id"
      :data_no="data_no - 1"
      :data_l10n="data.data[0]"
      :data_l10n_mt="dataMt"
      :is_l2d="isL2d"
    />
  </h3>
  <ul>
    <li>
      {{ $t('comp-search-result-entry-bond-preposition') }}
      <RouterLink :to="`/momotalk/${char_id}#story-${data_no}`">{{
        $t('comp-search-result-entry-bond-mmt')
      }}</RouterLink>
    </li>
    <li>
      {{ $t('comp-search-result-entry-bond-preposition') }}
      <RouterLink :to="`/scenario/${mmtId}`">{{
        $t('comp-search-result-entry-bond-story')
      }}</RouterLink>
    </li>
  </ul>
</template>

<style scoped></style>
