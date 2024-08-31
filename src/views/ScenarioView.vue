<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { ref } from 'vue'
import ScenarioUi from '@/components/ScenarioUi.vue'
import ScenarioDatasheet from '@/components/ScenarioDatasheet.vue'
import { useRoute } from 'vue-router'
import { getScenarioI18nContent } from '@/tool/StoryTool'

const showI18nSettingDialog = ref(false)
const scenarioID = useRoute().params.storyId

const scenarioNameDesc = getScenarioI18nContent(Number(scenarioID))

const props = defineProps({
  storyId: Number
})
</script>

<template>
  <el-backtop :right="100" :bottom="100" @click="showI18nSettingDialog = true">
    <el-icon>
      <Setting />
    </el-icon>
  </el-backtop>
  <el-dialog
    v-model="showI18nSettingDialog"
    width="80%">
    <StoryI18nSetting />
  </el-dialog>

  <!--
  <el-affix offset="60">
    <div style="background-color: white; height: 2em; padding-top: 1em;">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>homepage</el-breadcrumb-item>
        <el-breadcrumb-item>promotion management</el-breadcrumb-item>
        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
        <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </el-affix>
  -->

  <h1>{{$t('view-scenario-h1')}}</h1>
  <StoryI18nSetting />
  <el-divider></el-divider>
  <ScenarioDatasheet :story-desc="scenarioNameDesc[1]" :story-name="scenarioNameDesc[0]" :story-id="scenarioID" />
  <el-divider></el-divider>
  <ScenarioUi></ScenarioUi>
</template>

<style scoped>

</style>