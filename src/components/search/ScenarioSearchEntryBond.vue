<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import MomotalkHeader from '@/components/momotalk/MomotalkHeader.vue'

const props = defineProps({
  data: {
    required: true
  },
  data_no: {
    type: Number,
    required: true
  },
  char_id: {
    type: String,
    required: true
  }
})
const mmtId = computed(() => props.data.id)

const router = useRouter()
</script>

<template>
  <h3>
    <MomotalkHeader :data_mmtid="data.id" :data_no="data_no - 1" />
  </h3>
  <ul>
    <li>{{ $t('comp-search-result-entry-bond-preposition') }} <a
      @click="router.push({name: 'momotalk', params: {charId: char_id}})">{{ $t('comp-search-result-entry-bond-mmt') }}</a></li>
    <li>{{ $t('comp-search-result-entry-bond-preposition') }} <a
      @click="router.push({name: 'scenario', params: {storyId: mmtId}})">{{ $t('comp-search-result-entry-bond-story') }}</a></li>
  </ul>
</template>

<style scoped>

</style>