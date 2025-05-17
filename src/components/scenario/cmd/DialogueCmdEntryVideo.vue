<script setup lang="ts">
import { type PropType } from 'vue'

const props = defineProps({
  data: {
    type: [] as PropType<[string, string]>,
    required: true
  }
})
</script>

<template>
  <video controls>
    <source :src="props.data[0]" type="video/mp4" />
    <source :src="props.data[1]" type="audio/ogg" />
  </video>
</template>
