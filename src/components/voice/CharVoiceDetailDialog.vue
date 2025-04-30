<script setup lang="ts">
import { inject, type Ref } from 'vue'

const dialogRef = inject<
  Ref<{
    data: {
      stringExplanation: string
      dataDetail?: unknown
    }
    close: () => void
  }>
>('dialogRef')!

const dialogData = dialogRef.value.data

const closeDialog = () => {
  dialogRef.value.close()
}
</script>

<template>
  <p class="whitespace-pre-wrap">{{ dialogData.stringExplanation }}</p>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
