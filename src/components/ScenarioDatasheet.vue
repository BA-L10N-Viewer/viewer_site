<script setup lang="ts">
import { defineProps, computed, ref, type PropType } from 'vue'
import { useWindowSize } from '@vueuse/core'
import type { ComponentSize } from 'element-plus'
import { Iphone, Location, OfficeBuilding, Reading, Tickets, User } from '@element-plus/icons-vue'
import { getLangDataFlattened } from '@/tool/StoryTool'
import { i18nLangAll } from '@/tool/ConstantComputed'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { MOBILE_WIDTH_WIDER } from '@/tool/Constant'
import type { NexonL10nData } from '@/types/OutsourcedData'
import ScenarioIsAfterBattleBadge from '@/components/genetic/ScenarioIsAfterBattleBadge.vue'

const props = defineProps({
  storyId: {
    type: Number,
    required: true
  },
  storyName: {
    type: Object as PropType<NexonL10nData>, // Using PropType for complex types
    required: true
  },
  storyDesc: {
    type: Object as PropType<NexonL10nData>, // Using PropType for complex types
    required: true
  }
})

const i18n = useI18n()
const windowSize = useWindowSize()

// <el-descriptions> option
const size = ref<ComponentSize>('default')
const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px'
  }
  type marginMapType = 'large' | 'default' | 'small'
  return {
    marginRight: marginMap[String(size.value) as marginMapType] as String || marginMap.default
  }
})
const descColumn = computed(() => {
  return windowSize.width.value <= MOBILE_WIDTH_WIDER ? 1 : 2
})

// datasheet
function getStoryType() {
  const storyId = String(useRoute().params.storyId)
  let result

  if (storyId.length === 7) result = i18n.t('comp-scenario-sheet-type-bond')
  else if (storyId.length >= 5 && storyId.length <= 6) result = i18n.t('comp-scenario-sheet-type-main')
  else if (storyId.length === 4) result = i18n.t('comp-scenario-sheet-type-side')
  else if (storyId.length === 8) result = i18n.t('comp-scenario-sheet-type-short')
  else if (storyId.startsWith('1100') || storyId.length === 3) result = i18n.t('comp-scenario-sheet-type-other')
  else result = i18n.t('comp-scenario-sheet-type-event')

  return result
}
</script>

<template>
  <el-descriptions
    class="margin-top"
    :title="i18n.t('comp-scenario-datasheet-name')"
    :column="descColumn"
    :size="size"
    border
  >
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <Reading />
          </el-icon>
          {{ $t('comp-scenario-datasheet-item-1') }}
        </div>
      </template>
      <div class="item-content">{{ storyId }}<br /><ScenarioIsAfterBattleBadge :story-id="storyId" /></div>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <iphone />
          </el-icon>
          {{ $t('comp-scenario-datasheet-item-2') }}
        </div>
      </template>
      <div class="item-content">{{ getStoryType() }}</div>
    </el-descriptions-item>

    <!-- Story Name/Desc -->
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <tickets />
          </el-icon>
          {{ $t('comp-scenario-datasheet-item-3') }}
        </div>
      </template>
      <div class="item-content"><span v-html="getLangDataFlattened(storyName, i18nLangAll, '<br />')"></span></div>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <tickets />
          </el-icon>
          {{ $t('comp-scenario-datasheet-item-4') }}
        </div>
      </template>
      <div class="item-content"><span v-html="getLangDataFlattened(storyDesc, i18nLangAll, '<br />')"></span></div>
    </el-descriptions-item>
  </el-descriptions>
</template>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}

.cell-item {
  display: flex;
  align-items: center;
  min-width: 8em;
}

.margin-top {
  margin-top: 20px;
}

.item-content {
  min-width: 15em;
}
</style>