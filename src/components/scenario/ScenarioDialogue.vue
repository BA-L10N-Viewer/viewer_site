<script setup lang="ts">
import { inject, type PropType, type Ref, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { i18nDesktopLoopIdx, MOBILE_WIDTH_WIDER } from '@/tool/Constant'
import { getNexonL10nData } from '@/tool/StoryTool'
import DialogueDesktopAuto from '@/components/scenario/desktop/DialogueDesktopAuto.vue'
import DialogueMobileAuto from '@/components/scenario/mobile/DialogueMobileAuto.vue'
import type {
  CommonStoryDataDialog,
  CommonStoryDataDialogDataType,
  IndexScenarioCharacterDataEntry
} from '@/types/OutsourcedData'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { useSetting } from '@/stores/setting'
import type { MlForScenario } from '@/types/MachineTranslation'
import { symbolForScenarioMtData } from '@/tool/translate/MtUtils'

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
let ML_table: Ref<MlForScenario> = inject(symbolForScenarioMtData)!
// ------------------------------------------------------

const screenWidth = useWindowSize().width
const setting = useSetting()
</script>

<template>
  <tr v-show="(screenWidth >= MOBILE_WIDTH_WIDER && !setting.ui_force_mobile) && ML_table">
    <template v-for="idx in i18nDesktopLoopIdx" :key="idx">
      <template v-if="i18nLangAll[idx] as string !== 'null'">
        <DialogueDesktopAuto :dialogue-data-type="data_type"
                             :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                             :dialogue-selection-group="data_dialog.SelectionGroup"
                             :dialogue-content="getNexonL10nData(data_dialog.Message,i18nLangAll[idx])"
                             :dialogue-character="getNexonL10nData(data_char.Name,i18nLangAll[idx])"
                             :dialogue-lang="i18nToUiLangAll[idx]"
                             :dialogue-character-image="data_char.SmallPortrait"
                             :dialogue-text-color="data_dialog.ShowTextColor"
                             :dialogue-character-translated="ML_table[i18nLangAll[idx]][entry_pos]['name']"
                             :dialogue-content-translated="ML_table[i18nLangAll[idx]][entry_pos]['dialogue']"
                             :dialogue-absolute-pos="data_dialog.AbsolutePos"
                             :dialogue-popup-filename="data_dialog.PopupFileName"

                             v-if="i18nLangAll[idx] as string !== 'null'"/>
      </template>
    </template>
  </tr>
  <tr v-show="(screenWidth < MOBILE_WIDTH_WIDER || setting.ui_force_mobile) && ML_table">
    <DialogueMobileAuto :dialogue-data-type="data_type"
                        :dialogue-selection-to-group="data_dialog.SelectionToGroup"
                        :dialogue-selection-group="data_dialog.SelectionGroup"
                        :dialogue-content="data_dialog.Message"
                        :dialogue-character="data_char.Name"
                        :dialogue-character-image="data_char.SmallPortrait"
                        :dialogue-text-color="data_dialog.ShowTextColor"
                        :dialogue-absolute-pos="data_dialog.AbsolutePos"
                        :dialogue-popup-filename="data_dialog.PopupFileName"
                        :entry_pos="entry_pos" />
  </tr>
</template>

<style scoped>

</style>