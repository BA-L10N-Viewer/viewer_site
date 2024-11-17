<script setup lang="ts">
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import { ref, onMounted } from 'vue'
import ScenarioUi from '@/components/ScenarioUi.vue'
import { useRoute } from 'vue-router'
import { useI18nTlControl } from '@/stores/i18nTlControl'

import PvButton from 'primevue/button'
import PvDialog from 'primevue/dialog'


const props = defineProps({
  storyId: Number
})

const showI18nSettingDialog = ref(false)

const isLoading = ref(true)


onMounted(async () => {
  isLoading.value = false
})

// --------------------- ML SERVICE ---------------------
const ML_pinia = useI18nTlControl()
ML_pinia.initAll()
// ------------------------------------------------------
</script>

<template>
  <div v-show="isLoading">
    <h1>Loading...</h1>
  </div>
  <div v-if="!isLoading">
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

    <h1>{{ $t('view-scenario-h1') }}</h1>
    <ScenarioUi />
  </div>
</template>

<style scoped>

</style>