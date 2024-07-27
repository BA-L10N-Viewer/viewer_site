<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { useSetting } from '@/stores/setting'

const setting = useSetting()

const i18nL1: Ref = ref('')
const i18nL2: Ref = ref('')
const i18nL3: Ref = ref('')

const langL1: Ref = ref('')
const langL2: Ref = ref('')
const langL3: Ref = ref('')

watch(
  () => {
    return [setting.i18n_lang1, setting.i18n_lang2, setting.i18n_lang3]
  },
  () => {
    const i18nAll = i18nLangAll.value
    i18nL1.value = i18nAll[0]
    i18nL2.value = i18nAll[1]
    i18nL3.value = i18nAll[2]

    const langAll = i18nToUiLangAll.value
    langL1.value = langAll[0]
    langL2.value = langAll[1]
    langL3.value = langAll[2]
  },
  {immediate: true}
)
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    data: {
      required: true
    },
    htmlElementName: {
      type: String,
      default: "span"
    }
  }
})
</script>

<template>
  <span :lang="langL1" v-if="htmlElementName === 'span'">{{ data[i18nL1] }}</span>
  <span v-if="htmlElementName === 'span'">&nbsp;/&nbsp;</span>
  <span :lang="langL2" v-if="htmlElementName === 'span'">{{ data[i18nL2] }}</span>
  <span v-if="htmlElementName === 'span'">&nbsp;/&nbsp;</span>
  <span :lang="langL3" v-if="htmlElementName === 'span'">{{ data[i18nL3] }}</span>

  <li :lang="langL1" v-if="htmlElementName === 'li'">{{ data[i18nL1] }}</li>
  <li :lang="langL2" v-if="htmlElementName === 'li'">{{ data[i18nL2] }}</li>
  <li :lang="langL3" v-if="htmlElementName === 'li'">{{ data[i18nL3] }}</li>
</template>

<style scoped>

</style>