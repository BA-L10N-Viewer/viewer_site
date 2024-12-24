<script setup lang="ts">
import { computed, inject, type PropType, type Ref, ref } from 'vue'
import {
  checkDialogueSensei,
  convertMmtMsgToHtml,
  getClassDialogueSensei,
  getNexonL10nData,
  mmtMessageContentDecorator
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
import {
  symbolForMomotalkEntryDialoguePos,
  symbolForMomotalkEntryPos,
  symbolForMomotalkMtData
} from '@/tool/translate/MtUtils'

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
const currCharId = computed(() => {
  const temp = window.location.pathname.split('/').slice(-1)[0]
  if (temp.length === 7) {
    // 在ScenarioUi里面嵌套的显示
    return temp.slice(0, 5)
  }
  return temp
})

const setting = useSetting()

// --------------------- ML SERVICE ---------------------
let ML_table: Ref<MlForMomotalk> = inject(symbolForMomotalkMtData)!
const mmtEntryPos = inject(symbolForMomotalkEntryPos)!
const mmtEntryDialoguePos = inject(symbolForMomotalkEntryDialoguePos)!
// ------------------------------------------------------

// --------------------- UTILITY FUNCTION ---------------------
function removeHtmlImgTag(text: string) {
  const regexImg = /<img.*?\/?>/gi
  return text.replaceAll(regexImg, '')
}

function extractHtmlImgTag(text: string) {
  const regexImg = /<img.*?\/?>/gi
  const result = text.match(regexImg)
  if (result && result.length !== 0)
    return result.join('<br />') + '<br />'
  return ''
}

// ------------------------------------------------------------
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
                              :content-original-lang="i18nToUiLangAll[idx]"
                              :content-translated="ML_table[mmtEntryPos][i18nLangAll[idx]][mmtEntryDialoguePos]['name']" />
        </template>
      </div>
    </div>
  </td>
  <td
    :class="['momotalk-dialogue', 'momotalk-text', 'momotalk-char', `momotalk-dialogue-text-${dialogueBgColor}`, `${getClassDialogueSensei(dialogueType)}-td`]">
    <div v-html="extractHtmlImgTag(convertMmtMsgToHtml(getNexonL10nData(dialogueContent, 'j_ja')))"></div>
    <div v-for="(langIdx, idx) in listOfPosOfSelectedLangForMobile" :key="langIdx"
         :class="getClassDialogueSensei(dialogueType)"
         :lang="i18nToUiLangAll[langIdx]">
      <template v-if="i18nLangAll[langIdx] as string !== 'null'">
        <DialogueTranslated
          :content-original="removeHtmlImgTag(convertMmtMsgToHtml(mmtMessageContentDecorator(dialogueType, getNexonL10nData(dialogueContent,i18nLangAll[langIdx]))))"
          :content-original-lang="i18nToUiLangAll[langIdx]"
          :content-translated="removeHtmlImgTag(convertMmtMsgToHtml(mmtMessageContentDecorator(dialogueType, ML_table[mmtEntryPos][i18nLangAll[langIdx]][mmtEntryDialoguePos]['dialogue'])))"
          :content-translated-blank-value="['&amp;nbsp;&amp;lt;', '&amp;gt;&amp;nbsp;', '> ', ' <']"
          :is_br="removeHtmlImgTag(convertMmtMsgToHtml(getNexonL10nData(dialogueContent, 'j_ja'))) !== '<br />'" />
        <hr class="mobile-lang-hr"
            v-if="!(idx + 1 == numberOfSelectedLangForMobile) && removeHtmlImgTag(convertMmtMsgToHtml(getNexonL10nData(dialogueContent, 'j_ja'))) !== '<br />'" />
      </template>
    </div>
  </td>
</template>

<style scoped>
.momotalk-speaker {
  text-align: left !important;
}
</style>