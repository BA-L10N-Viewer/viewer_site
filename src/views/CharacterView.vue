<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import CharacterProfileUi from '@/components/profile/CharacterProfileUi.vue'
import PvButton from 'primevue/button'
import PvDialog from 'primevue/dialog'
import StoryI18nSetting from '@/components/setting/StoryI18nSetting.vue'

const route = useRoute()
const charId = String(route.params.charId)

const showI18nSettingDialog = ref(false)
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

  <div class="profile-content">
    <h1 class="view-h1">{{ $t('view-char-profile-h1') }}</h1>
    <CharacterProfileUi :char-id="charId" />
  </div>
</template>

<style scoped>
.profile-content {
  width: 70%;
  margin-left: 15%;
  margin-right: 15%;
}

@media screen and (max-width: 800px) {
  .profile-content {
    margin: revert;
    width: 100%;
  }
}
</style>