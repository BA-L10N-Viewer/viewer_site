<script setup lang="ts">
import type { NexonL10nDataLang } from '@/types/OutsourcedData'
import { inject, type Ref, computed } from 'vue'

import { useSetting } from '@/stores/setting'
import { useI18n } from 'vue-i18n'

import PvDataTable from 'primevue/datatable'
import PvColumn from 'primevue/column'
import { zip } from 'lodash'
import DialogueTranslated from '../DialogueTranslated.vue'

const setting = useSetting()

const dialogRef = inject<
  Ref<{
    data: {
      data_type: 'desktop' | 'mobile'
      langs: NexonL10nDataLang[]
      characterName: string[]
      characterNickname: string[]
      characterNameTranslated: string[]
      characterNicknameTranslated: string[]
    }
    close: () => void
  }>
>('dialogRef')!

const dialogData = dialogRef.value.data
const i18n = useI18n()

const dataForTable = computed(() => {
  const result = []
  for (const [lang, name, nickname, nameTranslated, nicknameTranslated] of zip(
    dialogData.langs,
    dialogData.characterName,
    dialogData.characterNickname,
    dialogData.characterNameTranslated,
    dialogData.characterNicknameTranslated
  )) {
    result.push({
      lang: lang,
      name: [name, nameTranslated],
      nickname: [nickname, nicknameTranslated]
    })
  }

  return result
})
</script>

<template>
  <template v-if="dialogData.data_type === 'desktop'">
    <h2 style="margin-top: 0">{{ $t('scenario-character-dialog-desktop-name') }}</h2>
    <p :lang="dialogData.langs[0]">{{ dialogData.characterName[0] }}</p>
    <p :lang="setting.auto_i18n_lang">{{ dialogData.characterNameTranslated[0] }}</p>
    <h2>{{ $t('scenario-character-dialog-desktop-nickname') }}</h2>
    <p :lang="dialogData.langs[0]">{{ dialogData.characterNickname[0] }}</p>
    <p :lang="setting.auto_i18n_lang">{{ dialogData.characterNicknameTranslated[0] }}</p>
  </template>
  <template v-else>
    <PvDataTable :value="dataForTable">
      <PvColumn
        field="lang"
        :header="i18n.t('scenario-character-dialog-mobile-table-lang')"
      ></PvColumn>
      <PvColumn field="name" :header="i18n.t('scenario-character-dialog-mobile-table-name')">
        <template #body="{ data }">
          <DialogueTranslated
            :content-original="data.name[0]"
            :content-original-lang="data.lang"
            :content-translated="data.name[1]"
          />
        </template>
      </PvColumn>
      <PvColumn
        field="nickname"
        :header="i18n.t('scenario-character-dialog-mobile-table-nickname')"
      >
        <template #body="{ data }">
          <DialogueTranslated
            :content-original="data.nickname[0]"
            :content-original-lang="data.lang"
            :content-translated="data.nickname[1]"
          />
        </template>
      </PvColumn>
    </PvDataTable>
  </template>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
