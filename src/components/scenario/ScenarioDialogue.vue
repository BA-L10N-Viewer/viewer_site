<script setup lang="ts">
import { type PropType, type Ref, ref, watch } from 'vue'
import { useSetting } from '@/stores/setting'
import { NexonLangMap } from '@/tool/Constant'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH_WIDER } from '@/tool/Constant'
import { getLangData } from '@/tool/StoryTool'
import DialogueAuto from '@/components/scenario/desktop/DialogueAuto.vue'
import DialogueAutoMobile from '@/components/scenario/mobile/DialogueAutoMobile.vue'
import type {
  CommonStoryDataDialog,
  CommonStoryDataDialogDataType,
  IndexScenarioCharacterDataEntry
} from '@/types/OutsourcedData'

// --------------------- 初始化 ---------------------
const props = defineProps({
  data_dialog: {
    type: {} as PropType<CommonStoryDataDialog>,
    required: true
  },
  data_char: {
    type: {} as PropType<IndexScenarioCharacterDataEntry>,
    required: true
  },
  data_type: {
    type: String as PropType<CommonStoryDataDialogDataType>,
    required: true
  }
})

// --------------------- I18N ---------------------
const setting = useSetting()
const i18nL1: Ref = ref(setting.i18n_lang1)
const i18nL2: Ref = ref(setting.i18n_lang2)
const i18nL3: Ref = ref(setting.i18n_lang3)
const langL1: Ref = ref(NexonLangMap[i18nL1.value])
const langL2: Ref = ref(NexonLangMap[i18nL2.value])
const langL3: Ref = ref(NexonLangMap[i18nL3.value])
watch(
  () => {
    return [setting.i18n_lang1, setting.i18n_lang2, setting.i18n_lang3]
  },
  () => {
    i18nL1.value = setting.i18n_lang1
    i18nL2.value = setting.i18n_lang2
    i18nL3.value = setting.i18n_lang3
    langL1.value = NexonLangMap[i18nL1.value]
    langL2.value = NexonLangMap[i18nL2.value]
    langL3.value = NexonLangMap[i18nL3.value]
  },
  { immediate: true }
)

// ------------------------------------------------
const screenWidth = useWindowSize().width
</script>

<template>
  <tr v-if="screenWidth >= MOBILE_WIDTH_WIDER">
    <DialogueAuto :dialogue-data-type="data_type"
                  :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                  :dialogue-selection-group="data_dialog.SelectionGroup"
                  :dialogue-content="getLangData(data_dialog.Message, i18nL1)"
                  :dialogue-character="getLangData(data_char.Name, i18nL1)" :dialogue-lang="langL1"
                  :dialogue-character-image="data_char.SmallPortrait"
                  :dialogue-text-color="data_dialog.ShowTextColor" />
    <DialogueAuto :dialogue-data-type="data_type"
                  :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                  :dialogue-selection-group="data_dialog.SelectionGroup"
                  :dialogue-content="getLangData(data_dialog.Message, i18nL2)"
                  :dialogue-character="getLangData(data_char.Name, i18nL2)" :dialogue-lang="langL2"
                  :dialogue-character-image="data_char.SmallPortrait"
                  :dialogue-text-color="data_dialog.ShowTextColor" />
    <DialogueAuto :dialogue-data-type="data_type"
                  :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                  :dialogue-selection-group="data_dialog.SelectionGroup"
                  :dialogue-content="getLangData(data_dialog.Message, i18nL3)"
                  :dialogue-character="getLangData(data_char.Name, i18nL3)" :dialogue-lang="langL3"
                  :dialogue-character-image="data_char.SmallPortrait"
                  :dialogue-text-color="data_dialog.ShowTextColor" />
  </tr>
  <tr v-else>
    <DialogueAutoMobile :dialogue-data-type="data_type"
                        :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                        :dialogue-selection-group="data_dialog.SelectionGroup"
                        :dialogue-content="data_dialog.Message"
                        :dialogue-character="data_char.Name"
                        :dialogue-character-image="data_char.SmallPortrait"
                        :dialogue-text-color="data_dialog.ShowTextColor" />
  </tr>
</template>

<style scoped>

</style>