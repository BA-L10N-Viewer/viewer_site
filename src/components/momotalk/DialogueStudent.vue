<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSignalI18n } from '@/stores/signal'
import { useSetting } from '@/stores/setting'
import { checkDialogueSensei, convertNewlineToBr, getClassDialogueSensei, getLangCode } from '@/tool/StoryTool'

const signalI18n = useSignalI18n()
var pageData = ref({})
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
        let temp = Object.assign({}, pageData.value)
        temp.dialogueLangTranslated = ''
        temp.dialogueSpeakerTranslated = ''
        temp.dialogueSpeakerTranslated = ''

        pageData.value = temp
      })
  },
  { once: true }
)
</script>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { NexonI18nData } from '@/tool/Type'

export default defineComponent({
  props: {
    dialogueLang: {
      type: String,
      required: true
    },
    dialogueSpeaker: {
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
  },
  computed: {
    dialogueContentDecorated() {
      if (this.dialogueType === 'Answer') {
        return this.dialogueContent + '&nbsp;&lt;'
      } else if (this.dialogueType === 'Feedback') {
        return '&gt;&nbsp;' + this.dialogueContent
      } else {
        return this.dialogueContent
      }
    }
  }
})


</script>

<template>
  <td class="momotalk-dialogue momotalk-speaker">
    <div :class="{'momotalk-dialogue-sensei': checkDialogueSensei(dialogueType)}">
      <div :lang="getLangCode(dialogueLang)">
        <span v-if="checkDialogueSensei(dialogueType)">{{ setting.username }}</span>
        <span v-else>{{ dialogueSpeaker }}</span>
      </div>
      <div v-if="dialogueSpeakerTranslated !== ''"
           :lang="getLangCode(dialogueLangTranslated)">
        <br /><i>{{ dialogueSpeakerTranslated }}</i>
      </div>
    </div>
  </td>
  <td
    :class="['momotalk-dialogue', 'momotalk-text', 'momotalk-char', `momotalk-dialogue-bg-${dialogueBgColor}`, `${getClassDialogueSensei(dialogueType)}-td`]">
    <div :class="getClassDialogueSensei(dialogueType)">
      <div :lang="getLangCode(dialogueLang)"
           v-html="convertNewlineToBr(dialogueContentDecorated)"></div>
      <div v-if="dialogueSpeakerTranslated !== ''"
           :lang="getLangCode(dialogueLangTranslated)">
        <br /><i v-html="convertNewlineToBr(dialogueContentTranslated)"></i></div>
    </div>
  </td>
</template>