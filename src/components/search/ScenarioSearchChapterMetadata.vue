<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { NexonL10nData } from '@/types/OutsourcedData'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH } from '@/tool/Constant'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'

const props = defineProps({
  data: {
    type: Object as PropType<Record<'name' | 'desc', NexonL10nData>>,
    required: true
  }
})

const isMobile = computed(() => useWindowSize().width.value <= MOBILE_WIDTH)
</script>

<template>
  <table class="datasheet" v-if="!isMobile">
    <tr>
      <td class="datasheet-title-desktop datasheet-title">{{ $t('comp-search-scenario-datasheet-item-1') }}</td>
      <td>
        <ul class="datasheet-data-ul">
          <NexonI18nDataOutput :data="data.name" html-element-name="li" />
        </ul>
      </td>
    </tr>
    <tr>
      <td class="datasheet-title-desktop datasheet-title">{{ $t('comp-search-scenario-datasheet-item-2') }}</td>
      <td>
        <ul class="datasheet-data-ul">
          <NexonI18nDataOutput :data="data.desc" html-element-name="li" />
        </ul>
      </td>
    </tr>
  </table>
  <table class="datasheet" v-else>
    <tr>
      <td class="datasheet-title">{{ $t('comp-search-scenario-datasheet-item-1') }}</td>
    </tr>
    <tr>
      <td>
        <ul class="datasheet-data-ul">
          <NexonI18nDataOutput :data="data.name" html-element-name="li" />
        </ul>
      </td>
    </tr>
    <tr>
      <td class="datasheet-title">{{ $t('comp-search-scenario-datasheet-item-2') }}</td>
    </tr>
    <tr>
      <td>
        <ul class="datasheet-data-ul">
          <NexonI18nDataOutput :data="data.desc" html-element-name="li" />
        </ul>
      </td>
    </tr>
  </table>
</template>

<style scoped>
.datasheet-title-desktop {
  width: 4em
}

.datasheet-data-ul {
  margin: 0;
  padding: 0 0 0 1em;
}
</style>