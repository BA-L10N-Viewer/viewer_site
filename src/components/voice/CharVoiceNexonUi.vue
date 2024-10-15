<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps(
  {
    charId: {
      type: [Number, String],
      required: true
    }
  }
)

const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-if="!isLoading">
    <h3>Char Voice Nexon UI</h3>
  </div>
</template>

<style scoped>

</style>