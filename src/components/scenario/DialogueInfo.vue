<script setup>
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'

import PvTag from 'primevue/tag'
import PvButton from 'primevue/button'

const props = defineProps({
  dialogueSelectionGroup: {
    type: Number,
    required: true
  },
  dialogueSelectionToGroup: {
    type: Number,
    required: true
  },
  dialogueAbsolutePos: {
    type: Number,
    default: 0
  }
})

const router = useRouter()
const i18n = useI18n()

function gotoBlueArchiveIo() {
  const storyId = router.currentRoute.value.params.storyId
  if (storyId) {
    const storyIdNormalized = String(storyId)

    // 主线故事
    if (storyIdNormalized.length === 5 ||
      // 终篇
      (storyIdNormalized.length === 6 && storyIdNormalized.startsWith('10'))
    ) {
      window.open(`https://blue-archive.io/mainStory/${storyIdNormalized}?type=main&changeIndex=${props.dialogueAbsolutePos}`, '_blank')
    } else if ((storyIdNormalized.length === 6 || storyIdNormalized.length === 7) &&
      (storyIdNormalized.startsWith('10') || storyIdNormalized.startsWith('13') || storyIdNormalized.startsWith('16') ||
        storyIdNormalized.startsWith('20') || storyIdNormalized.startsWith('23') || storyIdNormalized.startsWith('26'))
    ) {
      window.open(`https://blue-archive.io/archive/${storyIdNormalized.slice(0, 5)}/story/${storyIdNormalized.slice(5)}?changeIndex=${props.dialogueAbsolutePos}`)
    } else {
      alert(i18n.t('comp-scenario-dialogue-info-btn-baio-not-supported'))
    }
  }
}

const cssMarginLeftOfDialogueInfoQuickBtn = (props.dialogueSelectionGroup !== 0 || props.dialogueSelectionToGroup !== -1) ? '8px' : '0'
</script>


<template>
  <div class="dialogue-info-tag">
    <PvTag severity="secondary" v-if="dialogueSelectionGroup !== 0"><span
      lang="en" class="pv-tag">SeleGroup: {{ dialogueSelectionGroup }}</span></PvTag>
    <span v-if="dialogueSelectionGroup !== 0 && dialogueSelectionToGroup !== -1">&nbsp;</span>
    <PvTag severity="secondary" v-if="dialogueSelectionToGroup !== -1"><span
      lang="en" class="pv-tag">SeleToGroup: {{ dialogueSelectionToGroup }}</span></PvTag>

    <div class="dialogue-info-quick-btn">
      <PvButton @click="gotoBlueArchiveIo" severity="success" rounded
                size="small"
                v-tooltip.top="i18n.t('comp-scenario-dialogue-info-btn-baio-popup')">
        <img src="/assets/images/icon/blue_archive_io.webp"
             style="height: 1em">
      </PvButton>
    </div>
  </div>
</template>

<style scoped>
.dialogue-info-tag {
  margin-top: 8px;
  margin-right: 8px;
}

.dialogue-info-quick-btn {
  text-align: right;
  display: inline-block;
  margin-left: v-bind(cssMarginLeftOfDialogueInfoQuickBtn);
}

.pv-tag {
  font-weight: normal;
}
</style>