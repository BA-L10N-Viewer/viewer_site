<script setup lang="ts">
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { type Ref, ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { httpGetBlocking } from '@/tool/HttpRequest'
import MomotalkHeader from '@/components/momotalk/MomotalkHeader.vue'
import MomotalkUi from '@/components/MomotalkUi.vue'
import type { I18nBondInfoData, MomotalkStoryData, StudentInfoDataSimple } from '@/types/OutsourcedData'

const showI18nSettingDialog = ref(false)
const route = useRoute()

const props = defineProps({
  charId: Number
})

// ---------------------------------------
const mmtData: MomotalkStoryData = JSON.parse(httpGetBlocking(`/data/story/momotalk/${route.params.charId}.json`))
const charData : StudentInfoDataSimple = JSON.parse(httpGetBlocking('/data/common/index_stu.json'))
const mmtI18nData: I18nBondInfoData = JSON.parse(httpGetBlocking(`/data/story/i18n/i18n_bond.json`))

const charName = charData[String(route.params.charId)]['Name']
const mmtStatus: Ref<boolean[]> = ref([false, false, false, false, false, false])
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
      <MomotalkHeader :data_no="index" :data_mmtid="data.BondScenarioId" :data_l10n="mmtI18nData[data.BondScenarioId][0]" />
      <span>&nbsp;&nbsp;</span>
      <el-switch
        v-model="mmtStatus[index]"
        size="default"
        :active-text="$t('btn-show-content')"
      />
    </h2>
    <div v-if="mmtStatus[index]">
      <MomotalkUi :data_charname="charName" :data_data="data"></MomotalkUi>
    </div>
  </div>
</template>

<style scoped>

</style>