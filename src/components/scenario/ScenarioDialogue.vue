<script setup lang="ts">
import { inject, type PropType, type Ref, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH_WIDER } from '@/tool/Constant'
import { getLangData } from '@/tool/StoryTool'
import DialogueDesktopAuto from '@/components/scenario/desktop/DialogueDesktopAuto.vue'
import DialogueMobileAuto from '@/components/scenario/mobile/DialogueMobileAuto.vue'
import type {
  CommonStoryDataDialog,
  CommonStoryDataDialogDataType,
  IndexScenarioCharacterDataEntry, NexonL10nDataLang
} from '@/types/OutsourcedData'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { useSetting } from '@/stores/setting'
import type { MlForScenario } from '@/types/MachineTranslation'

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
  },
  entry_pos: {
    type: Number,
    required: true
  }
})

// --------------------- ML SERVICE ---------------------
let ML_table: Ref<MlForScenario> = ref(inject('ML_table') as any)
// ------------------------------------------------------

const screenWidth = useWindowSize().width
const setting = useSetting()
</script>

<template>
  <tr v-show="(screenWidth >= MOBILE_WIDTH_WIDER && !setting.ui_force_mobile) && ML_table">
    <DialogueDesktopAuto :dialogue-data-type="data_type"
                  :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                  :dialogue-selection-group="data_dialog.SelectionGroup"
                  :dialogue-content="getLangData(data_dialog.Message, i18nLangAll[0] as NexonL10nDataLang)"
                  :dialogue-character="getLangData(data_char.Name, i18nLangAll[0] as NexonL10nDataLang)"
                  :dialogue-lang="i18nToUiLangAll[0]"
                  :dialogue-character-image="data_char.SmallPortrait"
                  :dialogue-text-color="data_dialog.ShowTextColor"
                  :dialogue-character-translated="ML_table[i18nLangAll[0] as NexonL10nDataLang][entry_pos]['name']"
                  :dialogue-content-translated="ML_table[i18nLangAll[0] as NexonL10nDataLang][entry_pos]['dialogue']" />
    <DialogueDesktopAuto :dialogue-data-type="data_type"
                  :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                  :dialogue-selection-group="data_dialog.SelectionGroup"
                  :dialogue-content="getLangData(data_dialog.Message, i18nLangAll[1] as NexonL10nDataLang)"
                  :dialogue-character="getLangData(data_char.Name, i18nLangAll[1] as NexonL10nDataLang)"
                  :dialogue-lang="i18nToUiLangAll[1]"
                  :dialogue-character-image="data_char.SmallPortrait"
                  :dialogue-text-color="data_dialog.ShowTextColor"
                  :dialogue-character-translated="ML_table[i18nLangAll[1] as NexonL10nDataLang][entry_pos]['name']"
                  :dialogue-content-translated="ML_table[i18nLangAll[1] as NexonL10nDataLang][entry_pos]['dialogue']" />
    <DialogueDesktopAuto :dialogue-data-type="data_type"
                  :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                  :dialogue-selection-group="data_dialog.SelectionGroup"
                  :dialogue-content="getLangData(data_dialog.Message, i18nLangAll[2] as NexonL10nDataLang)"
                  :dialogue-character="getLangData(data_char.Name, i18nLangAll[2] as NexonL10nDataLang)"
                  :dialogue-lang="i18nToUiLangAll[2]"
                  :dialogue-character-image="data_char.SmallPortrait"
                  :dialogue-text-color="data_dialog.ShowTextColor"
                  :dialogue-character-translated="ML_table[i18nLangAll[2] as NexonL10nDataLang][entry_pos]['name']"
                  :dialogue-content-translated="ML_table[i18nLangAll[2] as NexonL10nDataLang][entry_pos]['dialogue']" />
  </tr>
  <tr v-show="(screenWidth < MOBILE_WIDTH_WIDER || setting.ui_force_mobile) && ML_table">
    <DialogueMobileAuto :dialogue-data-type="data_type"
                        :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                        :dialogue-selection-group="data_dialog.SelectionGroup"
                        :dialogue-content="data_dialog.Message"
                        :dialogue-character="data_char.Name"
                        :dialogue-character-image="data_char.SmallPortrait"
                        :dialogue-text-color="data_dialog.ShowTextColor"
                        :entry_pos="entry_pos" />
  </tr>
</template>

<style scoped>

</style>