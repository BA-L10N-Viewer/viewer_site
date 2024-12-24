<script setup lang="ts">
import { computed } from 'vue'
import { useSetting } from '@/stores/setting'
import { checkDialogueSensei, convertMmtMsgToHtml, getClassDialogueSensei, mmtMessageContentDecorator } from '@/tool/StoryTool'
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
const currCharId = computed(() => {
  const temp = window.location.pathname.split('/').slice(-1)[0]
  if (temp.length === 7) {
    // 在ScenarioUi里面嵌套的显示
    return temp.slice(0, 5)
  }
  return temp
})

const setting = useSetting()
</script>

<template>
  <td class="momotalk-dialogue momotalk-speaker">
    <div :class="{'momotalk-dialogue-sensei': checkDialogueSensei(dialogueType)}">
      <div :lang="dialogueLang">
        <div v-if="!checkDialogueSensei(dialogueType) && dialogueSpeaker" style="text-align: center;">
          <DialogueIcon :icon-url="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${currCharId}.webp`" />
        </div>

        <span v-if="checkDialogueSensei(dialogueType)">{{ setting.username }}</span>
        <DialogueTranslated v-else :content-original="dialogueSpeaker" :content-original-lang="dialogueLang" :content-translated="dialogueSpeakerTranslated" />
      </div>
    </div>
  </td>
  <td
    :class="['momotalk-dialogue', 'momotalk-text', 'momotalk-char', `momotalk-dialogue-text-${dialogueBgColor}`, `${getClassDialogueSensei(dialogueType)}-td`]">
    <div :class="getClassDialogueSensei(dialogueType)" :lang="dialogueLang">
      <DialogueTranslated :content-original="convertMmtMsgToHtml(mmtMessageContentDecorator(dialogueType, dialogueContent))"
                          :content-original-lang="dialogueLang"
                          :content-translated="convertMmtMsgToHtml(mmtMessageContentDecorator(dialogueType, dialogueContentTranslated))"
                          :content-translated-blank-value="['&amp;nbsp;&amp;lt;', '&amp;gt;&amp;nbsp;', '> ', ' <']" />
    </div>
  </td>
</template>
