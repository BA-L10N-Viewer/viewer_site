<script setup lang="ts">
import MessageStudent from '@/components/momotalk/MessageStudent.vue'
import { computed, type PropType, type Ref, ref, provide, inject } from 'vue'
import { useSetting } from '@/stores/setting'
import { MOBILE_WIDTH } from '@/tool/Constant'
import { useWindowSize } from '@vueuse/core'
import MessageStudentMobile from '@/components/momotalk/MessageStudentMobile.vue'
import { getLangData } from '@/tool/StoryTool'
import type {
  MomotalkStoryDataDialog, NexonL10nData,
  NexonL10nDataLang
} from '@/types/OutsourcedData'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import type { MlForMomotalk } from '@/types/MachineTranslation'

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
let ML_table: Ref<MlForMomotalk> = ref(inject('ML_table') as any)

provide('mmtEntryPos', props.mmt_entry_pos)
provide('mmtEntryDialoguePos', props.dialog_entry_pos)
// ------------------------------------------------------

// ------------------------------------------------
const screenWidth = useWindowSize().width
</script>

<template>
  <tr class="momotalk-dialogue-tr" v-show="(screenWidth >= MOBILE_WIDTH && !setting.ui_force_mobile) && ML_table">
    <MessageStudent :dialogue-lang="i18nToUiLangAll[0]"
                     :dialogue-speaker="charName[i18nLangAll[0]]"
                     :dialogue-content="getLangData(data_dialog.Message, i18nLangAll[0])"
                     :dialogue-lang-translated="setting.auto_i18n_lang"
                     :dialogue-speaker-translated="ML_table[mmt_entry_pos][i18nLangAll[0]][dialog_entry_pos]['name']"
                     :dialogue-content-translated="ML_table[mmt_entry_pos][i18nLangAll[0]][dialog_entry_pos]['dialogue']"
                     :dialogue-bg-color="data_dialog.MessageBgColor"
                     :dialogue-type="data_dialog.MessageCondition" />
    <MessageStudent :dialogue-lang="i18nToUiLangAll[1]"
                     :dialogue-speaker="charName[i18nLangAll[1]]"
                     :dialogue-content="getLangData(data_dialog.Message, i18nLangAll[1])"
                     :dialogue-lang-translated="setting.auto_i18n_lang"
                     :dialogue-speaker-translated="ML_table[mmt_entry_pos][i18nLangAll[1]][dialog_entry_pos]['name']"
                     :dialogue-content-translated="ML_table[mmt_entry_pos][i18nLangAll[1]][dialog_entry_pos]['dialogue']"
                     :dialogue-bg-color="data_dialog.MessageBgColor"
                     :dialogue-type="data_dialog.MessageCondition" />
    <MessageStudent :dialogue-lang="i18nToUiLangAll[2]"
                     :dialogue-speaker="charName[i18nLangAll[2]]"
                     :dialogue-content="getLangData(data_dialog.Message, i18nLangAll[2])"
                     :dialogue-lang-translated="setting.auto_i18n_lang"
                     :dialogue-speaker-translated="ML_table[mmt_entry_pos][i18nLangAll[2]][dialog_entry_pos]['name']"
                     :dialogue-content-translated="ML_table[mmt_entry_pos][i18nLangAll[2]][dialog_entry_pos]['dialogue']"
                     :dialogue-bg-color="data_dialog.MessageBgColor"
                     :dialogue-type="data_dialog.MessageCondition" />
  </tr>
  <tr class="momotalk-dialogue-tr" v-show="(screenWidth < MOBILE_WIDTH || setting.ui_force_mobile) && ML_table">
    <MessageStudentMobile :dialogueType="data_dialog.MessageCondition"
                           :dialogueBgColor="data_dialog.MessageBgColor"
                           :dialogue-speaker="charName"
                           :dialogue-content="data_dialog.Message" />
  </tr>
  <tr class="momotalk-dialogue-tr" v-if="data_dialog.FavorScheduleId !== 0">
    <td :colspan="screenWidth >= MOBILE_WIDTH ? 6 : 2"
        style="text-align: center; background-color: var(--color-ba-mmt); font-size: 1.2em;">
      <b><RouterLink :to="`/scenario/${bond_story_id}`">{{ $t('comp-mmt-ui-table-view-story')}}</RouterLink></b>
    </td>
  </tr>
</template>

<style scoped>

</style>