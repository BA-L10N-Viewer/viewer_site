<script setup lang="ts">
/* title place st stm nextEpisode na */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

import { defineProps, type PropType, inject, type Ref, ref } from 'vue'
import type {
  CommonStoryDataDialogDataType,
  CommonStoryDataDialogTextColor,
  NexonL10nData, NexonL10nDataLang
} from '@/types/OutsourcedData'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import type { MlForScenario } from '@/types/MachineTranslation'

const props = defineProps({
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
  dialogueDataType: {
    type: String as PropType<CommonStoryDataDialogDataType>,
    required: true
  },
  dialogueTextColor: {
    type: String as PropType<CommonStoryDataDialogTextColor>,
    required: true
  },
  entry_pos: {
    type: Number,
    required: true
  }
})

let ML_table: Ref<MlForScenario> = ref(inject('ML_table') as any)
</script>

<template>
  <td v-if="dialogueDataType === 'title' || dialogueDataType === 'nextEpisode'"
      colspan="2" class="story-dialogue-center">
    <span :lang="i18nToUiLangAll[0]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0]])"
        :content-translated="ML_table[i18nLangAll[0]][entry_pos]['dialogue']"
        :is_after_br="true" />
    </span>
    <hr class="mobile-lang-hr" />
    <span :lang="i18nToUiLangAll[1]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1]])"
        :content-translated="ML_table[i18nLangAll[1]][entry_pos]['dialogue']"
        :is_after_br="true" />
    </span>
    <hr class="mobile-lang-hr" />
    <span :lang="i18nToUiLangAll[2]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2]])"
        :content-translated="ML_table[i18nLangAll[2]][entry_pos]['dialogue']"
        :is_after_br="true" />
    </span>
  </td>
  <td v-else-if="dialogueDataType === 'na'" colspan="2" class="story-dialogue-na">
    <span :lang="i18nToUiLangAll[0]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0]])"
        :content-translated="ML_table[i18nLangAll[0]][entry_pos]['dialogue']"
        :is_after_br="true" />
    </span>
    <hr class="mobile-lang-hr" />
    <span :lang="i18nToUiLangAll[1]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1]])"
        :content-translated="ML_table[i18nLangAll[1]][entry_pos]['dialogue']"
        :is_after_br="true" />
    </span>
    <hr class="mobile-lang-hr" />
    <span :lang="i18nToUiLangAll[2]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2]])"
        :content-translated="ML_table[i18nLangAll[2]][entry_pos]['dialogue']"
        :is_after_br="true" />
    </span>
    <DialogueInfo :dialogue-selection-to-group="dialogueSelectionToGroup"
                  :dialogue-selection-group="dialogueSelectionGroup" />
  </td>
  <td v-else class="story-dialogue-other" colspan="2">
    <span :lang="i18nToUiLangAll[0]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[0]])"
        :content-translated="ML_table[i18nLangAll[0]][entry_pos]['dialogue']"
        :is_after_br="true" />
    </span>
    <hr class="mobile-lang-hr" />
    <span :lang="i18nToUiLangAll[1]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[1]])"
        :content-translated="ML_table[i18nLangAll[1]][entry_pos]['dialogue']"
        :is_after_br="true" />
    </span>
    <hr class="mobile-lang-hr" />
    <span :lang="i18nToUiLangAll[2]">
      <ScenarioTranslatedDialogue
        :content-original="replaceStoryLineUsernameBlank(dialogueContent[i18nLangAll[2]])"
        :content-translated="ML_table[i18nLangAll[2]][entry_pos]['dialogue']"
        :is_after_br="true" />
    </span>
  </td>
</template>

<style scoped>
td {
  color: white;
  background-color: #2C4563;
}

.story-dialogue-center {
  text-align: center;
  background-color: var(--color-ba-logo);
}

.story-dialogue-na {
  text-align: center;
  font-style: italic;
}

.story-dialogue-other {
  text-align: center;
}
</style>