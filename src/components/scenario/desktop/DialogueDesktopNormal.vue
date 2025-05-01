<script setup lang="ts">
/* speaker */
import { computed, defineProps, inject, defineAsyncComponent } from 'vue'
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import DialogueIcon from '@/components/DialogueIcon.vue'
import {
  getScenarioCharacterSmallPortraitPath,
  getScenarioPopupFilenamePath
} from '@/tool/StoryTool'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import DialogueCmdEntry from '@/components/scenario/DialogueCmdEntry.vue'
import { symbolForScenarioUiDataDisplayType } from '@/tool/components/Scenario'
import { useSetting } from '@/stores/setting'
import { useDialog } from 'primevue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  dialogueLang: {
    type: String,
    required: true
  },
  dialogueCharacter: {
    type: String,
    required: true
  },
  dialogueCharacterTranslated: {
    type: String,
    required: true
  },
  dialogueCharacterNickname: {
    type: String,
    required: true
  },
  dialogueCharacterNicknameTranslated: {
    type: String,
    required: true
  },
  dialogueCharacterImage: {
    type: String,
    required: true
  },
  dialogueContent: {
    type: String,
    required: true
  },
  dialogueContentTranslated: {
    type: String,
    required: true
  },
  dialogueSelectionGroup: {
    type: Number,
    required: true
  },
  dialogueSelectionToGroup: {
    type: Number,
    required: true
  },
  dialogueTextColor: {
    type: String,
    required: true
  },
  dialogueAbsolutePos: {
    type: Number,
    required: true
  },
  dialoguePopupFilename: {
    type: String,
    required: true
  },
  dialogueSoundFilename: {
    type: String,
    required: true
  }
})

const scenarioDisplayMode = inject(symbolForScenarioUiDataDisplayType)!
const setting = useSetting()
const i18n = useI18n()
const dialogueCharacterNicknameDisplay = computed<string>(() => {
  const translation = props.dialogueCharacterNicknameTranslated

  // 仅显示翻译
  if (setting.auto_i18n_showauto) {
    if (translation !== '') {
      return `<span lang="${setting.auto_i18n_lang}">${props.dialogueCharacterNicknameTranslated}</span>`
    } else {
      return `<span lang="${props.dialogueLang}">${props.dialogueCharacterNickname}</span>`
    }
  } else {
    if (props.dialogueCharacterNicknameTranslated !== '' && !setting.auto_i18n_showauto) {
      return `<span lang="${props.dialogueLang}">${props.dialogueCharacterNickname}</span>&nbsp;/&nbsp;<span lang="${setting.auto_i18n_lang}">${props.dialogueCharacterNicknameTranslated}</span>`
    } else {
      return `<span lang="${props.dialogueLang}">${props.dialogueCharacterNickname}</span>`
    }
  }
})

const componentDialogVoiceDetail = defineAsyncComponent(
  () => import('../ScenarioDialogueCharacterDialog.vue')
)
const pvDialog = useDialog()
function showCharacterDetailDialog() {
  pvDialog.open(componentDialogVoiceDetail, {
    props: {
      header: i18n.t('comp-scenario-character-dialog-title'),
      modal: true,
      closable: true,
      dismissableMask: true,
      draggable: false,
      style: {
        width: '50vw'
      },
      breakpoints: {
        '800px': '90vw'
      }
    },
    data: {
      data_type: 'desktop',
      langs: [props.dialogueLang],
      characterName: [props.dialogueCharacter],
      characterNickname: [props.dialogueCharacterNickname],
      characterNameTranslated: [props.dialogueCharacterTranslated],
      characterNicknameTranslated: [props.dialogueCharacterNicknameTranslated]
    }
  })
}
</script>

<template>
  <td :lang="dialogueLang" class="scenario-speaker scenario-dialogue">
    <div
      v-tooltip.hover.right="{
        value: dialogueCharacterNicknameDisplay,
        escape: false,
        autoHide: false,
        pt: { root: { style: { maxWidth: '20em' } } }
      }"
      @click="showCharacterDetailDialog()"
      v-if="dialogueCharacter !== ''"
    >
      <DialogueIcon :icon-url="getScenarioCharacterSmallPortraitPath(dialogueCharacterImage)" />
      <ScenarioTranslatedDialogue
        :content-original="dialogueCharacter"
        :content-translated="dialogueCharacterTranslated"
        :content-original-lang="dialogueLang"
        :style="{ color: dialogueTextColor }"
      />
    </div>
  </td>
  <td :lang="dialogueLang" class="scenario-text scenario-dialogue">
    <template v-if="dialogueSoundFilename !== '' && scenarioDisplayMode === 0">
      <DialogueCmdEntry
        :data-entry="{
          ActualPos: -1,
          AbsolutePos: dialogueAbsolutePos,
          DataType: 'cmd',
          Payload: { Type: 'sound', Id: dialogueSoundFilename }
        }"
      />
    </template>
    <template v-if="dialoguePopupFilename">
      <img
        :src="getScenarioPopupFilenamePath(dialoguePopupFilename)"
        class="momotalk-dialogue-img"
      />
      <br />
    </template>
    <ScenarioTranslatedDialogue
      :content-original="dialogueContent"
      :content-original-lang="dialogueLang"
      :content-translated="dialogueContentTranslated"
      :style="{ color: dialogueTextColor }"
    />
    <DialogueInfo
      :dialogue-selection-to-group="dialogueSelectionToGroup"
      :dialogue-selection-group="dialogueSelectionGroup"
      :dialogue-absolute-pos="dialogueAbsolutePos"
    />
  </td>
</template>

<style scoped></style>
