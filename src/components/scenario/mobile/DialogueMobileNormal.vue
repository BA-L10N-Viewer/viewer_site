<script setup lang="ts">
/* speaker */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import {
  i18nLangAll,
  i18nToUiLangAll,
  listOfPosOfSelectedLangForMobile,
  numberOfSelectedLangForMobile
} from '@/tool/ConstantComputed'
import {
  getNexonL10nData,
  getScenarioCharacterSmallPortraitPath,
  getScenarioPopupFilenamePath,
  replaceStoryLineUsernameBlank
} from '@/tool/StoryTool'

import { defineAsyncComponent, defineProps, inject, type PropType, type Ref } from 'vue'
import type { NexonL10nData, NexonL10nDataLang } from '@/types/OutsourcedData'
import DialogueIcon from '@/components/DialogueIcon.vue'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import type { MlForScenario } from '@/types/MachineTranslation'
import { i18nMobileLoopIdx } from '@/tool/Constant'
import { symbolForScenarioMtData } from '@/tool/translate/MtUtils'
import DialogueCmdEntry from '@/components/scenario/DialogueCmdEntry.vue'
import { symbolForScenarioUiDataDisplayType } from '@/tool/components/Scenario'
import { useSetting } from '@/stores/setting'
import { useDialog } from 'primevue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  dialogueCharacter: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  dialogueCharacterNickname: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  dialogueCharacterImage: {
    type: String,
    required: true
  },
  dialogueContent: {
    type: {} as PropType<NexonL10nData>,
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
  entry_pos: {
    type: Number,
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

let ML_table: Ref<MlForScenario> = inject(symbolForScenarioMtData)!
const scenarioDisplayMode = inject(symbolForScenarioUiDataDisplayType)!

const i18n = useI18n()
const setting = useSetting()
function getDialogueCharacterNicknameDisplay(entry_pos: number) {
  let result = ''

  for (const idx of i18nMobileLoopIdx) {
    const lang = i18nLangAll.value[idx]
    const lang_html = i18nToUiLangAll.value[idx]

    if ((lang as string) !== 'null') {
      const translation =
        ML_table.value[lang as NexonL10nDataLang].get(String(entry_pos))?.['nickname'] || ''

      // 仅显示翻译
      if (setting.auto_i18n_showauto) {
        if (translation !== '') {
          result += `<span lang="${setting.auto_i18n_lang}">${translation}</span>`
        } else {
          result += `<span lang="${lang_html}">${getNexonL10nData(props.dialogueCharacterNickname, lang)}</span>`
        }
        // 原文和译文均显示
      } else {
        result += `<span lang="${lang_html}">${getNexonL10nData(props.dialogueCharacterNickname, lang)}</span>`

        if (translation !== '' && !setting.auto_i18n_showauto) {
          result += `&nbsp;/&nbsp;<span lang="${setting.auto_i18n_lang}">${translation}</span>`
        }
      }

      result += '<br />'
    }
  }

  return result
}

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
      data_type: 'mobile',
      langs: i18nLangAll.value.filter((value) => (value as string) !== 'null'),
      characterName: i18nLangAll.value
        .filter((value) => (value as string) !== 'null')
        .map((value) => getNexonL10nData(props.dialogueCharacter, value)),
      characterNickname: i18nLangAll.value
        .filter((value) => (value as string) !== 'null')
        .map((value) => getNexonL10nData(props.dialogueCharacterNickname, value)),
      characterNameTranslated: i18nLangAll.value
        .filter((value) => (value as string) !== 'null')
        .map((value) => ML_table.value[value].get(String(props.entry_pos))?.['name'] || ''),
      characterNicknameTranslated: i18nLangAll.value
        .filter((value) => (value as string) !== 'null')
        .map((value) => ML_table.value[value].get(String(props.entry_pos))?.['nickname'] || '')
    }
  })
}
</script>

<template>
  <td class="scenario-speaker scenario-dialogue">
    <div
      v-tooltip.hover.right="{
        value: getDialogueCharacterNicknameDisplay(entry_pos),
        escape: false,
        autoHide: false,
        pt: { root: { style: { maxWidth: '20em' } } }
      }"
      @click="showCharacterDetailDialog()"
      v-if="getNexonL10nData(dialogueCharacter, 'j_ja') !== ''"
    >
      <DialogueIcon :icon-url="getScenarioCharacterSmallPortraitPath(dialogueCharacterImage)" />
      <template v-for="idx in i18nMobileLoopIdx" :key="idx">
        <template v-if="(i18nLangAll[idx] as string) !== 'null'">
          <span :lang="i18nToUiLangAll[idx]">
            <ScenarioTranslatedDialogue
              :content-original="getNexonL10nData(dialogueCharacter, i18nLangAll[idx])"
              :content-original-lang="i18nToUiLangAll[idx]"
              :content-translated="
                ML_table[i18nLangAll[idx]].get(String(entry_pos))?.['name'] || ''
              "
              :style="{ color: dialogueTextColor }"
              :is_after_br="true"
            />
          </span>
        </template>
      </template>
    </div>
  </td>
  <td class="scenario-text scenario-dialogue">
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
    <template v-for="(langIdx, idx) in listOfPosOfSelectedLangForMobile" :key="langIdx">
      <template v-if="(i18nLangAll[langIdx] as string) !== 'null'">
        <span :lang="i18nToUiLangAll[langIdx]">
          <ScenarioTranslatedDialogue
            :content-original="
              replaceStoryLineUsernameBlank(getNexonL10nData(dialogueContent, i18nLangAll[langIdx]))
            "
            :content-original-lang="i18nToUiLangAll[langIdx]"
            :content-translated="
              ML_table[i18nLangAll[langIdx]].get(String(entry_pos))?.['dialogue'] || ''
            "
            :style="{ color: dialogueTextColor }"
            :is_after_br="true"
          />
        </span>
        <hr class="mobile-lang-hr" v-if="!(idx + 1 === numberOfSelectedLangForMobile)" />
      </template>
    </template>
    <DialogueInfo
      :dialogue-selection-to-group="dialogueSelectionToGroup"
      :dialogue-selection-group="dialogueSelectionGroup"
      :dialogue-absolute-pos="dialogueAbsolutePos"
    />
  </td>
</template>

<style scoped></style>
