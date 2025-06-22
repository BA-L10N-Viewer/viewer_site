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
import { getScenarioPopupFilenamePath } from '@/tool/StoryTool'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  dataEntry: {
    type: Object as PropType<CommonStoryDataCmd>,
    required: true
  }
})

const i18n = useI18n()

const i18nBgm = inject(symbolForDirectoryDataCommonI18nFileScenarioBgm)!
const i18nSound = inject(symbolForDirectoryDataCommonI18nFileScenarioSound)!
const catalogBg = inject(symbolForCommonStoryExtBgData)!
const catalogBgm = inject(symbolForCommonStoryExtBgmData)!

const currSiteLang = useSetting().ui_lang

function queryBgm(id: number): [CommonStoryExtBgmDataEntry | null, string] {
  const catalogEntry = catalogBgm.value[String(id)]
  const i18nEntry = i18nBgm.value[currSiteLang][String(id)]
  if (catalogEntry && i18nEntry) {
    return [catalogEntry, i18nEntry]
  } else {
    if (catalogEntry) return [catalogEntry, '']
    if (i18nEntry) return [null, i18nEntry]
    return [null, '']
  }
}

function queryBgmPath(id: number): string {
  const catalogEntry = catalogBgm.value[String(id)]

  if (catalogEntry) {
    return catalogEntry.Path.split('/').slice(-1)[0].toLowerCase() + '.ogg'
  } else {
    return ''
  }
}

function queryBgmLoopPara(id: number): [number, number] {
  const catalogEntry = catalogBgm.value[String(id)]

  if (catalogEntry) {
    return [catalogEntry.LoopStartTime, catalogEntry.LoopEndTime]
  } else {
    return [0, 999999]
  }
}

function queryBg(id: number): string {
  const catalogEntry = catalogBg.value[id]
  if (catalogEntry) {
    return catalogEntry.BGFileName.split('/').slice(-1)[0].toLowerCase() + '.jpg'
  } else {
    return ''
  }
}
</script>

<template>
  <template v-if="dataEntry.Payload.Type === 'sound'">
    <DialogueCmdEntryAudio
      :audio-display-name="i18nSound[currSiteLang][dataEntry.Payload.Id] || dataEntry.Payload.Id"
      :audio-src="`${getStaticCdnBasepath('static')}/ba/Audio_Sound/${dataEntry.Payload.Id.toLowerCase()}.wav`"
      :audio-loop-start="0"
      :audio-loop-end="999999"
      :audio-should-loop="false"
    />
  </template>
  <template v-else-if="dataEntry.Payload.Type === 'sound_popup'">
    <img :src="getScenarioPopupFilenamePath(dataEntry.Payload.Data[1])" class="scenario-bg-img" />
    <br />
    <DialogueCmdEntryAudio
      :audio-display-name="
        i18nSound[currSiteLang][dataEntry.Payload.Data[0]] || dataEntry.Payload.Data[0]
      "
      :audio-src="`${getStaticCdnBasepath('static')}/ba/Audio_Sound/${dataEntry.Payload.Data[0].toLowerCase()}.wav`"
      :audio-loop-start="0"
      :audio-loop-end="999999"
    />
  </template>
  <template v-else-if="dataEntry.Payload.Type === 'bg'">
    <div style="text-align: center">
      <img
        :src="`${getStaticCdnBasepath('static')}/ba/03_01_Background/${queryBg(dataEntry.Payload.Id)}`"
        class="scenario-bg-img"
        :title="queryBg(dataEntry.Payload.Id)"
      />
      <br />
    </div>
  </template>
  <template v-else-if="dataEntry.Payload.Type === 'bgm'">
    <DialogueCmdEntryAudio
      :audio-display-name="queryBgm(dataEntry.Payload.Id)[1] || queryBgmPath(dataEntry.Payload.Id)"
      :audio-src="`${getStaticCdnBasepath('static')}/ba/Audio_BGM/${queryBgmPath(dataEntry.Payload.Id)}`"
      :audio-loop-start="queryBgmLoopPara(dataEntry.Payload.Id)[0]"
      :audio-loop-end="queryBgmLoopPara(dataEntry.Payload.Id)[1]"
      v-if="dataEntry.Payload.Id !== 999"
    />
    <DialogueCmdEntryAudio
      :audio-loop-end="0"
      :audio-loop-start="0"
      :audio-display-name="i18n.t('comp-scenario-dialogue-cmd-bgm-999')"
      audio-src=""
      :player-is-pause-button="true"
      :player-no-progress="true"
      :player-no-time="true"
      :player-no-volume="true"
      v-else
    />
  </template>
</template>

<style scoped></style>
