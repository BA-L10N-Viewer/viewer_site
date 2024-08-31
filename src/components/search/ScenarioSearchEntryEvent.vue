<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'

const props = defineProps({
  data: {
    required: true
  },
  data_no: {
    type: Number,
    required: true
  }
})
const storyId = computed(() => props.data.id)
const storyName = computed(() => props.data.name)
const storyDesc = computed(() => props.data.desc)

const router = useRouter()
</script>


<template>
  <h3>
    <el-tag type="warning">{{ storyId }}</el-tag>
    <span>&nbsp;&nbsp;</span>
    <span>{{ data_no }}.&nbsp;</span>
    <NexonI18nDataOutput :data="storyName" />
    <span>&nbsp;</span>
    <el-button type="primary" class="btn-view-story" tag="a"
               @click="router.push({name: 'scenario', params: {storyId: storyId}})">{{$t('comp-search-result-btn-view')}}
    </el-button>
  </h3>
  <p>{{$t('comp-search-result-desc')}}</p>
  <ul>
    <NexonI18nDataOutput :data="storyDesc" html-element-name="li" />
  </ul>
  <el-divider></el-divider>
</template>

<style scoped>
.btn-view-story {
  text-decoration-line: none;
}
</style>