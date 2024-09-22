<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useSignalI18n } from '@/stores/signal'
import { useSetting } from '@/stores/setting'
import { checkDialogueSensei, convertMmtMsgToHtml, getClassDialogueSensei } from '@/tool/StoryTool'
import DialogueIcon from '@/components/DialogueIcon.vue'
import { getStaticCdnBasepath } from '@/tool/HttpRequest'
import DialogueTranslated from '@/components/DialogueTranslated.vue'

const props = defineProps({
  dialogueLang: {
    type: String,
    required: true
  },
  dialogueSpeaker: {
    type: String,
    required: true
  },
  dialogueContent: {
    type: String,
    required: true
  },
  dialogueLangTranslated: {
    type: String,
    required: false,
    default: ''
  },
  dialogueSpeakerTranslated: {
    type: String,
    required: false,
    default: ''
  },
  dialogueContentTranslated: {
    type: String,
    required: false,
    default: ''
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
const dialogueContentDecorated = computed(() => {
  if (props.dialogueType === 'Answer') {
    return props.dialogueContent + '&nbsp;&lt;'
  } else if (props.dialogueType === 'Feedback') {
    return '&gt;&nbsp;' + props.dialogueContent
  } else {
    return props.dialogueContent
  }
})
const currCharId = computed(() => window.location.pathname.split('/').slice(-1)[0])

const signalI18n = useSignalI18n()
const pageData = ref({})
const setting = useSetting()


watch(
  () => {
    return pageData.value
  },
  () => {
    // console.log(pageData)
    watch(
      () => {
        return signalI18n.reset_i18n_all
      },
      () => {
        // console.log(signalI18n.reset_i18n_all)
        let temp : any = Object.assign({}, pageData.value)
        temp.dialogueLangTranslated = ''
        temp.dialogueSpeakerTranslated = ''
        temp.dialogueSpeakerTranslated = ''

        pageData.value = temp
      })
  },
  { once: true }
)
</script>

<template>
  <td class="momotalk-dialogue momotalk-speaker">
    <div :class="{'momotalk-dialogue-sensei': checkDialogueSensei(dialogueType)}">
      <div :lang="dialogueLang">
        <div v-if="!checkDialogueSensei(dialogueType) && dialogueSpeaker" style="text-align: center;">
          <DialogueIcon :icon-url="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${currCharId}.webp`" />
          <br />
        </div>

        <span v-if="checkDialogueSensei(dialogueType)">{{ setting.username }}</span>
        <DialogueTranslated v-else :content-original="dialogueSpeaker" :content-translated="dialogueSpeakerTranslated" />
      </div>
    </div>
  </td>
  <td
    :class="['momotalk-dialogue', 'momotalk-text', 'momotalk-char', `momotalk-dialogue-bg-${dialogueBgColor}`, `${getClassDialogueSensei(dialogueType)}-td`]">
    <div :class="getClassDialogueSensei(dialogueType)" :lang="dialogueLang">
      <DialogueTranslated :content-original="convertMmtMsgToHtml(dialogueContentDecorated)"
                          :content-translated="convertMmtMsgToHtml(dialogueContentTranslated)" />
    </div>
  </td>
</template>