<script setup lang="ts">
import PvDataTable from 'primevue/datatable'
import PvColumn from 'primevue/column'
import PvTag from 'primevue/tag'
import { computed } from 'vue'
import type { PropType } from 'vue'
import type { SchaleDbL10nData, SchaleDbL10nDataLang } from '@/types/OutsourcedData'
import { useSetting } from '@/stores/setting'
import { useI18n } from 'vue-i18n'
import { langsOfSelectedLangForMobile } from '@/tool/ConstantComputed'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH, NexonLangMap } from '@/tool/Constant'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import { convertNewlineToBr } from '@/tool/StoryTool'

const props = defineProps({
  data: {
    type: Object as PropType<SchaleDbL10nData>,
    required: true
  },
  dataMt: {
    type: Object as PropType<SchaleDbL10nData>,
    required: true
  }
})

const setting = useSetting()
const i18n = useI18n()
const currLangs = computed(() => {
  const langs: SchaleDbL10nDataLang[] = [...langsOfSelectedLangForMobile.value]
  if (setting.show_lang_zh) {
    if (setting.ui_lang === 'zh_TW')
      langs.push('c_zh_tw')
    else
      langs.push('c_zh')
  }
  return langs
})

const currTableData = computed(() => {
  const temp = []
  for (const lang of currLangs.value)
    temp.push({
      Lang: lang,
      Text: props.data[lang] ?? '',
      TextMt: props.dataMt[lang] ?? ''
    })

  return temp
})

const isMobile = computed(() => useWindowSize().width.value <= MOBILE_WIDTH)
</script>

<template>
  <PvDataTable :value="currTableData" class="data-generic-table">
    <PvColumn field="Lang"
              :header="i18n.t('comp-char-profile-generic-table-langcode')"
              style="width: 5em"
              v-if="!isMobile" />
    <PvColumn field="Text"
              :header="i18n.t('comp-char-profile-generic-table-text')"
              style="width: calc(100% - 7em)">
      <template #body="slotProps">
        <PvTag severity="info" value="Info" v-if="isMobile">{{slotProps.data.Lang}}</PvTag>
        <span v-if="isMobile">&nbsp;</span>
        <DialogueTranslated :content-original="convertNewlineToBr(slotProps.data.Text)"
                            :content-original-lang="NexonLangMap[slotProps.data.Lang]"
                            :content-translated="convertNewlineToBr(slotProps.data.TextMt)" />
      </template>
    </PvColumn>
  </PvDataTable>
</template>

<style scoped>

</style>