<script setup lang="ts">
import { inject, type PropType } from 'vue'
import {
  type CommonStoryDataCmd,
  type CommonStoryExtBgmDataEntry,
  symbolForCommonStoryExtBgData,
  symbolForCommonStoryExtBgmData,
  symbolForDirectoryDataCommonI18nFileScenarioBgm,
  symbolForDirectoryDataCommonI18nFileScenarioSound
} from '@/types/OutsourcedData'
import DialogueCmdEntryAudio from '@/components/scenario/cmd/DialogueCmdEntryAudio.vue'
import { useSetting } from '@/stores/setting'
import { getStaticCdnBasepath } from '@/tool/HttpRequest'

const props = defineProps({
  dataEntry: {
    type: Object as PropType<CommonStoryDataCmd>,
    required: true
  }
})

const i18nBgm = inject(symbolForDirectoryDataCommonI18nFileScenarioBgm)!
const i18nSound = inject(symbolForDirectoryDataCommonI18nFileScenarioSound)!
const catalogBg = inject(symbolForCommonStoryExtBgData)!
const catalogBgm = inject(symbolForCommonStoryExtBgmData)!

const currSiteLang = useSetting().ui_lang

function queryBgm(id: string): [CommonStoryExtBgmDataEntry | null, string] {
  const catalogEntry = catalogBgm.value[id]
  const i18nEntry = i18nBgm.value[currSiteLang][id]
  if (catalogEntry && i18nEntry) {
    return [catalogEntry, i18nEntry]
  } else {
    if (catalogEntry)
      return [catalogEntry, '']
    if (i18nEntry)
      return [null, i18nEntry]
    return [null, '']
  }
}
</script>

<template>
  <template v-if="dataEntry.Payload.Type === 'sound'">
    <DialogueCmdEntryAudio :audio-display-name="i18nSound[currSiteLang][dataEntry.Payload.Id] || dataEntry.Payload.Id"
                           :audio-src="`${getStaticCdnBasepath('static')}/ba/Audio_Sound/${dataEntry.Payload.Id.toLowerCase()}.wav`"
                           :audio-loop-start="0"
                           :audio-loop-end="0" />
  </template>

</template>

<style scoped>

</style>