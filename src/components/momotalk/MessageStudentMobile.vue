<script setup lang="ts">
import { computed, type PropType, inject, type Ref, ref } from 'vue'
import {
  mmtMessageContentDecorator,
  convertMmtMsgToHtml,
  checkDialogueSensei,
  getClassDialogueSensei, getNexonL10nData
} from '@/tool/StoryTool'
import { useSetting } from '@/stores/setting'
import { getStaticCdnBasepath } from '@/tool/HttpRequest'
import DialogueIcon from '@/components/DialogueIcon.vue'
import {
  i18nLangAll,
  i18nToUiLangAll,
  listOfPosOfSelectedLangForMobile,
  numberOfSelectedLangForMobile
} from '@/tool/ConstantComputed'
import type { NexonL10nData } from '@/types/OutsourcedData'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import type { MlForMomotalk } from '@/types/MachineTranslation'
import { i18nMobileLoopIdx } from '@/tool/Constant'

const props = defineProps({
  dialogueSpeaker: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  dialogueContent: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  dialogueBgColor: {
    type: String,
    required: true
  },
  dialogueType: {
    type: String,
    required: true
  }
})
const currCharId = computed(() => window.location.pathname.split('/').slice(-1)[0])

const setting = useSetting()

// --------------------- ML SERVICE ---------------------
let ML_table: Ref<MlForMomotalk> = ref(inject('ML_table') as any)
const mmtEntryPos = inject('mmtEntryPos') as number
const mmtEntryDialoguePos = inject('mmtEntryDialoguePos') as number
// ------------------------------------------------------
</script>

<template>
  <td class="momotalk-dialogue momotalk-speaker">
    <div :class="{'momotalk-dialogue-sensei': checkDialogueSensei(dialogueType)}">
      <div v-if="!checkDialogueSensei(dialogueType)" style="text-align: center;">
        <DialogueIcon :icon-url="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${currCharId}.webp`" />
      </div>

      <div v-for="idx in i18nMobileLoopIdx" :key="idx"
           :lang="i18nToUiLangAll[idx]">
        <template v-if="i18nLangAll[idx] as string !== 'null'">
          <span v-if="checkDialogueSensei(dialogueType)">{{ setting.username }}</span>
          <DialogueTranslated v-else :content-original="getNexonL10nData(dialogueSpeaker,i18nLangAll[idx])"
                              :content-translated="ML_table[mmtEntryPos][i18nLangAll[idx]][mmtEntryDialoguePos]['name']" />
        </template>
      </div>
    </div>
  </td>
  <td
    :class="['momotalk-dialogue', 'momotalk-text', 'momotalk-char', `momotalk-dialogue-bg-${dialogueBgColor}`, `${getClassDialogueSensei(dialogueType)}-td`]">
    <div v-for="(langIdx, idx) in listOfPosOfSelectedLangForMobile" :key="langIdx"
         :class="getClassDialogueSensei(dialogueType)"
         :lang="i18nToUiLangAll[langIdx]">
      <template v-if="i18nLangAll[langIdx] as string !== 'null'">
        <DialogueTranslated
          :content-original="convertMmtMsgToHtml(mmtMessageContentDecorator(dialogueType, getNexonL10nData(dialogueContent,i18nLangAll[langIdx])))"
          :content-translated="convertMmtMsgToHtml(ML_table[mmtEntryPos][i18nLangAll[langIdx]][mmtEntryDialoguePos]['dialogue'])" />
        <hr class="mobile-lang-hr" v-if="!(idx + 1 == numberOfSelectedLangForMobile)" />
      </template>
    </div>
  </td>
</template>

<style scoped>
.momotalk-speaker {
  text-align: left !important;
}
</style>