<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import {
  selectCharVoiceEventDisplayMode,
  selectCharVoiceCurrTabName,
  selectCharVoiceDataSource
} from '@/tool/Constant'
import type { CharVoiceUiTabAvailabilityList } from '@/types/CharVoiceComp'
import type { PropType } from 'vue'

const props = defineProps(
  {
    statCurrInfo: {
      type: {} as PropType<CharVoiceUiTabAvailabilityList>,
      required: true
    }
  }
)

const setting = useSetting()
setting.char_voice_data_curr_tab = 'Normal'
</script>

<template>
  <div style="width: 100%; background-color: white;" class="select-data-source">
    <p>{{ $t('选择活动对话类型显示：') }}
      <el-select v-model="setting.char_voice_data_event_display_mode" style="width: 10em;" multiple collapse-tags>
        <el-option v-for="item in selectCharVoiceEventDisplayMode"
                   :key="item.value"
                   :label="$t(item.label)"
                   :value="item.value" />
      </el-select>
    </p>
  </div>
</template>

<style scoped>
.select-data-source {
  position: fixed;
  top: 68px;
  z-index: 20;
}
</style>