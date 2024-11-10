<script setup lang="ts">
import { defineProps, type PropType } from 'vue'
import {
  i18nLangAll,
  i18nToUiLangAll,
  listOfPosOfSelectedLangForMobile
} from '@/tool/ConstantComputed'
import type { NexonL10nData } from '@/types/OutsourcedData'

const props = defineProps({
  data: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  htmlElementName: {
    type: String,
    default: 'span'
  },
  linesForTextLineClamp: {
    type: Number,
    default: 4
  },
  enableTextLineClamp: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <template v-if="htmlElementName === 'span'">
    <template v-for="(langIdx, idx) in listOfPosOfSelectedLangForMobile" :key="idx">
      <template v-if="i18nLangAll[langIdx] as string !== 'null'">
        <span :lang="i18nToUiLangAll[langIdx]"
              :class="{'clamped-text': enableTextLineClamp}">
          {{ data[i18nLangAll[langIdx]] }}
        </span>
        <span v-if="idx + 1 < listOfPosOfSelectedLangForMobile.length">&nbsp;/&nbsp;</span>
      </template>

    </template>
  </template>

  <template v-if="htmlElementName === 'li'">
    <template v-for="(langIdx, idx) in listOfPosOfSelectedLangForMobile" :key="idx">
      <template v-if="i18nLangAll[langIdx] as string !== 'null'">
        <li :lang="i18nToUiLangAll[langIdx]">
          <span :class="{'clamped-text': enableTextLineClamp}">{{ data[i18nLangAll[langIdx]] }}</span>
        </li>
      </template>
    </template>
  </template>
</template>

<style scoped>
span {
  display: inline-block;
}

.clamped-text {
  display: -webkit-box;
  line-clamp: v-bind(linesForTextLineClamp);
  -webkit-line-clamp: v-bind(linesForTextLineClamp);
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>