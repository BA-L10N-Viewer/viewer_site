<script setup lang="ts">
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { useSetting } from '@/stores/setting'
import { paginationScenarioControl, siteUiLangSelect } from '@/tool/Constant'
const setting = useSetting()
</script>

<template>
  <h1 class="view-h1">{{$t('view-setting-h1')}}</h1>
  <h2>{{$t('view-setting-h2-1')}}</h2>
  <p>
    {{$t('view-setting-p-1')}}
    <el-input v-model="setting.username" style="max-width: 50%; min-width: 12em;"/>
  </p>
  <p>
    {{$t('view-setting-p-2')}}
    <el-select v-model="setting.ui_lang" style="max-width: 50%; min-width: 12em;">
      <el-option
        v-for="item in siteUiLangSelect"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </p>
  <p>
    {{$t('view-setting-p-3')}}
    <el-select v-model="setting.scenario_pagination_perPage" style="max-width: 10%; min-width: 4em;">
      <el-option
        v-for="item in paginationScenarioControl.perPage"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
  </p>
  <h2>{{$t('view-setting-h2-2')}}</h2>
  <StoryI18nSetting />
</template>