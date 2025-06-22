<script setup lang="ts">
import { useRoute } from 'vue-router'
import CharVoiceUi from '@/components/voice/CharVoiceUi.vue'
import PvButton from 'primevue/button'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'
import PvDialog from 'primevue/dialog'
import { ref } from 'vue'

const showI18nSettingDialog = ref(false)

const router = useRoute()
</script>

<template>
  <Teleport to="body">
    <div style="position: fixed; right: 5%; bottom: 10%">
      <PvButton severity="secondary" rounded @click="showI18nSettingDialog = true">
        <span class="pi pi-globe" style="color: var(--color-ba-logo)" />
        <span>L10N</span>
      </PvButton>
    </div>

    <PvDialog
      v-model:visible="showI18nSettingDialog"
      modal
      :closable="true"
      :draggable="false"
      :dismissableMask="true"
      style="width: 90%"
    >
      <StoryI18nSetting />
    </PvDialog>
  </Teleport>

  <h1 class="view-h1">{{ $t('char-voice-ui-h1') }}</h1>
  <CharVoiceUi :char-id="String(router.params.charId)" />
</template>

<style scoped></style>
