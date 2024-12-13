<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useSetting } from '@/stores/setting'
import { ref, watch } from 'vue'
import { menubarValue, MOBILE_WIDTH } from '@/tool/Constant'

import { fetchData, isFetching } from '@/tool/PreFetchedData'

import { useI18n } from 'vue-i18n'

import PvMenubar from 'primevue/menubar'
import PvButton from 'primevue/button'
import PvDialog from 'primevue/dialog'
import PvDivider from 'primevue/divider'
import SettingDialog from '@/components/setting/SettingDialog.vue'
import DataVersionDisplay from '@/components/DataVersionDisplay.vue'
import { useWindowSize } from '@vueuse/core'

const showForceLoad = ref(false)
const isForceLoad = ref(false)
setTimeout(() => {
  showForceLoad.value = true
}, 300000)

const setting = useSetting()
const router = useRouter()
const i18n = useI18n()

const screenWidth = useWindowSize().width

const dialogSettingVisible = ref(false)

watch(
  () => setting.ui_lang,
  (newValue) => {
    document.getElementsByTagName('body')[0].lang = newValue
  },
  { immediate: true }
)

fetchData()
</script>

<template>
  <template v-if="!isFetching || isForceLoad">
    <Teleport to="body">
      <PvDialog v-model:visible="dialogSettingVisible" modal :header="i18n.t('navi-3')" :closable="true"
                :draggable="false" :dismissableMask="true"
                style="width: 90%">
        <SettingDialog />
      </PvDialog>
    </Teleport>
    <Teleport to="body">
      <PvMenubar :model="menubarValue" style="position: fixed; top: 0; width: 100%">
        <template #start>
          <img
            src="/assets/images/logo.png"
            id="app-top-navi-logo"
          />
        </template>
        <template #item="{ item, props, hasSubmenu }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a :href="href" v-bind="props.action" @click="navigate">
              <span :class="item.icon" />
              <span>{{ $t(item.label as string) }}</span>
            </a>
          </router-link>
          <a v-else :href="item.url" :target="item.target" v-bind="props.action">
            <span :class="item.icon" />
            <span>{{ $t(item.label as string) }}</span>
            <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
          </a>
        </template>
        <template #end>
          <div class="flex items-center gap-2">
            <PvButton severity="secondary" rounded @click="dialogSettingVisible = true">
              <span class="pi pi-cog" />
            </PvButton>
          </div>
        </template>
      </PvMenubar>
    </Teleport>

    <div id="actual-body">
      <div style="height: 100%;">
        <span style="display: none">{{ $i18n.locale = setting.ui_lang }}</span>
        <RouterView />
      </div>

      <PvDivider />

      <footer style="text-align: right">
        <small>Copyright &copy; BALV 2024 All rights reserved.</small><br />
        <small>We do not own any in-game data. See <a href="javascript: void 0" @click="router.push({name: 'about'})">here</a>
          for details.</small><br />
        <small>Powered by <a href="https://python.org">Python</a> and <a href="https://vuejs.org/">Vue.JS</a>, with CDN
          from <a href="https://aws.amazon.com/cloudfront/">AWS CloudFront</a>.</small><br />
        <small>
          <DataVersionDisplay :verbose="false" />
        </small>
        <br /><br />
      </footer>
    </div>
  </template>
  <template v-else>
    <div style="text-align: center; padding-top: 3vh; padding-left: 1em; padding-right: 1em;">
      <img src="/assets/images/logo.png" :style="{'height': screenWidth <= MOBILE_WIDTH ? '' : '16vh', 'width': screenWidth <= MOBILE_WIDTH ? '90vw' : ''}" />
      <h1 style="font-size: 6vh">
        <span lang="en">Pre-Fetching data...</span>
        <br>
        <span lang="zh-CN">预加载数据中……</span>
      </h1>
      <div v-show="showForceLoad">
        <PvButton @click="isForceLoad=true" severity="danger" size="large" style="font-size: 4vh;">
          {{ $t('home-pre-fetch-button') }}
        </PvButton>
        <br /><br /><br /><br />
      </div>
    </div>
  </template>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
}
</style>
