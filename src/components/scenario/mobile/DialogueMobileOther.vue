<script setup lang="ts">
/* title place st stm nextEpisode na */
import DialogueInfo from '@/components/scenario/DialogueInfo.vue'
import { i18nLangAll, i18nToUiLangAll } from '@/tool/ConstantComputed'
import { getNexonL10nData, replaceStoryLineUsernameBlank } from '@/tool/StoryTool'

import { defineProps, type PropType, inject, type Ref, ref } from 'vue'
import type {
  CommonStoryDataDialogDataType,
  CommonStoryDataDialogTextColor,
  NexonL10nData, NexonL10nDataLang
} from '@/types/OutsourcedData'
import ScenarioTranslatedDialogue from '@/components/DialogueTranslated.vue'
import type { MlForScenario } from '@/types/MachineTranslation'
import { i18nMobileLoopIdx } from '@/tool/Constant'

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

const htmlTdClassName = (() => {
  if (props.dialogueDataType === 'title' || props.dialogueDataType === 'nextEpisode') {
    return {'story-dialogue-center': true}
  } else if (props.dialogueDataType === 'na') {
    return {'story-dialogue-na': true}
  } else {
    return {'story-dialogue-other': true}
  }
})()
</script>

<template>
  <td colspan="2" :class="htmlTdClassName">
    <template v-for="idx in i18nMobileLoopIdx" :key="idx">
      <template v-if="i18nLangAll[idx] as string !== 'null'">
        <span :lang="i18nToUiLangAll[idx]">
          <ScenarioTranslatedDialogue
            :content-original="replaceStoryLineUsernameBlank(getNexonL10nData(dialogueContent,i18nLangAll[idx]))"
            :content-translated="ML_table[i18nLangAll[idx] as NexonL10nDataLang][entry_pos]['dialogue']"
            :is_after_br="true" />
        </span>
        <hr class="mobile-lang-hr" v-if="idx + 1 < i18nMobileLoopIdx.length" />
      </template>
    </template>
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