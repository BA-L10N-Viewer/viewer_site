<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { ref, onMounted, provide } from 'vue'
import ScenarioUi from '@/components/ScenarioUi.vue'
import { useRoute } from 'vue-router'
import { getScenarioI18nContent } from '@/tool/StoryTool'
import type { NexonL10nData } from '@/types/OutsourcedData'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import ScenarioDatasheet from '@/components/ScenarioDatasheet.vue'

const props = defineProps({
  storyId: Number
})

const showI18nSettingDialog = ref(false)
const scenarioID = useRoute().params.storyId

const isLoading = ref(true)
let scenarioNameDesc: NexonL10nData[] = [] as any

async function loadEverything() {
  scenarioNameDesc = await getScenarioI18nContent(Number(scenarioID)) as NexonL10nData[]
}

onMounted(async () => {
  await loadEverything()
  isLoading.value = false
})

// --------------------- ML SERVICE ---------------------
const ML_pinia = useI18nTlControl()
ML_pinia.initAll()
// ------------------------------------------------------
</script>

<template>
  <div v-show="isLoading">
    <h1>Loading...</h1>
  </div>
  <div v-if="!isLoading">
    <el-backtop :right="50" :bottom="100" @click="showI18nSettingDialog = true">
      <el-icon>
        <Setting />
      </el-icon>
    </el-backtop>
    <el-dialog
      v-model="showI18nSettingDialog"
      width="80%">
      <StoryI18nSetting />
    </el-dialog>

    <h1>{{ $t('view-scenario-h1') }}</h1>
    <ScenarioDatasheet :story-desc="scenarioNameDesc[1]" :story-name="scenarioNameDesc[0]"
                       :story-id="Number(scenarioID)" />
    <el-divider />
    <StoryI18nSetting />
    <el-divider />

    <ScenarioUi />
  </div>
</template>

<style scoped>

</style>