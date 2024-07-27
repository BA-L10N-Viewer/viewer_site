<script setup lang="ts">
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'
import { gotoStory } from '@/tool/StoryTool'
import { useRouter } from 'vue-router'

const router = useRouter()
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
      }
    },
    computed: {
      storyId() {
        return this.data.id
      },
      storyName() {
        return this.data.name
      },
      storyDesc() {
        return this.data.desc
      }
    }
  }
)
</script>

<template>
  <h3>
    <el-tag type="warning">{{ storyId }}</el-tag>
    <span>&nbsp;&nbsp;</span>
    <span>{{ data_no }}.&nbsp;</span>
    <NexonI18nDataOutput :data="storyName" />
    <span>&nbsp;</span>
    <el-button type="primary" class="btn-view-story"
               tag="a" :href="`/scenario/` + storyId" target="_blank">{{$t('comp-search-result-btn-view')}}
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