<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { type Ref, ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import type { NexonMomotalkData } from '@/tool/Type'
import { httpGetBlocking } from '@/tool/HttpRequest'
import MomotalkHeader from '@/components/momotalk/MomotalkHeader.vue'
import MomotalkUi from '@/components/MomotalkUi.vue'

const { t } = useI18n()
const showI18nSettingDialog = ref(false)
const route = useRoute()

defineProps({
  charId: Number
})

// ---------------------------------------
const mmtData: [NexonMomotalkData] = JSON.parse(httpGetBlocking(`/data/story/momotalk/${route.params.charId}.json`))
let mmtStatus: Ref<boolean[]> = ref([false, false, false, false, false, false])
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

  <h1 class="view-h1">{{$t('view-mmt-h1')}}</h1>
  <p>{{$t('view-mmt-stu-id-p')}}{{ $route.params.charId }}</p>
  <StoryI18nSetting />
  <el-divider></el-divider>

  <div v-for="(data, index) in mmtData" :key="index" :id="'mmt-story-' + String(index)">
    <h2 style="background-color: white;">
      <MomotalkHeader :data_no="index" :data_mmtid="data.BondScenarioId" />
      <span>&nbsp;&nbsp;</span>
      <el-switch
        v-model="mmtStatus[index]"
        size="default"
        :active-text="$t('btn-show-content')"
      />
    </h2>
    <div v-if="mmtStatus[index]">
      <MomotalkUi :data_charid="String(charId)" :data_mmtidx="index"></MomotalkUi>
    </div>
  </div>
</template>

<style scoped>

</style>