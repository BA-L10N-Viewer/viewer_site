<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { MOBILE_WIDTH, autoTranslateService, autoTranslateLanguage, nexonDataLangSelect } from '@/tool/Constant'
import { watch, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const screenWidth = useWindowSize().width
const setting = useSetting()
const elRow12Span = ref(0)
const elRow8Span = ref(0)

const AUTO_TRANSLATE = false

watch(screenWidth, () => {
  if (screenWidth.value <= MOBILE_WIDTH) {
    elRow12Span.value = 24
    elRow8Span.value = 24
  } else {
    elRow12Span.value = 12
    elRow8Span.value = 8
  }
}, { immediate: true })
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent(
  {
    props: {
      show_ml: {
        type: Boolean,
        required: false,
        default: true
      }
    }
  }
)

</script>

<template>
  <h3 style="text-align: center">{{ $t('comp-story-i18n-h3') }}</h3>
  <el-row gutter="1" class="setting-row">
    <el-col :span="elRow12Span">
      <span>{{$t('comp-story-i18n-select-1')}}</span>
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
      <span>{{$t('comp-story-i18n-select-2')}}</span>
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
      <span>{{$t('comp-story-i18n-select-3')}}</span>
      <client-only>
        <el-select v-model="setting.i18n_lang1" style="width: calc(100% - 6em)">
          <el-option v-for="item in nexonDataLangSelect"
                     :key="item.value"
                     :label="$t(item.label)"
                     :value="item.value" />
        </el-select>
      </client-only>
    </el-col>
    <el-col :span="elRow8Span">
      <span>{{$t('comp-story-i18n-select-4')}}</span>
      <client-only>
        <el-select v-model="setting.i18n_lang2" style="width: calc(100% - 7em)">
          <el-option v-for="item in nexonDataLangSelect"
                     :key="item.value"
                     :label="$t(item.label)"
                     :value="item.value" />
        </el-select>
      </client-only>
    </el-col>
    <el-col :span="elRow8Span">
      <span>{{$t('comp-story-i18n-select-5')}}</span>
      <client-only>
        <el-select v-model="setting.i18n_lang3" style="width: calc(100% - 6em)">
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
        <el-button :disabled="!AUTO_TRANSLATE" class="btn-auto-translate">{{ $t('comp-story-i18n-btn-auto') }}
        </el-button>
      </el-col>
      <el-col :span="elRow8Span">
        <el-button :disabled="!AUTO_TRANSLATE" class="btn-auto-translate">{{ $t('comp-story-i18n-btn-auto') }}
        </el-button>
      </el-col>
      <el-col :span="elRow8Span">
        <el-button :disabled="!AUTO_TRANSLATE" class="btn-auto-translate">{{ $t('comp-story-i18n-btn-auto') }}
        </el-button>
      </el-col>
    </el-row>
    <el-row gutter="1" class="setting-row" style="text-align: center;">
      <el-col :span="elRow12Span">
        <el-switch
          v-model="setting.auto_i18n_showauto"
          size="large"
          :active-text="$t('comp-story-i18n-btn-showauto')"
          :disabled="!AUTO_TRANSLATE"
        />
      </el-col>
      <el-col :span="elRow12Span">
        <el-switch
          v-model="setting.auto_i18n_showboth"
          size="large"
          :active-text="$t('comp-story-i18n-btn-showboth')"
          :disabled="!AUTO_TRANSLATE"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button :disabled="!AUTO_TRANSLATE" style="width: 100%">{{ $t('comp-story-i18n-btn-clear') }}</el-button>
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