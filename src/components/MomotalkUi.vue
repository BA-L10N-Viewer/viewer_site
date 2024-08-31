<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { defineProps, type Ref, ref, watch } from 'vue'
import { NexonLangMap } from '@/tool/Constant'
import { useRoute } from 'vue-router'
import { httpGetBlocking } from '@/tool/HttpRequest'
import MomotalkDialogue from '@/components/momotalk/MomotalkDialogue.vue'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH } from '@/tool/Constant'
import type { MomotalkStoryData, StudentInfoDataSimple } from '@/types/OutsourcedData'

// --------------------- 初始化 ---------------------
const props = defineProps({
  data_charid: {
    type: String,
    required: true
  },
  data_mmtidx: {
    type: Number,
    required: true
  }
})

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
const router = useRoute()

let mmtData: MomotalkStoryData = JSON.parse(httpGetBlocking(`/data/story/momotalk/${router.params.charId}.json`))
const charData : StudentInfoDataSimple = JSON.parse(httpGetBlocking('/data/common/index_stu.json'))
const charName = charData[String(router.params.charId)]['Name']

const screenWidth = useWindowSize().width
</script>

<template>
  <!--
  <div class="momotalk-div">
    <div class="momotalk-header">
      <p style="text-align: center" class="momotalk-header-p">Momotalk</p>
    </div>
  </div>
  -->
  <div class="momotalk-header">
    <p style="text-align: center" class="momotalk-header-p">Momotalk</p>
  </div>
  <table class="momotalk-table" v-if="screenWidth >= MOBILE_WIDTH">
    <thead>
    <tr>
      <th scope="col">{{$t('comp-mmt-ui-table-th-speaker')}}</th>
      <th scope="col">{{$t('comp-mmt-ui-table-th-l1')}}</th>
      <th scope="col">{{$t('comp-mmt-ui-table-th-speaker')}}</th>
      <th scope="col">{{$t('comp-mmt-ui-table-th-l2')}}</th>
      <th scope="col">{{$t('comp-mmt-ui-table-th-speaker')}}</th>
      <th scope="col">{{$t('comp-mmt-ui-table-th-l3')}}</th>
    </tr>
    </thead>
    <MomotalkDialogue v-for="(entry, index) in mmtData[data_mmtidx]['Data']" :key="index"
                      :data_dialog="entry" :data_char="''" :char_name="charName"
                      :bond_story_id="mmtData[data_mmtidx]['BondScenarioId']"/>
  </table>
  <table class="momotalk-table" v-if="screenWidth < MOBILE_WIDTH">
    <thead>
    <tr>
      <th scope="col">{{$t('comp-mmt-ui-table-th-speaker')}}</th>
      <th scope="col">{{$t('comp-mmt-ui-table-th-l4')}}</th>
    </tr>
    </thead>
    <MomotalkDialogue v-for="(entry, index) in mmtData[data_mmtidx]['Data']" :key="index"
                      :data_dialog="entry" :data_char="''" :char_name="charName"
                      :bond_story_id="mmtData[data_mmtidx]['BondScenarioId']" />
  </table>
</template>

<style scoped>

</style>