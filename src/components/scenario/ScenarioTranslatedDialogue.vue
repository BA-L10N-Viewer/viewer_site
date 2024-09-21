<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSetting } from '@/stores/setting'

const setting = useSetting()

const currMlLang = ref<string>('')
watch(
  () => setting.auto_i18n_lang,
  (newValue) =>  {
    currMlLang.value = newValue
  }
)

const props = defineProps({
  contentOriginal: {
    type: String,
    required: true
  },
  contentTranslated: {
    type: String,
    required: true
  },
  html_class: {
    type: String,
    default: ""
  },
  css_style: {
    type: Object,
    default: () => ({})
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
    return Boolean(props.contentTranslated)
  }
  return true
})
const actualCssStyle = computed(() => {
  const temp = { 'text-decoration': 'underline' }
  Object.assign(temp, props.css_style)

  return temp
})
const isShowOriginal = computed(() => !setting.auto_i18n_showauto)
</script>

<template>
  <span :class="html_class" v-show="isShowOriginal || !shouldDisplay" v-html="contentOriginal" :style="css_style"></span>
  <br v-show="is_br && (isShowOriginal || !shouldDisplay)" />
  <span :class="html_class" v-show="shouldDisplay" v-html="contentTranslated" :style="actualCssStyle" :lang="currMlLang"></span>
  <br v-show="shouldDisplay && is_after_br"/>
</template>

<style scoped>

</style>