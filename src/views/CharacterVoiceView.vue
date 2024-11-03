<script setup lang="ts">
import { useRoute } from 'vue-router'
import CharVoiceUi from '@/components/voice/CharVoiceUi.vue'

const router = useRoute()
</script>

<template>
  <h1 class="view-h1">{{ $t('char-voice-ui-h1') }}</h1>
  <CharVoiceUi :char-id="String(router.params.charId)"/>
</template>

<style scoped>

</style>