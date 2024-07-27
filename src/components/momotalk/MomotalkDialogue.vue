<script setup lang="ts">
import DialogueStudent from '@/components/momotalk/DialogueStudent.vue'
import { type Ref, ref, watch } from 'vue'
import { useSetting } from '@/stores/setting'
import { NexonLangMap } from '@/tool/Constant'
import { useRouter, useRoute } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH } from '@/tool/Constant'
import DialogueStudentMobile from '@/components/momotalk/DialogueStudentMobile.vue'
import { getLangData } from '@/tool/StoryTool'

// --------------------- I18N ---------------------
const setting = useSetting()
const i18nL1: Ref = ref(setting.i18n_lang1)
const i18nL2: Ref = ref(setting.i18n_lang2)
const i18nL3: Ref = ref(setting.i18n_lang3)
const langL1: Ref = ref(NexonLangMap[i18nL1.value])
const langL2: Ref = ref(NexonLangMap[i18nL2.value])
const langL3: Ref = ref(NexonLangMap[i18nL3.value])
watch(
  () => {
    return [setting.i18n_lang1, setting.i18n_lang2, setting.i18n_lang3]
  },
  () => {
    i18nL1.value = setting.i18n_lang1
    i18nL2.value = setting.i18n_lang2
    i18nL3.value = setting.i18n_lang3
    langL1.value = NexonLangMap[i18nL1.value]
    langL2.value = NexonLangMap[i18nL2.value]
    langL3.value = NexonLangMap[i18nL3.value]
  },
  { immediate: true }
)

// ------------------------------------------------
const screenWidth = useWindowSize().width
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    data_dialog: {
      required: true
    },
    data_char: {
      required: true
    },
    char_name: {
      required: true
    },
    bond_story_id: {
      type: Number,
      required: true
    }
  },
  computed: {
    charName() {
      return this.char_name
    }
  }
})
</script>

<template>
  <tr class="momotalk-dialogue-tr" v-if="screenWidth >= MOBILE_WIDTH">
    <DialogueStudent :dialogue-lang="langL1"
                     :dialogue-speaker="charName[i18nL1]"
                     :dialogue-content="getLangData(data_dialog.Message, i18nL1)"
                     :dialogue-lang-translated="''"
                     :dialogue-speaker-translated="''"
                     :dialogue-content-translated="''"
                     :dialogue-bg-color="data_dialog.MessageBgColor"
                     :dialogue-type="data_dialog.MessageCondition" />
    <DialogueStudent :dialogue-lang="langL2"
                     :dialogue-speaker="charName[i18nL2]"
                     :dialogue-content="getLangData(data_dialog.Message, i18nL2)"
                     :dialogue-lang-translated="''"
                     :dialogue-speaker-translated="''"
                     :dialogue-content-translated="''"
                     :dialogue-bg-color="data_dialog.MessageBgColor"
                     :dialogue-type="data_dialog.MessageCondition" />
    <DialogueStudent :dialogue-lang="langL3"
                     :dialogue-speaker="charName[i18nL3]"
                     :dialogue-content="getLangData(data_dialog.Message, i18nL3)"
                     :dialogue-lang-translated="''"
                     :dialogue-speaker-translated="''"
                     :dialogue-content-translated="''"
                     :dialogue-bg-color="data_dialog.MessageBgColor"
                     :dialogue-type="data_dialog.MessageCondition" />
  </tr>
  <tr class="momotalk-dialogue-tr" v-if="screenWidth < MOBILE_WIDTH">
    <DialogueStudentMobile :dialogueType="data_dialog.MessageCondition"
                           :dialogueBgColor="data_dialog.MessageBgColor"
                           :dialogueLang1="langL1"
                           :dialogueSpeakerLang1="charName[i18nL1]"
                           :dialogueContentLang1="getLangData(data_dialog.Message, i18nL1)"
                           :dialogueLang2="langL2"
                           :dialogueSpeakerLang2="charName[i18nL2]"
                           :dialogueContentLang2="getLangData(data_dialog.Message, i18nL2)"
                           :dialogueLang3="langL3"
                           :dialogueSpeakerLang3="charName[i18nL3]"
                           :dialogueContentLang3="getLangData(data_dialog.Message, i18nL3)" />
  </tr>
  <tr class="momotalk-dialogue-tr" v-if="data_dialog.FavorScheduleId !== 0">
    <td :colspan="screenWidth >= MOBILE_WIDTH ? 6 : 2"
        style="text-align: center; background-color: var(--color-ba-mmt); font-size: 1.2em;">
      <b><a :href="'/scenario/' + bond_story_id" target="_blank">前往故事</a></b>
    </td>
  </tr>
</template>

<style scoped>

</style>