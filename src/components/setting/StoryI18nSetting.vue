<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { MOBILE_WIDTH, autoTranslateService, autoTranslateLanguage, nexonDataLangSelect } from '@/tool/Constant'
import { defineProps, watch, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useI18nTlControl } from '@/stores/i18nTlControl'

const screenWidth = useWindowSize().width
const setting = useSetting()
const elRow12Span = ref(0)
const elRow8Span = ref(0)

const props = defineProps({
  show_ml: {
    type: Boolean,
    default: true // Set default value
  }
})

watch(screenWidth, () => {
  if (screenWidth.value <= MOBILE_WIDTH) {
    elRow12Span.value = 24
    elRow8Span.value = 24
  } else {
    elRow12Span.value = 12
    elRow8Span.value = 8
  }
}, { immediate: true })

const ML_pinia = useI18nTlControl()

function ML_update(idx: number) {
  ML_pinia.setStatusTranslate(`i18n_l${idx}`)
  AUTO_TRANSLATE_IN_PROGRESS.value = 1
}

function ML_clearAll() {
  for (const idx of [1, 2, 3])
    ML_pinia.setStatusClear(`i18n_l${idx}`)
}

const AUTO_TRANSLATE = true
const AUTO_TRANSLATE_IN_PROGRESS = ref(0)

watch(
  () => [ML_pinia.i18n_l1, ML_pinia.i18n_l2, ML_pinia.i18n_l3],
  (newValue) => {
    if (newValue[0].startsWith('t') || newValue[1].startsWith('t') || newValue[2].startsWith('t')) {
      AUTO_TRANSLATE_IN_PROGRESS.value = 1
    } else if (newValue[0].startsWith('c') || newValue[1].startsWith('c') || newValue[2].startsWith('c')) {
      AUTO_TRANSLATE_IN_PROGRESS.value = 2
    } else {
      AUTO_TRANSLATE_IN_PROGRESS.value = 0
    }
  }
)
</script>

<template>
  <h3 style="text-align: center">{{ $t('comp-story-i18n-h3') }}</h3>
  <p style="text-align: center; font-weight: bold;">
    <span v-if="!AUTO_TRANSLATE_IN_PROGRESS" style="color: green;">{{ $t('comp-story-i18n-TL_ip-0') }}</span>
    <span v-else style="color: red;">{{ $t(`comp-story-i18n-TL_ip-${AUTO_TRANSLATE_IN_PROGRESS}`) }}</span>
  </p>
  <el-row gutter="1" class="setting-row">
    <el-col :span="elRow12Span">
      <span>{{ $t('comp-story-i18n-select-1') }}</span>
      <client-only>
        <el-select v-model="setting.auto_i18n_service" style="width: calc(100% - 8em)">
          <el-option v-for="item in autoTranslateService"
                     :key="item.value"
                     :label="$t(item.label)"
                     :value="item.value" />
        </el-select>
      </client-only>
    </el-col>
    <el-col :span="elRow12Span">
      <span>{{ $t('comp-story-i18n-select-2') }}</span>
      <client-only>
        <el-select v-model="setting.auto_i18n_lang" style="width: calc(100% - 10em)">
          <el-option v-for="item in autoTranslateLanguage"
                     :key="item.value"
                     :label="$t(item.label)"
                     :value="item.value" />
        </el-select>
      </client-only>
    </el-col>
  </el-row>
  <el-row gutter="1" class="setting-row">
    <el-col :span="elRow8Span">
      <span>{{ $t('comp-story-i18n-select-3') }}</span>
      <client-only>
        <el-select v-model="setting.i18n_lang1" style="width: calc(100% - 6em)"
                   :disabled="AUTO_TRANSLATE_IN_PROGRESS">
          <el-option v-for="item in nexonDataLangSelect"
                     :key="item.value"
                     :label="$t(item.label)"
                     :value="item.value" />
        </el-select>
      </client-only>
    </el-col>
    <el-col :span="elRow8Span">
      <span>{{ $t('comp-story-i18n-select-4') }}</span>
      <client-only>
        <el-select v-model="setting.i18n_lang2" style="width: calc(100% - 7em)"
                   :disabled="AUTO_TRANSLATE_IN_PROGRESS">
          <el-option v-for="item in nexonDataLangSelect"
                     :key="item.value"
                     :label="$t(item.label)"
                     :value="item.value" />
        </el-select>
      </client-only>
    </el-col>
    <el-col :span="elRow8Span">
      <span>{{ $t('comp-story-i18n-select-5') }}</span>
      <client-only>
        <el-select v-model="setting.i18n_lang3" style="width: calc(100% - 6em)"
                   :disabled="AUTO_TRANSLATE_IN_PROGRESS">
          <el-option v-for="item in nexonDataLangSelect"
                     :key="item.value"
                     :label="$t(item.label)"
                     :value="item.value" />
        </el-select>
      </client-only>
    </el-col>
  </el-row>
  <div v-if="show_ml">
    <el-row gutter="1" class="setting-row">
      <el-col :span="elRow8Span">
        <el-button :disabled="AUTO_TRANSLATE && AUTO_TRANSLATE_IN_PROGRESS"
                   @click="ML_update(1)"
                   class="btn-auto-translate">
          {{ $t('comp-story-i18n-btn-auto') }}
        </el-button>
      </el-col>
      <el-col :span="elRow8Span">
        <el-button :disabled="AUTO_TRANSLATE && AUTO_TRANSLATE_IN_PROGRESS"
                   @click="ML_update(2)"
                   class="btn-auto-translate">
          {{ $t('comp-story-i18n-btn-auto') }}
        </el-button>
      </el-col>
      <el-col :span="elRow8Span">
        <el-button :disabled="AUTO_TRANSLATE && AUTO_TRANSLATE_IN_PROGRESS"
                   @click="ML_update(3)"
                   class="btn-auto-translate">
          {{ $t('comp-story-i18n-btn-auto') }}
        </el-button>
      </el-col>
    </el-row>
    <el-row gutter="1" class="setting-row" style="text-align: center;">
      <el-col :span="elRow8Span">
        <el-switch
          v-model="setting.auto_i18n_showauto"
          size="large"
          :active-text="$t('comp-story-i18n-btn-showauto')"
          :inactive-text="$t('comp-story-i18n-btn-showboth')"
          :disabled="!AUTO_TRANSLATE"
        />
      </el-col>
      <el-col :span="elRow8Span">
        <el-switch
          v-model="setting.ui_force_mobile"
          size="large"
          :active-text="$t('comp-story-i18n-btn-forcemobile')"
          :disabled="!AUTO_TRANSLATE"
        />
      </el-col>
      <el-col :span="elRow8Span">
        <el-switch
          v-model="setting.ui_show_char_icon"
          size="large"
          :active-text="$t('comp-story-i18n-btn-showcharicon')"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button :disabled="AUTO_TRANSLATE && AUTO_TRANSLATE_IN_PROGRESS" style="width: 100%"
                   @click="ML_clearAll()">
          {{ $t('comp-story-i18n-btn-clear') }}
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.setting-row {
  margin-bottom: 8px;
}

.setting-row .el-col {
  margin-bottom: 5px;
}

.btn-auto-translate {
  text-align: center;
  width: calc(100% - 5px);
}
</style>