<script setup lang="ts">
import { useRoute } from 'vue-router'
import CharVoiceUi from '@/components/voice/CharVoiceUi.vue'

const router = useRoute()
</script>

<template>
  <div style="height: 40px"><br /></div>
  <h1 class="view-h1">{{ $t('Character Voice View') }}</h1>
  <CharVoiceUi :char-id="String(router.params.charId)"/>
</template>

<style scoped>

</style>