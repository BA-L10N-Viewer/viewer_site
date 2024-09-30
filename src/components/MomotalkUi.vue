<script setup lang="ts">
import { defineProps, type PropType, ref, onMounted, type Ref } from 'vue'
import MomotalkDialogue from '@/components/momotalk/MomotalkDialogue.vue'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH } from '@/tool/Constant'
import type {
  MomotalkStoryDataEntry,
  NexonL10nData
} from '@/types/OutsourcedData'
import { useSetting } from '@/stores/setting'

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
  },
  is_default_show: {
    type: Boolean,
    required: true
  }
})

const setting = useSetting()
const mmtData = props.data_data
const charName = props.data_charname

const screenWidth = useWindowSize().width

onMounted(
  () => {
    if (props.is_default_show) {
      const targetEle = document.getElementById(`mmt-story-h2-title-${String(props.mmt_entry_pos)}`)
      if (targetEle) {
        const targetHeightOffset = targetEle.getBoundingClientRect().y - 70
        window.scrollBy({
          left: 0, top: targetHeightOffset, behavior: 'smooth'
        })
      }
    }
  }
)
</script>

<template>
  <div class="momotalk-header">
    <p style="text-align: center" class="momotalk-header-p">Momotalk</p>
  </div>
  <table class="momotalk-table" v-if="screenWidth >= MOBILE_WIDTH && !setting.ui_force_mobile">
    <thead>
    <tr>
      <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
      <th scope="col">{{ $t('comp-mmt-ui-table-th-l1') }}</th>
      <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
      <th scope="col">{{ $t('comp-mmt-ui-table-th-l2') }}</th>
      <th scope="col">{{ $t('comp-mmt-ui-table-th-speaker') }}</th>
      <th scope="col">{{ $t('comp-mmt-ui-table-th-l3') }}</th>
    </tr>
    </thead>
    <MomotalkDialogue v-for="(entry, index) in mmtData['Data']" :key="index"
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
    <MomotalkDialogue v-for="(entry, index) in mmtData['Data']" :key="index"
                      :dialog_entry_pos="index" :mmt_entry_pos="mmt_entry_pos"
                      :data_dialog="entry" :data_char="''" :char_name="charName"
                      :bond_story_id="mmtData['BondScenarioId']" />
  </table>
</template>

<style scoped>

</style>