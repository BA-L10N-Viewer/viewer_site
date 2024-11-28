<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { MOBILE_WIDTH, selectAutoTranslateService, autoTranslateLanguage, nexonDataLangSelect } from '@/tool/Constant'
import { defineProps, watch, ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import { useI18n } from 'vue-i18n'
import type { MlProgessInfo } from '@/types/MachineTranslation'

import PvFluid from 'primevue/fluid'
import PvSelect from 'primevue/select'
import PvDivider from 'primevue/divider'
import PvButton from 'primevue/button'
import PvSelectButton from 'primevue/selectbutton'

const screenWidth = useWindowSize().width
const isMobileWidth = computed(() => screenWidth.value <= MOBILE_WIDTH)
const widthForTlLangToolBtn = computed(() => !isMobileWidth.value ? '6em' : '2em')
const widthForTlLangSelect = computed(() => !isMobileWidth.value ? '14em' : '3em')

const setting = useSetting()

const i18n = useI18n()

const props = defineProps({
  show_ml: {
    type: Boolean,
    default: true
  }
})

const ML_pinia = useI18nTlControl()

function ML_update(idx: number) {
  ML_pinia.setStatusTranslate(`i18n_l${idx}`)
  AUTO_TRANSLATE_IN_PROGRESS.value = 1
}

function ML_clear(idx: number) {
  ML_pinia.setStatusClear(`i18n_l${idx}`)
}

const AUTO_TRANSLATE = true
const AUTO_TRANSLATE_IN_PROGRESS = ref(0)
const AUTO_TRANSLATE_PROGRESS = ref<MlProgessInfo>({ completed: -1, total: -1 })
const AUTO_TRANSLATE_PROGRESS_PERCENTAGE = computed(() => {
  const progress = AUTO_TRANSLATE_PROGRESS.value
  const percentage = progress.completed / progress.total * 100
  return parseFloat(percentage.toFixed(2))
})

watch(
  () => [ML_pinia.i18n_l1, ML_pinia.i18n_l2, ML_pinia.i18n_l3, ML_pinia.i18n_l4, ML_pinia.i18n_l5],
  (newValue) => {
    if (newValue[0].startsWith('t') || newValue[1].startsWith('t') || newValue[2].startsWith('t') || newValue[3].startsWith('t') || newValue[4].startsWith('t')) {
      AUTO_TRANSLATE_IN_PROGRESS.value = 1
    } else if (newValue[0].startsWith('c') || newValue[1].startsWith('c') || newValue[2].startsWith('c') || newValue[3].startsWith('c') || newValue[4].startsWith('c')) {
      AUTO_TRANSLATE_IN_PROGRESS.value = 2
    } else {
      AUTO_TRANSLATE_IN_PROGRESS.value = 0
    }
  }
)

watch(
  ML_pinia.progress,
  (newValue) => {
    AUTO_TRANSLATE_PROGRESS.value = newValue
  }
)
</script>

<template>
  <h2 style="text-align: center; font-size: 1.4em;">{{ $t('comp-story-i18n-h3') }}</h2>

  <!-- MACHINE TRANSLATION STATUS -->
  <p style="text-align: center; font-weight: bold;" v-if="show_ml">
    <span v-if="!AUTO_TRANSLATE_IN_PROGRESS" style="color: green;">{{ $t('comp-story-i18n-TL_ip-0') }}</span>
    <span v-else>
      <span style="color: red;">{{ $t(`comp-story-i18n-TL_ip-${AUTO_TRANSLATE_IN_PROGRESS}`) }}</span>
      <span>&nbsp;({{ AUTO_TRANSLATE_PROGRESS.completed }}/{{ AUTO_TRANSLATE_PROGRESS.total
        }}, <b>{{ AUTO_TRANSLATE_PROGRESS_PERCENTAGE }}%</b>)</span>
    </span>
  </p>

  <!-- MACHINE TRANSLATION CONFIG -->
  <PvFluid class="pv-fluid">
    <span class="span-label">{{ $t('comp-story-i18n-select-1') }}</span>
    <PvSelect v-model="setting.auto_i18n_service" :options="selectAutoTranslateService"
              :optionLabel="i => i18n.t(i.label)" optionValue="value"
              class="pv-select-tl-lang"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)" />
  </PvFluid>
  <div class="pv-fluid-spacing"></div>
  <PvFluid class="pv-fluid">
    <span class="span-label">{{ $t('comp-story-i18n-select-2') }}</span>
    <PvSelect v-model="setting.auto_i18n_lang" :options="autoTranslateLanguage"
              :optionLabel="i => i18n.t(i.label)" optionValue="value"
              class="pv-select-tl-lang"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)" />
  </PvFluid>
  <PvDivider />

  <!-- MACHINE TRANSLATION LANG -->
  <PvFluid class="pv-fluid">
    <span class="span-label">{{ $t('comp-story-i18n-select-3') }}</span>
    <PvSelect v-model="setting.i18n_lang1" :options="nexonDataLangSelect"
              :optionLabel="i => i18n.t(i.label)" optionValue="value"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"
              class="pv-select-tl-lang" />
    <PvButton class="pv-button-tl-tool"
              severity="success"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_update(1)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-1')">
      <span class="pi pi-language"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-7') }}</span>
    </PvButton>
    <PvButton class="pv-button-tl-tool"
              severity="danger"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_clear(1)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-6-tooltip')">
      <span class="pi pi-trash"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-6') }}</span>
    </PvButton>
  </PvFluid>
  <div class="pv-fluid-spacing"></div>
  <PvFluid class="pv-fluid">
    <span class="span-label">{{ $t('comp-story-i18n-select-4') }}</span>
    <PvSelect v-model="setting.i18n_lang2" :options="nexonDataLangSelect"
              :optionLabel="i => i18n.t(i.label)" optionValue="value"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"
              class="pv-select-tl-lang" />

    <PvButton class="pv-button-tl-tool"
              severity="success"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_update(2)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-2')">
      <span class="pi pi-language"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-7') }}</span>
    </PvButton>
    <PvButton class="pv-button-tl-tool"
              severity="danger"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_clear(2)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-6-tooltip')">
      <span class="pi pi-trash"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-6') }}</span>
    </PvButton>
  </PvFluid>
  <div class="pv-fluid-spacing"></div>
  <PvFluid class="pv-fluid">
    <span class="span-label">{{ $t('comp-story-i18n-select-5') }}</span>
    <PvSelect v-model="setting.i18n_lang3" :options="nexonDataLangSelect"
              :optionLabel="i => i18n.t(i.label)" optionValue="value"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"
              class="pv-select-tl-lang" />
    <PvButton class="pv-button-tl-tool"
              severity="success"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_update(3)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-3')">
      <span class="pi pi-language"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-7') }}</span>
    </PvButton>
    <PvButton class="pv-button-tl-tool"
              severity="danger"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_clear(3)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-6-tooltip')">
      <span class="pi pi-trash"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-6') }}</span>
    </PvButton>
  </PvFluid>
  <div class="pv-fluid-spacing"></div>
  <PvFluid class="pv-fluid">
    <span class="span-label">{{ $t('comp-story-i18n-select-6') }}</span>
    <PvSelect v-model="setting.i18n_lang4" :options="nexonDataLangSelect"
              :optionLabel="i => i18n.t(i.label)" optionValue="value"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"
              class="pv-select-tl-lang" />
    <PvButton class="pv-button-tl-tool"
              severity="success"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_update(4)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-4')">
      <span class="pi pi-language"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-7') }}</span>
    </PvButton>
    <PvButton class="pv-button-tl-tool"
              severity="danger"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_clear(4)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-6-tooltip')">
      <span class="pi pi-trash"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-6') }}</span>
    </PvButton>
  </PvFluid>
  <div class="pv-fluid-spacing"></div>
  <PvFluid class="pv-fluid">
    <span class="span-label">{{ $t('comp-story-i18n-select-7') }}</span>
    <PvSelect v-model="setting.i18n_lang5" :options="nexonDataLangSelect"
              :optionLabel="i => i18n.t(i.label)" optionValue="value"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"
              class="pv-select-tl-lang" />
    <PvButton class="pv-button-tl-tool"
              severity="success"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_update(5)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-5')">
      <span class="pi pi-language"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-7') }}</span>
    </PvButton>
    <PvButton class="pv-button-tl-tool"
              severity="danger"
              :disabled="Boolean(AUTO_TRANSLATE_IN_PROGRESS)"

              @click="ML_clear(5)"
              v-tooltip.top="i18n.t('comp-story-i18n-btn-auto-6-tooltip')">
      <span class="pi pi-trash"></span>
      <span v-show="!isMobileWidth">{{ $t('comp-story-i18n-btn-auto-6') }}</span>
    </PvButton>
  </PvFluid>
  <PvDivider />

  <!-- SCENARIO/MOMOTALK DIALOGUE SETTING -->
  <PvFluid>
    <div :class="!isMobileWidth ? 'grid grid-cols-3 gap-4' : ''">
      <div style="text-align: center">
        <PvSelectButton
          :option-label="i => i18n.t(i.label)"
          option-value="value"
          :options="[{'label': 'comp-story-i18n-btn-showboth', 'value': false}, {'label': 'comp-story-i18n-btn-showauto', 'value': true}]"
          v-model="setting.auto_i18n_showauto" />

      </div>
      <div class="pv-fluid-spacing" v-show="isMobileWidth"></div>
      <div style="text-align: center">
        <PvSelectButton
          :option-label="i => i18n.t(i.label)"
          option-value="value"
          :options="[{'label': 'comp-story-i18n-btn-autoviewmode', 'value': false}, {'label': 'comp-story-i18n-btn-forcemobile', 'value': true}]"
          v-model="setting.ui_force_mobile" />
        <br />
      </div>
      <div class="pv-fluid-spacing" v-show="isMobileWidth"></div>
      <div style="text-align: center">
        <PvSelectButton
          :option-label="i => i18n.t(i.label)"
          option-value="value"
          :options="[{'label': 'comp-story-i18n-btn-hidecharicon', 'value': false}, {'label': 'comp-story-i18n-btn-showcharicon', 'value': true}]"
          v-model="setting.ui_show_char_icon" />
        <br />
      </div>
    </div>
  </PvFluid>
  <div class="pv-fluid-spacing"></div>
  <PvFluid>
    <div :style="{'text-align': 'center'}">
      <PvSelectButton
        v-model="setting.show_lang_zh"

        :allow-empty="false"
        :option-label="i => i18n.t(i.label)"
        option-value="value"

        :options="[{label: 'comp-story-i18n-btn-showzh', value: true}, {label: 'comp-story-i18n-btn-hidezh', value: false}]"
      />
    </div>
  </PvFluid>
</template>

<style scoped>
.span-label {
  width: 6em;
  font-size: 1.1em
}

/* 较长文本的label，如第四、五机翻语言 */
/* .span-label-2 {
  width: 6em;
  font-size: 1.1em
} */

.pv-select-tl-lang {
  width: calc(100% - 6em - v-bind(widthForTlLangSelect))
}

/* 较长文本的select，如第四、五机翻语言 */
.pv-select-tl-lang-2 {
  width: calc(100% - 14em - v-bind(widthForTlLangSelect))
}

.pv-button-tl-tool {
  width: v-bind(widthForTlLangToolBtn);
  margin-left: 6px;
}

.pv-fluid {
  display: flex;
  flex-direction: row;
}

.pv-fluid-spacing {
  height: 8px;
}
</style>
