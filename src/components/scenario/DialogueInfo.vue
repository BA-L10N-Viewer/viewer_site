<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  dialogueSelectionGroup: {
    type: Number,
    required: true
  },
  dialogueSelectionToGroup: {
    type: Number,
    required: true
  }
})
</script>


<template>
  <div class="dialogue-info-tag">
    <el-tag type="info" v-if="dialogueSelectionGroup !== 0"><span lang="en">SeleGroup: {{dialogueSelectionGroup}}</span></el-tag>
    <span v-if="dialogueSelectionGroup !== 0 && dialogueSelectionToGroup !== -1">&nbsp;</span>
    <el-tag type="info" v-if="dialogueSelectionToGroup !== -1"><span lang="en">SeleToGroup: {{dialogueSelectionToGroup}}</span></el-tag>
  </div>
</template>

<style scoped>
.dialogue-info-tag {
  margin-top: 8px;
}
</style>