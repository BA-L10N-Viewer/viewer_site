<script setup lang="ts">
import { computed, type PropType, inject, type Ref, ref } from 'vue'
import {
  dialogueContentDecorator,
  convertMmtMsgToHtml,
  checkDialogueSensei,
  getClassDialogueSensei
} from '@/tool/StoryTool'
import { useSetting } from '@/stores/setting'
import { getStaticCdnBasepath } from '@/tool/HttpRequest'
import DialogueIcon from '@/components/DialogueIcon.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import type { NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'
import DialogueTranslated from '@/components/DialogueTranslated.vue'
import type { MlForMomotalk } from '@/types/MachineTranslation'

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
const dialogueSpeakers = computed(() => {
  const temp = []
  for (const lang of i18nLangAll.value) {
    temp.push(props.dialogueSpeaker[lang])
  }
  return temp
})
const dialogueContentsDecorated = computed(() => {
  const temp = []
  for (const lang of i18nLangAll.value) {
    temp.push(dialogueContentDecorator(props.dialogueType, props.dialogueContent[lang]))
  }
  return temp
})
const currCharId = computed(() => window.location.pathname.split('/').slice(-1)[0])

const setting = useSetting()

// --------------------- ML SERVICE ---------------------
let ML_table: Ref<MlForMomotalk> = ref(inject('ML_table') as any)
const mmtEntryPos = inject('mmtEntryPos') as number
const mmtEntryDialoguePos = inject('mmtEntryDialoguePos') as number

const dialogueSpeakersTranslated = computed(() => {
  const temp = []
  for (const lang of i18nLangAll.value) {
    temp.push(ML_table.value[mmtEntryPos][lang][mmtEntryDialoguePos]['name'])
  }
  return temp
})
const dialogueContentsTranslated = computed(() => {
  const temp = []
  for (const lang of i18nLangAll.value) {
    temp.push(ML_table.value[mmtEntryPos][lang][mmtEntryDialoguePos]!['dialogue'])
  }
  return temp
})
// ------------------------------------------------------
</script>

<template>
  <td class="momotalk-dialogue momotalk-speaker">
    <div :class="{'momotalk-dialogue-sensei': checkDialogueSensei(dialogueType)}">
      <div v-if="!checkDialogueSensei(dialogueType)" style="text-align: center;">
        <DialogueIcon :icon-url="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${currCharId}.webp`" />
      </div>

      <div v-for="(speaker, idx) in dialogueSpeakers" :key="idx"
           :lang="i18nToUiLangAll[idx]">
        <span v-if="checkDialogueSensei(dialogueType)">{{ setting.username }}</span>
        <DialogueTranslated v-else :content-original="speaker" :content-translated="dialogueSpeakersTranslated[idx]" />
      </div>
    </div>
  </td>
  <td
    :class="['momotalk-dialogue', 'momotalk-text', 'momotalk-char', `momotalk-dialogue-bg-${dialogueBgColor}`, `${getClassDialogueSensei(dialogueType)}-td`]">
    <div v-for="(content, idx) in dialogueContentsDecorated" :key="idx"
         :class="getClassDialogueSensei(dialogueType)"
         :lang="i18nToUiLangAll[idx]">
      <DialogueTranslated :content-original="convertMmtMsgToHtml(content)"
                          :content-translated="convertMmtMsgToHtml(dialogueContentsTranslated[idx])" />

      <hr class="mobile-lang-hr" v-if="!(idx + 1 == dialogueSpeakers.length)" />
    </div>
  </td>
</template>

<style scoped>
.momotalk-speaker {
  text-align: left !important;
}
</style>