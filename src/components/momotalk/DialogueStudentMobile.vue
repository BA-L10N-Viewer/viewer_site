<script setup lang="ts">
import { convertNewlineToBr, checkDialogueSensei, getLangCode, getClassDialogueSensei } from '@/tool/StoryTool'
import { useSetting } from '@/stores/setting'

const setting = useSetting()
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import { dialogueContentDecorator } from '@/tool/StoryTool'

export default defineComponent({
  props: {
    'dialogueLang1': {
      type: String,
      required: true
    },
    'dialogueLang2': {
      type: String,
      required: true
    },
    'dialogueLang3': {
      type: String,
      required: true
    },
    'dialogueSpeakerLang1': {
      type: String,
      required: true
    },
    'dialogueSpeakerLang2': {
      type: String,
      required: true
    },
    'dialogueSpeakerLang3': {
      type: String,
      required: true
    },
    'dialogueContentLang1': {
      type: String,
      required: true
    },
    'dialogueContentLang2': {
      type: String,
      required: true
    },
    'dialogueContentLang3': {
      type: String,
      required: true
    },
    'dialogueBgColor': {
      type: String,
      required: true
    },
    'dialogueType': {
      type: String,
      required: true
    }
  },
  'computed': {
    'dialogueLangs': function() {
      return [this.dialogueLang1, this.dialogueLang2, this.dialogueLang3]
    },
    'dialogueSpeakers': function() {
      return [this.dialogueSpeakerLang1, this.dialogueSpeakerLang2, this.dialogueSpeakerLang3]
    },
    'dialogueContents': function() {
      return [this.dialogueContentLang1, this.dialogueContentLang2, this.dialogueContentLang3]
    },
    'dialogueContentsDecorated': function() {
      return [dialogueContentDecorator(this.dialogueType, this.dialogueContentLang1),
        dialogueContentDecorator(this.dialogueType, this.dialogueContentLang2),
        dialogueContentDecorator(this.dialogueType, this.dialogueContentLang3)]
    }
  }
})
</script>

<template>
  <td class="momotalk-dialogue momotalk-speaker">
    <div :class="{'momotalk-dialogue-sensei': checkDialogueSensei(dialogueType)}">
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