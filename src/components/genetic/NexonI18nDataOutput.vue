<script setup lang="ts">
import { defineProps, computed, type PropType } from 'vue'
import {
  i18nLangAll,
  i18nToUiLangAll,
  listOfPosOfSelectedLangForMobile
} from '@/tool/ConstantComputed'
import type { NexonL10nData, SchaleDbL10nData } from '@/types/OutsourcedData'
import { NexonLangMap } from '@/tool/Constant'

const props = defineProps({
  data: {
    type: {} as PropType<NexonL10nData | SchaleDbL10nData>,
    required: true
  },
  dataLang: {
    type: Array<string>,
    default: null
  },
  htmlElementName: {
    type: String as PropType<'span' | 'li'>,
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

const dataLangProcessed = computed(() => {
  const result: string[] = []
  const allDataKeys = Object.keys(props.data)

  for (const lang of props.dataLang) {
    if (allDataKeys.includes(lang))
      result.push(lang)
  }

  return result
})
</script>

<template>
  <template v-if="data">
    <template v-if="htmlElementName === 'span'">
      <!-- 不指定语言时 -->
      <template v-if="!dataLang">
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
      <!-- 指定语言时 -->
      <template v-else>
        <template v-for="(lang, idx) in dataLangProcessed" :key="idx">
          <span :lang="NexonLangMap[lang]"
                :class="{'clamped-text': enableTextLineClamp}">
            <!-- 不知道该怎么写了，any启动！ -->
            {{ (data as any)[lang] }}
          </span>
          <span v-if="idx + 1 < dataLangProcessed.length">&nbsp;/&nbsp;</span>
        </template>
      </template>
    </template>

    <template v-if="htmlElementName === 'li'">
      <!-- 不指定语言时 -->
      <template v-if="!dataLang">
        <template v-for="(langIdx, idx) in listOfPosOfSelectedLangForMobile" :key="idx">
          <template v-if="i18nLangAll[langIdx] as string !== 'null'">
            <li :lang="i18nToUiLangAll[langIdx]">
              <span>{{ data[i18nLangAll[langIdx]] }}</span>
            </li>
          </template>
        </template>
      </template>
      <!-- 指定语言时 -->
      <template v-else>
        <template v-for="(lang, idx) in dataLangProcessed" :key="idx">
          <li :lang="NexonLangMap[lang]">
            <span>{{ (data as any)[lang] }}</span>
          </li>
        </template>
      </template>
    </template>
  </template>
</template>

<style scoped>
span {
  display: inline-block;
}
li span {
  display: revert;
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