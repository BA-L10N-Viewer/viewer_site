<script setup lang="ts">
import { ref } from 'vue'
import { searchCascaderModeOptions } from '@/tool/Constant'
import MomotalkSearch from '@/components/search/MomotalkSearch.vue'
import ScenarioSearch from '@/components/search/ScenarioSearch.vue'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { useI18n } from 'vue-i18n'

const cascaderMode = ref([])
const cascaderOptions = searchCascaderModeOptions
const cascaderProps = {}
const i18n = useI18n()

const storySelect = ref('null')

const resetFilter = () => {
  storySelect.value = "null"
}
</script>

<template>
  <h1 class="view-h1">{{ $t("search-h1") }}</h1>
  <StoryI18nSetting :show_ml="false" />
  <el-divider></el-divider>
  <p v-html="i18n.t('search-step-1')"></p>
  <client-only>
    <el-cascader
      v-model="cascaderMode"
      :options="cascaderOptions"
      :props="cascaderProps"
      :size="'default'"
      :show-all-levels="true"
      @change="resetFilter"
    >
      <template #default="{ node, data }">
        <span>{{ $t('search-cascader-' + data.value) }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
  </client-only>
  <p v-show="cascaderMode.length != 0" v-html="i18n.t('search-step-2')"></p>
  <ScenarioSearch v-if="cascaderMode[0] === 'story'" />
  <!--
  <el-tree
    style="max-width: 600px"
    :data="searchCascaderStoryOptions"
    accordion
    v-if="cascaderMode[0] === 'story'"
    filterable
    @node-click="(data: ElementPlusTree) => {storySelect = checkTreeLeaf(data) ? data.label : 'null'}"
    @node-contextmenu="(data: ElementPlusTree) => {storySelect = checkTreeLeaf(data) ? data.label : 'null'}"
  >
    <template #default="{ node, data }">
      <span>{{ $t(data.label) }}</span>
      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
    </template>
  </el-tree>
  -->
  <MomotalkSearch v-if="cascaderMode[0] == 'mmt'" />
</template>
