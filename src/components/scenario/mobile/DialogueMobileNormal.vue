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

import { defineProps, inject, type PropType, type Ref, ref } from 'vue'
import type { NexonL10nData } from '@/types/OutsourcedData'
import DialogueIcon from '@/components/DialogueIcon.vue'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import type { MlForScenario } from '@/types/MachineTranslation'
import { i18nMobileLoopIdx } from '@/tool/Constant'
import { symbolForScenarioMtData } from '@/tool/translate/MtUtils'

const props = defineProps({
  dialogueCharacter: {
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
  }
})

let ML_table: Ref<MlForScenario> = inject(symbolForScenarioMtData)!
</script>

<template>
  <td class="scenario-speaker scenario-dialogue">
    <DialogueIcon :icon-url="getScenarioCharacterSmallPortraitPath(dialogueCharacterImage)" />
    <template v-for="idx in i18nMobileLoopIdx" :key="idx">
      <template v-if="i18nLangAll[idx] as string !== 'null'">
        <span :lang="i18nToUiLangAll[idx]">
          <ScenarioTranslatedDialogue :content-original="getNexonL10nData(dialogueCharacter,i18nLangAll[idx])"
                                      :content-original-lang="i18nToUiLangAll[idx]"
                                      :content-translated="ML_table[i18nLangAll[idx]][entry_pos]['name']"
                                      :style="{'color': dialogueTextColor}"
                                      :is_after_br="true" />
        </span>
      </template>
    </template>
  </td>
  <td class="scenario-text scenario-dialogue">
    <img :src="getScenarioPopupFilenamePath(dialoguePopupFilename)"
         v-if="dialoguePopupFilename"
         class="momotalk-dialogue-img" />
    <br>
    <template v-for="(langIdx, idx) in listOfPosOfSelectedLangForMobile" :key="langIdx">
      <template v-if="i18nLangAll[langIdx] as string !== 'null'">
        <span :lang="i18nToUiLangAll[langIdx]">
          <ScenarioTranslatedDialogue
            :content-original="replaceStoryLineUsernameBlank(getNexonL10nData(dialogueContent,i18nLangAll[langIdx]))"
            :content-original-lang="i18nToUiLangAll[langIdx]"
            :content-translated="ML_table[i18nLangAll[langIdx]][entry_pos]['dialogue']"
            :style="{'color': dialogueTextColor}"
            :is_after_br="true" />
        </span>
        <hr class="mobile-lang-hr" v-if="!(idx + 1 === numberOfSelectedLangForMobile)" />
      </template>
    </template>
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup"
                  :dialogue-absolute-pos="dialogueAbsolutePos"/>
  </td>
</template>

<style scoped>

</style>