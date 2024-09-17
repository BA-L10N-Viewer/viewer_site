<script setup lang="ts">
import { computed } from 'vue'
import { dialogueContentDecorator, convertNewlineToBr, checkDialogueSensei, getLangCode, getClassDialogueSensei } from '@/tool/StoryTool'
import { useSetting } from '@/stores/setting'
import { getStaticCdnBasepath } from '@/tool/HttpRequest'
import DialogueIcon from '@/components/DialogueIcon.vue'

const props = defineProps({
  dialogueLang1: {
    type: String,
    required: true
  },
  dialogueLang2: {
    type: String,
    required: true
  },
  dialogueLang3: {
    type: String,
    required: true
  },
  dialogueSpeakerLang1: {
    type: String,
    required: true
  },
  dialogueSpeakerLang2: {
    type: String,
    required: true
  },
  dialogueSpeakerLang3: {
    type: String,
    required: true
  },
  dialogueContentLang1: {
    type: String,
    required: true
  },
  dialogueContentLang2: {
    type: String,
    required: true
  },
  dialogueContentLang3: {
    type: String,
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
const dialogueLangs = computed(() => [
  props.dialogueLang1,
  props.dialogueLang2,
  props.dialogueLang3
])
const dialogueSpeakers = computed(() => [
  props.dialogueSpeakerLang1,
  props.dialogueSpeakerLang2,
  props.dialogueSpeakerLang3
])
/*const dialogueContents = computed(() => [
  props.dialogueContentLang1,
  props.dialogueContentLang2,
  props.dialogueContentLang3
])*/
const dialogueContentsDecorated = computed(() => [
  dialogueContentDecorator(props.dialogueType, props.dialogueContentLang1),
  dialogueContentDecorator(props.dialogueType, props.dialogueContentLang2),
  dialogueContentDecorator(props.dialogueType, props.dialogueContentLang3)
])
const currCharId = computed(() => window.location.pathname.split('/').slice(-1)[0])

const setting = useSetting()
</script>

<template>
  <td class="momotalk-dialogue momotalk-speaker">
    <div :class="{'momotalk-dialogue-sensei': checkDialogueSensei(dialogueType)}">
      <div v-if="!checkDialogueSensei(dialogueType)" style="text-align: center;">
        <DialogueIcon :icon-url="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${currCharId}.webp`" />
        <br />
      </div>

      <div v-for="(speaker, idx) in dialogueSpeakers" :lang="getLangCode(dialogueLangs[idx])" :key="idx">
        <span v-if="checkDialogueSensei(dialogueType)">{{ setting.username }}</span>
        <span v-else>{{ speaker }}</span>
        <br v-if="idx + 1 == dialogueSpeakers.length" />
      </div>
    </div>
  </td>
  <td
    :class="['momotalk-dialogue', 'momotalk-text', 'momotalk-char', `momotalk-dialogue-bg-${dialogueBgColor}`, `${getClassDialogueSensei(dialogueType)}-td`]">
    <div v-for="(content, idx) in dialogueContentsDecorated" :class="getClassDialogueSensei(dialogueType)" :key="idx">
      <span :lang="getLangCode(dialogueLangs[idx])"
           v-html="convertNewlineToBr(content)"></span>
      <br v-if="idx + 1 == dialogueSpeakers.length" />
    </div>
  </td>
</template>

<style scoped>
.momotalk-speaker {
  text-align: left !important;
}
</style>