<script setup lang="ts">
import { defineProps, type PropType } from 'vue'
import MomotalkMessageAuto from '@/components/momotalk/MomotalkMessageAuto.vue'
import { useWindowSize } from '@vueuse/core'
import { i18nDesktopLoopIdx, MOBILE_WIDTH } from '@/tool/Constant'
import type {
  MomotalkStoryDataEntry,
  NexonL10nData
} from '@/types/OutsourcedData'
import { useSetting } from '@/stores/setting'
import { i18nLangAll } from '@/tool/ConstantComputed'

import PvButton from 'primevue/button'

// --------------------- 初始化 ---------------------
const props = defineProps({
  data_data: {
    type: {} as PropType<MomotalkStoryDataEntry>,
    required: true
  },
  data_charname: {
    type: {} as PropType<NexonL10nData>,
    required: true
  },
  mmt_entry_pos: {
    type: Number,
    required: true
  }
})

const setting = useSetting()

const mmtData = props.data_data
const charName = props.data_charname

const screenWidth = useWindowSize().width
</script>

<template>
  <div class="momotalk-header">
    <p style="text-align: center" class="momotalk-header-p">
      Momotalk&nbsp;
      <PvButton class="btn-view-story" size="small"
                as="RouterLink" :to="`/scenario/${data_data.BondScenarioId}`">
        {{ $t('view-mmt-btn-view') }}
      </PvButton>
    </p>
  </div>
  <table class="momotalk-table" v-if="screenWidth >= MOBILE_WIDTH && !setting.ui_force_mobile">
    <thead>
    <tr>
      <template v-for="idx in i18nDesktopLoopIdx" :key="idx">
        <template v-if="i18nLangAll[idx] as string !== 'null'">
          <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
          <th scope="col">{{ $t(`comp-mmt-ui-table-th-l${idx + 1}`) }}</th>
        </template>
      </template>
    </tr>
    </thead>
    <MomotalkMessageAuto v-for="(entry, index) in mmtData['Data']" :key="index"
                         :dialog_entry_pos="index" :mmt_entry_pos="mmt_entry_pos"
                         :data_dialog="entry" :data_char="''" :char_name="charName"
                         :bond_story_id="mmtData['BondScenarioId']" />
  </table>
  <table class="momotalk-table" v-if="screenWidth < MOBILE_WIDTH || setting.ui_force_mobile">
    <thead>
    <tr>
      <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
      <th scope="col">{{ $t('comp-mmt-ui-table-th-l4') }}</th>
    </tr>
    </thead>
    <MomotalkMessageAuto v-for="(entry, index) in mmtData['Data']" :key="index"
                         :dialog_entry_pos="index" :mmt_entry_pos="mmt_entry_pos"
                         :data_dialog="entry" :data_char="''" :char_name="charName"
                         :bond_story_id="mmtData['BondScenarioId']" />
  </table>
</template>

<style scoped>

</style>