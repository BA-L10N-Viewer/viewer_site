<script setup lang="ts">
import type { NexonCharVoiceEventVoiceEntryParam } from '@/types/OutsourcedDataVoice'
import { inject, type Ref } from 'vue'

const dialogRef = inject<
  Ref<{
    data: {
      stringExplanation: string | undefined
      dataDetail?: NexonCharVoiceEventVoiceEntryParam
    }
    close: () => void
  }>
>('dialogRef')!

const dialogData = dialogRef.value.data
</script>

<template>
  <template v-if="dialogData.stringExplanation">
    <p class="whitespace-pre-wrap">{{ dialogData.stringExplanation }}</p>
  </template>
  <template v-if="dialogData.dataDetail">
    <h2>{{ $t('char-voice-detail-dialog-voice-condition') }}</h2>
    <p>
      {{
        $t(
          'char-voice-detail-dialog-voice-condition-' +
            dialogData.dataDetail.DialogConditionDetail.toLowerCase()
        )
      }}
    </p>
    <h2>{{ $t('char-voice-detail-dialog-voice-value') }}</h2>
    <p>{{ dialogData.dataDetail.DialogConditionDetailValue }}</p>
  </template>
</template>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
