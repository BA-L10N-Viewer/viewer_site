<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { searchCascaderModeOptions } from '@/tool/Constant'
import MomotalkSearch from '@/components/search/MomotalkSearch.vue'
import ScenarioSearch from '@/components/search/ScenarioSearch.vue'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { useI18n } from 'vue-i18n'
import { useSearchVars } from '@/stores/search'

const cascaderMode = ref<any[]>([])
const cascaderOptions = searchCascaderModeOptions
const cascaderProps = {}

const i18n = useI18n()
const searchCache = useSearchVars()

/* 搜索内容缓存 (instance 级) */
onMounted(() => {
  cascaderMode.value = searchCache.s_cascaderMode as any[]
})
watch(
  () => cascaderMode.value,
  () => {
    searchCache.setSearchModeVars(cascaderMode.value as [])
  }
)
</script>

<template>
  <h1 class="view-h1">{{ $t("search-h1") }}</h1>
  <StoryI18nSetting :show_ml="false" />
  <el-divider></el-divider>
  <p v-html="i18n.t('search-step-1')"></p>
  <el-cascader
    v-model="cascaderMode"
    :options="cascaderOptions"
    :props="cascaderProps"
    :size="'default'"
    :show-all-levels="true"
  >
    <template #default="{ node, data }">
      <span>{{ $t('search-cascader-' + data.value) }}</span>
      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
    </template>
  </el-cascader>
  <p v-show="cascaderMode.length != 0" v-html="i18n.t('search-step-2')"></p>

  <ScenarioSearch v-if="cascaderMode[0] === 'story'" />
  <MomotalkSearch v-if="cascaderMode[0] === 'mmt'" />
</template>
