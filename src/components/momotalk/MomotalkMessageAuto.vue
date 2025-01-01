<script setup lang="ts">
import MessageStudent from '@/components/momotalk/MessageStudent.vue'
import { computed, inject, type PropType, provide, type Ref } from 'vue'
import { useSetting } from '@/stores/setting'
import { i18nDesktopLoopIdx, MOBILE_WIDTH } from '@/tool/Constant'
import { useWindowSize } from '@vueuse/core'
import MessageStudentMobile from '@/components/momotalk/MessageStudentMobile.vue'
import { getNexonL10nData } from '@/tool/StoryTool'
import type { MomotalkStoryDataDialog, NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'
import { i18nLangAll, i18nToUiLangAll, numberOfSelectedLangForDesktop } from '@/tool/ConstantComputed'
import type { MlForMomotalk } from '@/types/MachineTranslation'
import {
  symbolForMomotalkEntryDialoguePos,
  symbolForMomotalkEntryPos,
  symbolForMomotalkMtData
} from '@/tool/translate/MtUtils'

// --------------------- 初始化 ---------------------
const props = defineProps({
  data_dialog: {
    type: {} as PropType<MomotalkStoryDataDialog>,
    required: true
  },
  data_char: {
    type: String,
    required: true
  },
  char_name: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  bond_story_id: {
    type: Number,
    required: true
  },
  dialog_entry_pos: {
    type: Number,
    required: true
  },
  mmt_entry_pos: {
    type: Number,
    required: true
  }
})
const charName = computed(() => props.char_name)
const setting = useSetting()

// --------------------- ML SERVICE ---------------------
let ML_table: Ref<MlForMomotalk> = inject(symbolForMomotalkMtData)!

provide(symbolForMomotalkEntryPos, props.mmt_entry_pos)
provide(symbolForMomotalkEntryDialoguePos, props.dialog_entry_pos)
// ------------------------------------------------------

// ------------------------------------------------
const screenWidth = useWindowSize().width
</script>

<template>
  <tr class="momotalk-dialogue-tr" v-show="(screenWidth >= MOBILE_WIDTH && !setting.ui_force_mobile) && ML_table">
    <template v-for="idx in i18nDesktopLoopIdx" :key="idx">
      <MessageStudent :dialogue-lang="i18nToUiLangAll[idx]"
                      :dialogue-speaker="charName[i18nLangAll[idx] as NexonL10nDataLang]"
                      :dialogue-content="getNexonL10nData(data_dialog.Message,i18nLangAll[idx])"
                      :dialogue-lang-translated="setting.auto_i18n_lang"
                      :dialogue-speaker-translated="ML_table[mmt_entry_pos][i18nLangAll[idx]][dialog_entry_pos]['name']"
                      :dialogue-content-translated="ML_table[mmt_entry_pos][i18nLangAll[idx]][dialog_entry_pos]['dialogue']"
                      :dialogue-bg-color="data_dialog.MessageBgColor"
                      :dialogue-type="data_dialog.MessageCondition"

                      v-if="i18nLangAll[idx] as string !== 'null'" />
    </template>
  </tr>
  <tr class="momotalk-dialogue-tr" v-show="(screenWidth < MOBILE_WIDTH || setting.ui_force_mobile) && ML_table">
    <MessageStudentMobile :dialogueType="data_dialog.MessageCondition"
                          :dialogueBgColor="data_dialog.MessageBgColor"
                          :dialogue-speaker="charName"
                          :dialogue-content="data_dialog.Message" />
  </tr>
  <tr class="momotalk-dialogue-tr" v-if="data_dialog.FavorScheduleId !== 0">
    <td :colspan="screenWidth >= MOBILE_WIDTH ? numberOfSelectedLangForDesktop * 2 : 2"
        style="text-align: center; background-color: var(--color-ba-mmt); font-size: 1.2em;">
      <b>
        <RouterLink :to="`/scenario/${bond_story_id}`">{{ $t('comp-mmt-ui-table-view-story') }}</RouterLink>
      </b>
    </td>
  </tr>
</template>

<style scoped>

</style>