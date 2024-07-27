<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH } from '../tool/Constant'
import { useI18n } from 'vue-i18n'

const screenWidth = useWindowSize().width
const colSpanLeft = ref(16)
const colSpanRight = ref(8)

const { t } = useI18n()

watch(screenWidth, () => {
  if (screenWidth.value <= MOBILE_WIDTH) {
    colSpanLeft.value = 24
    colSpanRight.value = 24
  } else {
    colSpanLeft.value = 16
    colSpanRight.value = 8
  }
}, { immediate: true })
</script>

<template>
  <el-row :gutter="1" id="page-home-view">
    <el-col :span="colSpanLeft">
      <div class="home-bulletin-div">
        <h1>{{ t('home-h1-1') }}</h1>
        <p v-html="t('home-p-1')"></p>
        <p v-html="t('home-p-2')"></p>
        <p v-html="t('home-p-3')"></p>
        <h1>{{ t('home-h1-2') }}</h1>
        <p v-html="t('home-p-4')"></p>
      </div>
    </el-col>
    <el-col :span="colSpanRight">
      <div class="home-bulletin-div"></div>
    </el-col>
  </el-row>
</template>

<script lang="ts">


</script>

