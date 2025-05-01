<script setup lang="ts">
import { inject, type PropType, type Ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { i18nDesktopLoopIdx, MOBILE_WIDTH_WIDER } from '@/tool/Constant'
import { getNexonL10nData } from '@/tool/StoryTool'
import DialogueDesktopAuto from '@/components/scenario/desktop/DialogueDesktopAuto.vue'
import DialogueMobileAuto from '@/components/scenario/mobile/DialogueMobileAuto.vue'
import type { CommonStoryDataEntry, IndexScenarioCharacterDataEntry } from '@/types/OutsourcedData'
import {
  i18nLangAll,
  i18nToUiLangAll,
  numberOfSelectedLangForDesktop
} from '@/tool/ConstantComputed'
import { useSetting } from '@/stores/setting'
import type { MlForScenario } from '@/types/MachineTranslation'
import { symbolForScenarioMtData } from '@/tool/translate/MtUtils'
import DialogueCmdEntry from '@/components/scenario/DialogueCmdEntry.vue'

// --------------------- 初始化 ---------------------
const props = defineProps({
  data_dialog: {
    type: {} as PropType<CommonStoryDataEntry>,
    required: true
  },
  data_char: {
    type: {} as PropType<IndexScenarioCharacterDataEntry>,
    required: true
  },
  entry_pos: {
    type: Number,
    required: true
  }
})

console.log(props.data_dialog?.DataType)

// --------------------- ML SERVICE ---------------------
let ML_table: Ref<MlForScenario> = inject(symbolForScenarioMtData)!
// ------------------------------------------------------

const screenWidth = useWindowSize().width
const setting = useSetting()
</script>

<template>
  <tr v-if="data_dialog.DataType !== 'cmd'">
    <template v-if="screenWidth >= MOBILE_WIDTH_WIDER && !setting.ui_force_mobile && ML_table">
      <template v-for="idx in i18nDesktopLoopIdx" :key="idx">
        <template v-if="(i18nLangAll[idx] as string) !== 'null'">
          <DialogueDesktopAuto
            :dialogue-data-type="data_dialog.DataType"
            :dialogue-selection-to-group="data_dialog.SelectionToGroup"
            :dialogue-selection-group="data_dialog.SelectionGroup"
            :dialogue-content="getNexonL10nData(data_dialog.Message, i18nLangAll[idx])"
            :dialogue-character="getNexonL10nData(data_char.Name, i18nLangAll[idx])"
            :dialogue-character-nickname="
              getNexonL10nData(data_char.Nickname || {}, i18nLangAll[idx])
            "
            :dialogue-lang="i18nToUiLangAll[idx]"
            :dialogue-character-image="data_char.SmallPortrait"
            :dialogue-text-color="data_dialog.ShowTextColor"
            :dialogue-character-translated="
              ML_table[i18nLangAll[idx]].get(String(entry_pos))?.['name'] || ''
            "
            :dialogue-character-nickname-translated="
              ML_table[i18nLangAll[idx]].get(String(entry_pos))?.['nickname'] || ''
            "
            :dialogue-content-translated="
              ML_table[i18nLangAll[idx]].get(String(entry_pos))?.['dialogue'] || ''
            "
            :dialogue-absolute-pos="data_dialog.AbsolutePos"
            :dialogue-popup-filename="data_dialog.PopupFileName"
            :dialogue-sound-filename="data_dialog.Sound"
            v-if="(i18nLangAll[idx] as string) !== 'null'"
          />
        </template>
      </template>
    </template>
    <template v-else>
      <DialogueMobileAuto
        :dialogue-data-type="data_dialog.DataType"
        :dialogue-selection-to-group="data_dialog.SelectionToGroup"
        :dialogue-selection-group="data_dialog.SelectionGroup"
        :dialogue-content="data_dialog.Message"
        :dialogue-character="data_char.Name"
        :dialogue-character-nickname="data_char.Nickname"
        :dialogue-character-image="data_char.SmallPortrait"
        :dialogue-text-color="data_dialog.ShowTextColor"
        :dialogue-absolute-pos="data_dialog.AbsolutePos"
        :dialogue-popup-filename="data_dialog.PopupFileName"
        :dialogue-sound-filename="data_dialog.Sound"
        :entry_pos="entry_pos"
      />
    </template>
  </tr>
  <tr v-else>
    <template v-if="screenWidth >= MOBILE_WIDTH_WIDER && !setting.ui_force_mobile && ML_table">
      <td :colspan="numberOfSelectedLangForDesktop * 2" class="scenario-dialogue">
        <DialogueCmdEntry :data-entry="data_dialog" />
      </td>
    </template>
    <template v-else>
      <td colspan="2" class="scenario-dialogue">
        <DialogueCmdEntry :data-entry="data_dialog" />
      </td>
    </template>
  </tr>
</template>

<style scoped></style>
