<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useSetting } from '@/stores/setting'

import { ref } from 'vue'

const activeIndex = ref(window.location.pathname)

const settingStore = useSetting()
const router = useRouter()

document.getElementsByTagName('body')[0].lang = settingStore.ui_lang
</script>

<template>
  <el-container>
    <!-- 首先 明确这是个header -->
    <el-header>
      <!-- 其次 el-affix 可以用来装任何东西 -->
      <el-affix>
        <!-- 最后 el-menu 是我的导航栏 -->
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="true"
          router="router"
          background-color="#fff"
        >
          <el-menu-item index="/"><img
            src="/assets/images/logo.png"
            alt="Element logo"
            id="app-top-navi-logo"
          /></el-menu-item>
          <el-sub-menu>
            <template #title>{{ $t('navi-1') }}</template>
            <el-menu-item index="/search">{{ $t('navi-1-1') }}</el-menu-item>
            <el-menu-item index="/search/character">{{ $t('navi-1-2') }}</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/setting">{{ $t('navi-3') }}</el-menu-item>
          <el-menu-item index="/about">{{ $t('navi-2') }}</el-menu-item>
          <el-menu-item index="/faq">{{ $t('navi-4') }}</el-menu-item>
          <!--
          <div class="flex-grow" />
          <el-sub-menu index="2">
            <template #title>Workspace</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>item four</template>
              <el-menu-item index="2-4-1">item one</el-menu-item>
              <el-menu-item index="2-4-2">item two</el-menu-item>
              <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          -->
        </el-menu>
      </el-affix>
    </el-header>

    <el-main style="height: 100%">
      <span style="display: none">{{ $i18n.locale = settingStore.ui_lang }}</span>
      <RouterView />
    </el-main>

    <el-divider />
    <el-footer>
      <div style="text-align: right">
        <small>Copyright &copy; BALV 2024 All rights reserved.</small><br />
        <small>We do not own any in-game data. See <a href="javascript: void 0" @click="router.push({name: 'about'})">here</a>
          for details.</small><br />
        <small>Powered by <a href="https://python.org">Python</a> and <a href="https://vuejs.org/">Vue.JS</a>, with CDN
          from <a href="https://aws.amazon.com/cloudfront/">AWS CloudFront</a>.</small>
        <br /><br />
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>
