<script setup lang="ts">
import type { NexonCharVoiceNormal } from '@/types/OutsourcedDataVoice'
import { onMounted, type PropType } from 'vue'
import { ref } from 'vue'

defineProps({
  data: {
    type: Object as PropType<NexonCharVoiceNormal>,
    required: true
  }
})

const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <h3>CharVoiceNexonNormal</h3>
  </div>
</template>

<style scoped>

</style>