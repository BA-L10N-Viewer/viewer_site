<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useSetting } from '@/stores/setting'

import { ref, watch } from 'vue'
import { menubarValue } from '@/tool/Constant'
import { useI18n } from 'vue-i18n'

import PvMenubar from 'primevue/menubar'
import PvButton from 'primevue/button'
import PvDialog from 'primevue/dialog'
import SettingDialog from '@/components/setting/SettingDialog.vue'


const setting = useSetting()
const router = useRouter()
const i18n = useI18n()

const dialogSettingVisible = ref(false)

watch(
  dialogSettingVisible,
  () => {
    console.log(dialogSettingVisible.value)
  }
)

document.getElementsByTagName('body')[0].lang = setting.ui_lang
</script>

<template>
  <Teleport to="body">
    <PvDialog v-model:visible="dialogSettingVisible" modal :header="i18n.t('navi-3')" :closable="true"
              :draggable="false" :dismissableMask="true"
              style="width: 90%">
      <SettingDialog />
    </PvDialog>
  </Teleport>

  <el-container>
    <!-- 首先 明确这是个header -->
    <el-header>
      <!-- 其次 el-affix 可以用来装任何东西 -->
      <el-affix>
        <!-- 最后 el-menu 是我的导航栏 -->
        <PvMenubar :model="menubarValue">
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
            <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
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
      </el-affix>
    </el-header>

    <el-main style="height: 100%">
      <span style="display: none">{{ $i18n.locale = setting.ui_lang }}</span>
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
