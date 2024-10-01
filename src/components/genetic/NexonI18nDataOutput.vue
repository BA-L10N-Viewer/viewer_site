<script setup lang="ts">
import { defineProps, type PropType } from 'vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import type { NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'
import { i18nDesktopLoopIdx } from '@/tool/Constant'

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
    <template v-for="idx in i18nDesktopLoopIdx" :key="idx">
      <template v-if="i18nLangAll[idx] as string !== 'null'">
        <span :lang="i18nToUiLangAll[idx]"
              :class="{'clamped-text': enableTextLineClamp}"
              v-if="i18nLangAll[idx] as string !== 'null'">
          {{ data[i18nLangAll[idx]] }}
        </span>
        <span v-if="idx + 1 < i18nDesktopLoopIdx.length">&nbsp;/&nbsp;</span>
      </template>

    </template>
  </template>

  <template v-if="htmlElementName === 'li'">
    <template v-for="idx in i18nDesktopLoopIdx" :key="idx">
      <template v-if="i18nLangAll[idx] as string !== 'null'">
        <li :lang="i18nToUiLangAll[idx]">
          <span :class="{'clamped-text': enableTextLineClamp}">{{ data[i18nLangAll[idx]] }}</span>
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