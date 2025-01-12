<script setup lang="ts">
import { computed, defineProps, type PropType } from 'vue'
import { i18nLangAll, i18nToUiLangAll, listOfPosOfSelectedLangForMobile } from '@/tool/ConstantComputed'
import type { NexonL10nData, SchaleDbL10nData } from '@/types/OutsourcedData'
import { NexonLangMap } from '@/tool/Constant'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import { useSetting } from '@/stores/setting'

const setting = useSetting()

const props = defineProps({
  data: {
    type: {} as PropType<NexonL10nData | SchaleDbL10nData>,
    required: true
  },
  dataMt: {
    type: {} as PropType<NexonL10nData | SchaleDbL10nData>,
    default: {
      'j_ja': '', 'j_ko': '', 'g_ja': '', 'g_ko': '', 'g_en': '', 'g_th': '', 'g_tw': '', 'g_tw_cn': '',
      'c_cn': '', 'c_cn_tw': '', 'c_zh': '', 'c_zh_tw': ''
    }
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
              <DialogueTranslated
                display-mode="square_basket"
                :content-original="data[i18nLangAll[langIdx]]"
                :content-original-lang="i18nToUiLangAll[langIdx]"
                :content-translated="dataMt[i18nLangAll[langIdx]]" />
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
            <DialogueTranslated
              display-mode="square_basket"
              :content-original="(data as any)[lang]"
              :content-original-lang="NexonLangMap[lang]"
              :content-translated="(dataMt as any)[lang]" />
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
              <span>
                <DialogueTranslated
                  display-mode="square_basket"
                  :content-original="data[i18nLangAll[langIdx]]"
                  :content-original-lang="i18nToUiLangAll[langIdx]"
                  :content-translated="setting.auto_i18n_showauto ? dataMt[i18nLangAll[langIdx]] : ''" />
              </span>
              <ul v-show="dataMt[i18nLangAll[langIdx]] !== '' && !setting.auto_i18n_showauto" class="datasheet-data-ul">
                <li :lang="setting.auto_i18n_lang"><span v-html="dataMt[i18nLangAll[langIdx]]" /></li>
              </ul>
            </li>
          </template>
        </template>
      </template>
      <!-- 指定语言时 -->
      <template v-else>
        <template v-for="(lang, idx) in dataLangProcessed" :key="idx">
          <li :lang="NexonLangMap[lang]">
            <span>
              <span>
                <DialogueTranslated
                  display-mode="square_basket"
                  :content-original="data[i18nLangAll[idx]]"
                  :content-original-lang="i18nToUiLangAll[idx]"
                  :content-translated="!setting.auto_i18n_showauto ? dataMt[i18nLangAll[idx]] : ''" />
              </span>
              <ul v-show="dataMt[i18nLangAll[idx]] !== '' && !setting.auto_i18n_showauto" class="datasheet-data-ul">
                <li :lang="setting.auto_i18n_lang"><span v-html="dataMt[i18nLangAll[idx]]" /></li>
              </ul>
            </span>
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

.datasheet-data-ul {
  margin: 0;
  padding: 0 0 0 1em;
}
</style>