<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import CharVoiceNexonUi from '@/components/voice/CharVoiceNexonUi.vue'
import CharVoiceSchaleDbUi from '@/components/voice/CharVoiceSchaleDbUi.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps(
  {
    charId: {
      type: [Number, String],
      required: true
    }
  }
)

const setting = useSetting()
const i18n = useI18n()
</script>

<template>
  <h2>{{ $t('Character Voice UI') }}</h2>
  <div class="char-voice-ui-div">
    <el-divider />
    <KeepAlive>
      <el-tabs
        v-model="setting.char_voice_data_source"
        type="border-card"
        class="demo-tabs"
      >
          <el-tab-pane :label="i18n.t('char-voice-ui-select-source-nexon')" name="nexon">
            <component :is="CharVoiceNexonUi" :char-id="charId" />
          </el-tab-pane>
          <el-tab-pane :label="i18n.t('char-voice-ui-select-source-schaledb')" name="schaledb">
            <component :is="CharVoiceSchaleDbUi" :char-id="charId" />
          </el-tab-pane>
      </el-tabs>
    </KeepAlive>
  </div>
</template>

<style scoped>

</style>