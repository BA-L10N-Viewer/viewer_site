<script setup lang="ts">
import { defineProps, type PropType } from 'vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import type { NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'

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
  <span :lang="i18nToUiLangAll[0]"
        :class="{'clamped-text': enableTextLineClamp}"
        v-if="htmlElementName === 'span'">{{ data[i18nLangAll[0] as NexonL10nDataLang] }}</span>
  <span v-if="htmlElementName === 'span'">&nbsp;/&nbsp;</span>
  <span :lang="i18nToUiLangAll[1]"
        :class="{'clamped-text': enableTextLineClamp}"
        v-if="htmlElementName === 'span'">{{ data[i18nLangAll[1] as NexonL10nDataLang] }}</span>
  <span v-if="htmlElementName === 'span'">&nbsp;/&nbsp;</span>
  <span :lang="i18nToUiLangAll[2]"
        :class="{'clamped-text': enableTextLineClamp}"
        v-if="htmlElementName === 'span'">{{ data[i18nLangAll[2] as NexonL10nDataLang] }}</span>

  <li :lang="i18nToUiLangAll[0]"
      v-if="htmlElementName === 'li'">
    <span :class="{'clamped-text': enableTextLineClamp}">{{ data[i18nLangAll[0] as NexonL10nDataLang] }}</span>
  </li>
  <li :lang="i18nToUiLangAll[1]"
      v-if="htmlElementName === 'li'">
    <span :class="{'clamped-text': enableTextLineClamp}">{{ data[i18nLangAll[1] as NexonL10nDataLang] }}</span>
  </li>
  <li :lang="i18nToUiLangAll[2]"
      v-if="htmlElementName === 'li'">
    <span :class="{'clamped-text': enableTextLineClamp}">{{ data[i18nLangAll[2] as NexonL10nDataLang] }}</span>
  </li>
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