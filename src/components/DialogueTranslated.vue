<script setup lang="ts">
import { computed, type PropType, ref, useAttrs, watch } from 'vue'
import { useSetting } from '@/stores/setting'

const setting = useSetting()

const currMlLang = ref<string>('')
watch(
  () => setting.auto_i18n_lang,
  (newValue) =>  {
    currMlLang.value = newValue
  },
  { immediate: true }
)

const props = defineProps({
  contentOriginal: {
    type: String,
    required: true
  },
  contentOriginalLang: {
    type: String,
    required: true
  },
  contentTranslated: {
    type: String,
    required: true
  },
  contentTranslatedBlankValue: {
    type: Array<string>,
    default: ['']
  },
  html_class: {
    type: String,
    default: ""
  },
  displayMode: {
    type: String as PropType<'span' | 'square_basket'>,
    default: 'span'
  },
  is_br: {
    type: Boolean,
    default: true
  },
  is_after_br: {
    type: Boolean,
    default: false
  },
  auto_display: {
    type: Boolean,
    default: true
  },
})

const shouldDisplay = computed(() => {
  if (props.auto_display) {
    return Boolean(props.contentTranslated && !props.contentTranslatedBlankValue.includes(props.contentTranslated))
  }
  return true
})
const actualCssStyle = computed(() => {
  const temp = { 'text-decoration': 'underline' }
  Object.assign(temp, useAttrs()['style'] as {})

  return temp
})
const isShowOriginal = computed(() => !setting.auto_i18n_showauto)

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <template v-if="displayMode === 'span'">
    <span :lang="contentOriginalLang" :class="html_class" v-show="isShowOriginal || !shouldDisplay" v-html="String(contentOriginal)" :style="$attrs['style'] as {}"></span>
    <br v-show="is_br && (isShowOriginal || !shouldDisplay)" />
    <span :class="html_class" v-show="shouldDisplay" v-html="String(contentTranslated)" :style="actualCssStyle" :lang="currMlLang"></span>
    <br v-show="shouldDisplay && is_after_br"/>
  </template>
  <template v-else-if="displayMode === 'square_basket'">
    <span :lang="contentOriginalLang" :class="html_class" v-show="isShowOriginal || !shouldDisplay" v-html="String(contentOriginal)" :style="$attrs['style'] as {}"></span>
    <span>&nbsp;</span>
    <template v-if="isShowOriginal">
      <span :style="actualCssStyle" v-show="shouldDisplay">[<span :class="html_class" v-html="String(contentTranslated)" :lang="currMlLang"></span>]</span>
    </template>
    <template v-else>
      <span :class="html_class" v-show="shouldDisplay" v-html="String(contentTranslated)" :style="actualCssStyle" :lang="currMlLang"></span>
    </template>
    </template>
</template>

<style scoped>

</style>