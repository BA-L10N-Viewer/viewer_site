<script setup lang="ts">
import ScenarioSearch from '@/components/search/ScenarioSearch.vue'
import PvDialog from 'primevue/dialog'
import PvButton from 'primevue/button'
import { onMounted, ref, watch } from 'vue'
import { AppPageCategoryToI18nCode, changeAppPageTitle } from '@/tool/AppTitleChanger'
import { useSetting } from '@/stores/setting'
import { useI18n } from 'vue-i18n'

const setting = useSetting()
const i18n = useI18n()

const showI18nSettingDialog = ref(false)

onMounted(
  () => {
    watch(
      () => setting.ui_lang,
      () => {
        changeAppPageTitle(i18n.t(AppPageCategoryToI18nCode['search_advanced']))
      },
      { immediate: true }
    )
  }
)
</script>

<template>
  <Teleport to="body">
    <div style="position: fixed; right: 5%; bottom: 10%;">
      <PvButton severity="secondary" rounded @click="showI18nSettingDialog = true">
        <span class="pi pi-globe" style="color: var(--color-ba-logo)" />
        <span>L10N</span>
      </PvButton>
    </div>

    <PvDialog v-model:visible="showI18nSettingDialog" modal :closable="true"
              :draggable="false" :dismissableMask="true"
              style="width: 90%">
      <StoryI18nSetting />
    </PvDialog>
  </Teleport>
  <ScenarioSearch />
</template>
