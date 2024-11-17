<script setup lang="ts">
import type { PropType } from 'vue'
import type { NexonL10nData } from '@/types/OutsourcedData'

import PvFluid from 'primevue/fluid'
import PvButton from 'primevue/button'

const props = defineProps({
  prevId: {
    type: Object as PropType<Number | null>,
    required: true
  },
  prevName: {
    type: Object as PropType<NexonL10nData | null>,
    required: true
  },
  prevPosString: {
    type: Object as PropType<String | null>,
    required: true
  },
  nextId: {
    type: Object as PropType<Number | null>,
    required: true
  },
  nextName: {
    type: Object as PropType<NexonL10nData | null>,
    required: true
  },
  nextPosString: {
    type: Object as PropType<String | null>,
    required: true
  }
})

console.log(props.prevId === null)
</script>

<template>
  <div style="margin-top: 1em; margin-bottom: 1em;">
    <PvFluid>
      <template v-if="String(prevId) === 'null'">
        <PvButton style="width: calc(50% - 4px); text-align: center; margin-right: 4px;"
                  disabled>
          <i class="pi pi-chevron-left" style="font-size: 2em"></i>
          <span><b>上一个 (null)</b></span>
        </PvButton>
      </template>
      <template v-else>
        <PvButton style="width: calc(50% - 4px); text-align: center; margin-right: 4px;"
                  as="RouterLink" :to="`/scenario/${prevId}`"
                  :disabled="true">
          <i class="pi pi-chevron-left" style="font-size: 2em"></i>
          <span><b>上一个 ({{ prevId }})</b></span>
        </PvButton>
      </template>

      <template v-if="String(nextId) === 'null'">
        <PvButton style="width: calc(50% - 4px); text-align: center; margin-left: 4px;"
                  :disabled="true">
          <i class="pi pi-chevron-right" style="font-size: 2em"></i>
          <span><b>下一个 (null)</b></span>
        </PvButton>
      </template>
      <template v-else>
        <PvButton style="width: calc(50% - 4px); text-align: center; margin-left: 4px;"
                  as="RouterLink" :to="`/scenario/${nextId}`"
                  :disabled="true">
          <i class="pi pi-chevron-right" style="font-size: 2em"></i>
          <span><b>下一个 ({{ nextId }})</b></span>
        </PvButton>
      </template>
    </PvFluid>
  </div>
</template>

<style scoped>

</style>