<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { computed } from 'vue'
import CharVoiceNexonUi from '@/components/voice/CharVoiceNexonUi.vue'
import CharVoiceSchaleDbUi from '@/components/voice/CharVoiceSchaleDbUi.vue'

const props = defineProps(
  {
    charId: {
      type: [Number, String],
      required: true
    }
  }
)

const setting = useSetting()
const currComponent = computed(() => {
  const dataSource = setting.char_voice_data_source
  if (dataSource === 'nexon') {return CharVoiceNexonUi}
  else {return CharVoiceSchaleDbUi}
})
</script>

<template>
  <h2>{{ $t('Character Voice UI') }}</h2>
  <div class="char-voice-ui-div">
    <el-divider />
    <KeepAlive>
      <component :is="currComponent" :char-id="charId" />
    </KeepAlive>
  </div>
</template>

<style scoped>

</style>