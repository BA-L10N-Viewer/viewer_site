<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  iconUrl: {
    type: {} as PropType<String | null>,
    required: true
  },
  iconWidth: {
    type: String,
    default: 'auto'
  },
  iconHeight: {
    type: String,
    default: '3em'
  }
})
</script>

<template>
  <img v-if="iconUrl !== null" :src="iconUrl as string" :style="`width: ${iconWidth}; height: ${iconHeight};`">
</template>

<style scoped>

</style>