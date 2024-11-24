<script setup lang="ts">
import type { PropType } from 'vue'
import type { NexonL10nData } from '@/types/OutsourcedData'

import PvFluid from 'primevue/fluid'
import PvButton from 'primevue/button'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'

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
  },
  infoPos: {
    type: String as PropType<'top' | 'bottom' | 'none'>,
    default: 'none'
  }
})

console.log(props.prevId === null)
</script>

<template>
  <div style="margin-top: 1em; margin-bottom: 1em;">
    <!-- 故事名称 -->
    <PvFluid class="pv-fluid" v-if="infoPos === 'top'">
      <div style="width: calc(50%);">
        <template v-if="prevName">
          <p><b>{{ prevPosString }}</b></p>
          <ul>
            <NexonI18nDataOutput :data="prevName" html-element-name="li" />
          </ul>
        </template>
      </div>
      <div class="pv-fluid-spacing"></div>
      <div style="width: calc(50%)">
        <template v-if="nextName">
          <p><b>{{ nextPosString }}</b></p>
          <ul>
            <NexonI18nDataOutput :data="nextName" html-element-name="li" />
          </ul>
        </template>
      </div>
    </PvFluid>

    <!-- 上下页按钮  -->
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

    <!-- 故事名称 -->
    <PvFluid class="pv-fluid" v-if="infoPos === 'bottom'">
      <div style="width: calc(50%);">
        <template v-if="prevName">
          <p><b>{{ prevPosString }}</b></p>
          <ul>
            <NexonI18nDataOutput :data="prevName" html-element-name="li" />
          </ul>
        </template>
      </div>
      <div class="pv-fluid-spacing"></div>
      <div style="width: calc(50%)">
        <template v-if="nextName">
          <p><b>{{ nextPosString }}</b></p>
          <ul>
            <NexonI18nDataOutput :data="nextName" html-element-name="li" />
          </ul>
        </template>
      </div>
    </PvFluid>
  </div>
</template>

<style scoped>

</style>