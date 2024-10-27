<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type SchaleDbStuInfoFull, SchaleDbStuInfoFullVoicelineCategory } from '@/types/OutsourcedData'
import { httpGetJsonAsync } from '@/tool/HttpRequest'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import CharVoiceTopSetting from '@/components/setting/CharVoiceTopSetting.vue'
import { CharVoiceUiTabAvailabilityDict, CharVoiceUiTabAvailabilityList } from '@/types/CharVoiceComp'

const props = defineProps(
  {
    charId: {
      type: [Number, String],
      required: true
    }
  }
)

const isLoading = ref(true)
const dataChar: SchaleDbStuInfoFull = {} as unknown as SchaleDbStuInfoFull
const dataTabAvailabilityList = CharVoiceUiTabAvailabilityList.slice(0)
const dataTabAvailabilityDict = Object.assign({}, CharVoiceUiTabAvailabilityDict)

async function loadData() {
  await Promise.allSettled([
    httpGetJsonAsync(dataChar, `/data/common/schale_stu/${props.charId}.json`)
  ])

  // 更新可用性Dict
  for (const key of SchaleDbStuInfoFullVoicelineCategory) {
    if (key === 'Battle') {
      dataTabAvailabilityDict.Battle = true
    } else if (!(dataChar.Voicelines[key] && dataChar.Voicelines[key].length !== 0)) {
      dataTabAvailabilityDict[key] = true
    }
  }
  // 更新可用性List
  for (const value of dataTabAvailabilityList) {
    value.disabled = dataTabAvailabilityDict[value.value]
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
    <CharVoiceTopSetting :statCurrInfo="dataTabAvailabilityList" />

    <h2>Char Voice SchaleDB UI</h2>
    <StoryI18nSetting />
    <el-divider />

  </div>
</template>

<style scoped>

</style>