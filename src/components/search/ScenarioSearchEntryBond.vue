<script setup lang="ts">
import MomotalkHeader from '@/components/momotalk/MomotalkHeader.vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent(
  {
    props: {
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
    },
    computed: {
      mmtId() {
        return this.data.id
      }
    }
  }
)
</script>

<template>
  <h3><MomotalkHeader :data_mmtid="mmtId" :data_no="data_no - 1" /></h3>
  <ul>
    <li>{{$t('comp-search-result-entry-bond-preposition')}} <a :href="'/momotalk/' + char_id" target="_blank">{{$t('comp-search-result-entry-bond-mmt')}}</a></li>
    <li>{{$t('comp-search-result-entry-bond-preposition')}} <a :href="'/scenario/' + mmtId" target="_blank">{{$t('comp-search-result-entry-bond-story')}}</a></li>
  </ul>
</template>

<style scoped>

</style>