<script setup lang="ts">
import DialogueStudent from '@/components/momotalk/DialogueStudent.vue'
import { computed, type PropType, type Ref, ref, provide, inject } from 'vue'
import { useSetting } from '@/stores/setting'
import { MOBILE_WIDTH } from '@/tool/Constant'
import { useWindowSize } from '@vueuse/core'
import DialogueStudentMobile from '@/components/momotalk/DialogueStudentMobile.vue'
import { getLangData, type NexonL10nDataMlData } from '@/tool/StoryTool'
import type {
  MomotalkStoryDataDialog, NexonL10nData,
  NexonL10nDataLang
} from '@/types/OutsourcedData'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { useRouter } from 'vue-router'

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
  entry_pos: {
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
let ML_table: Ref<[NexonL10nDataMlData]> = ref(inject('ML_table') as any)

provide('mmtEntryPos', props.mmt_entry_pos)
provide('mmtEntryDialoguePos', props.entry_pos)
// ------------------------------------------------------

// ------------------------------------------------
const screenWidth = useWindowSize().width
const router = useRouter()
</script>

<template>
  <tr class="momotalk-dialogue-tr" v-show="(screenWidth >= MOBILE_WIDTH && !setting.ui_force_mobile) && ML_table">
    <DialogueStudent :dialogue-lang="i18nToUiLangAll[0]"
                     :dialogue-speaker="charName[i18nLangAll[0] as NexonL10nDataLang]"
                     :dialogue-content="getLangData(data_dialog.Message, i18nLangAll[0] as NexonL10nDataLang)"
                     :dialogue-lang-translated="setting.auto_i18n_lang"
                     :dialogue-speaker-translated="ML_table[mmt_entry_pos][i18nLangAll[0] as NexonL10nDataLang][entry_pos]['name']"
                     :dialogue-content-translated="ML_table[mmt_entry_pos][i18nLangAll[0] as NexonL10nDataLang][entry_pos]['dialogue']"
                     :dialogue-bg-color="data_dialog.MessageBgColor"
                     :dialogue-type="data_dialog.MessageCondition" />
    <DialogueStudent :dialogue-lang="i18nToUiLangAll[1]"
                     :dialogue-speaker="charName[i18nLangAll[1] as NexonL10nDataLang]"
                     :dialogue-content="getLangData(data_dialog.Message, i18nLangAll[1] as NexonL10nDataLang)"
                     :dialogue-lang-translated="setting.auto_i18n_lang"
                     :dialogue-speaker-translated="ML_table[mmt_entry_pos][i18nLangAll[1] as NexonL10nDataLang][entry_pos]['name']"
                     :dialogue-content-translated="ML_table[mmt_entry_pos][i18nLangAll[1] as NexonL10nDataLang][entry_pos]['dialogue']"
                     :dialogue-bg-color="data_dialog.MessageBgColor"
                     :dialogue-type="data_dialog.MessageCondition" />
    <DialogueStudent :dialogue-lang="i18nToUiLangAll[2]"
                     :dialogue-speaker="charName[i18nLangAll[2] as NexonL10nDataLang]"
                     :dialogue-content="getLangData(data_dialog.Message, i18nLangAll[2] as NexonL10nDataLang)"
                     :dialogue-lang-translated="setting.auto_i18n_lang"
                     :dialogue-speaker-translated="ML_table[mmt_entry_pos][i18nLangAll[2] as NexonL10nDataLang][entry_pos]['name']"
                     :dialogue-content-translated="ML_table[mmt_entry_pos][i18nLangAll[2] as NexonL10nDataLang][entry_pos]['dialogue']"
                     :dialogue-bg-color="data_dialog.MessageBgColor"
                     :dialogue-type="data_dialog.MessageCondition" />
  </tr>
  <tr class="momotalk-dialogue-tr" v-show="(screenWidth < MOBILE_WIDTH || setting.ui_force_mobile) && ML_table">
    <DialogueStudentMobile :dialogueType="data_dialog.MessageCondition"
                           :dialogueBgColor="data_dialog.MessageBgColor"
                           :dialogue-speaker="charName"
                           :dialogue-content="data_dialog.Message" />
  </tr>
  <tr class="momotalk-dialogue-tr" v-if="data_dialog.FavorScheduleId !== 0">
    <td :colspan="screenWidth >= MOBILE_WIDTH ? 6 : 2"
        style="text-align: center; background-color: var(--color-ba-mmt); font-size: 1.2em;">
      <b><a @click="router.push({name: 'scenario', params: {storyId: bond_story_id}})"
            href="javascript: void 0">{{ $t('comp-mmt-ui-table-view-story')}}</a></b>
    </td>
  </tr>
</template>

<style scoped>

</style>