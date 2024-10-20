<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSetting } from '@/stores/setting'
import { useI18n } from 'vue-i18n'
import CharVoiceNexonNormal from '@/components/voice/CharVoiceNexonNormal.vue'
import CharVoiceNexonBattle from '@/components/voice/CharVoiceNexonBattle.vue'
import CharVoiceNexonEvent from '@/components/voice/CharVoiceNexonEvent.vue'
import type { NexonCharVoiceBattle, NexonCharVoiceEntry } from '@/types/OutsourcedDataVoice'
import { httpGetJsonAsync } from '@/tool/HttpRequest'
import { SchaleDbStuInfoFullVoicelineCategory } from '@/types/OutsourcedData'

const props = defineProps(
  {
    charId: {
      type: [Number, String],
      required: true
    }
  }
)

const setting = useSetting()
const i18n = useI18n()

const isLoading = ref(true)
const dataChar : NexonCharVoiceEntry = {} as unknown as NexonCharVoiceEntry
const dataVoiceAvailability = [false, false, false, false]

async function loadData() {
  await Promise.allSettled([
    httpGetJsonAsync(dataChar, `/data/common/voice/${props.charId}.json`)
  ])

  for (const [idx, category] of SchaleDbStuInfoFullVoicelineCategory.entries()) {
    const currCategory = dataChar[category]
    if (currCategory) {
      if (currCategory.length !== 0) {
        dataVoiceAvailability[idx] = true
      }
    }
  }
}

onMounted(async () => {
  await loadData()

  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-if="!isLoading">
    <h3>Char Voice Nexon UI</h3>
    <KeepAlive>
      <el-tabs
        v-model="setting.char_voice_data_curr_tab"
        type="border-card"
        class="demo-tabs"
      >
        <el-tab-pane :label="i18n.t('char-voice-ui-select-tab-normal')" name="Normal" v-if="dataVoiceAvailability[0]">
          <component :is="CharVoiceNexonNormal" :data="dataChar.Normal" />
        </el-tab-pane>
        <el-tab-pane :label="i18n.t('char-voice-ui-select-tab-lobby')" name="Lobby" v-if="dataVoiceAvailability[1]">
          <component :is="CharVoiceNexonNormal" :data="dataChar.Lobby!" />
        </el-tab-pane>
        <el-tab-pane :label="i18n.t('char-voice-ui-select-tab-battle')" name="Battle" v-if="dataVoiceAvailability[2]">
          <component :is="CharVoiceNexonBattle" :data="dataChar.Battle!" />
        </el-tab-pane>
        <el-tab-pane :label="i18n.t('char-voice-ui-select-tab-event')" name="Event" v-if="dataVoiceAvailability[3]">
          <component :is="CharVoiceNexonEvent" :data="dataChar.Event!" />
        </el-tab-pane>
      </el-tabs>
    </KeepAlive>
  </div>
</template>

<style scoped>

</style>