<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, watch } from 'vue'
import { useSetting } from '@/stores/setting'

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
  },
  iconType: {
    type: String,
    default: 'char_icon'
  },
  autoBr: {
    type: Boolean,
    default: true
  }
})

const setting = useSetting()

const isShowIcon = ref(true)
if (props.iconType === 'char_icon') {
  watch(
    () => setting.ui_show_char_icon,
    (newValue) => {
      isShowIcon.value = newValue
    },
    { immediate: true }
  )
}
</script>

<template>
  <img
    v-if="iconUrl !== null && isShowIcon"
    :src="iconUrl as string"
    :style="`width: ${iconWidth}; height: ${iconHeight};`"
  />
  <br v-if="autoBr && isShowIcon" />
</template>

<style scoped></style>
