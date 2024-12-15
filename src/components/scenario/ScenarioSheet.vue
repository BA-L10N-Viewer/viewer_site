<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { ScenarioDataStatusType, ScenarioParentData } from '@/tool/components/Scenario'
import type { NexonL10nData } from '@/types/OutsourcedData'
import { getStaticCdnBasepath } from '@/tool/HttpRequest'
import { allLangcodeOfSchaleDbBySiteUiLang, allLangcodeOfNexonBySiteUiLang, MOBILE_WIDTH } from '@/tool/Constant'
import { useSetting } from '@/stores/setting'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'
import ScenarioIsAfterBattleBadge from '@/components/genetic/ScenarioIsAfterBattleBadge.vue'
import { useWindowSize } from '@vueuse/core'

const setting = useSetting()

const props = defineProps({
  scenarioId: {
    type: [Number, String],
    required: true
  },
  dataStatus: {
    type: Array as PropType<ScenarioDataStatusType[]>,
    required: true
  },
  parentData: {
    type: Object as PropType<ScenarioParentData>,
    required: true
  },
  scenarioName: {
    type: Object as PropType<NexonL10nData>,
    required: true
  },
  scenarioDesc: {
    type: Object as PropType<NexonL10nData>,
    required: true
  },
  scenarioNameMt: {
    type: Object as PropType<NexonL10nData>,
    required: true
  },
  scenarioDescMt: {
    type: Object as PropType<NexonL10nData>,
    required: true
  }
})

const scenarioType = props.parentData?.Type === 'main' ? props.parentData?.Data.Category : props.parentData?.Type

const isMobile = computed(() => useWindowSize().width.value <= MOBILE_WIDTH)
</script>

<template>
  <table class="datasheet" v-if="!isMobile">
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-3') }}</td>
      <td colspan="3">
        <ul style="margin: 0; padding-left: 1em;">
          <NexonI18nDataOutput :data="scenarioName"
                               :data-mt="scenarioNameMt"
                               html-element-name="li" />
        </ul>
      </td>
    </tr>
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-4') }}</td>
      <td colspan="3">
        <ul style="margin: 0; padding-left: 1em;">
          <NexonI18nDataOutput
            :data="scenarioDesc"
            :data-mt="scenarioDescMt"
            html-element-name="li" />
        </ul>
      </td>
    </tr>
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-1') }}</td>
      <td>
        <span>{{ scenarioId }}</span>
        <br />
        <ScenarioIsAfterBattleBadge :story-id="scenarioId" />
      </td>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-2') }}</td>
      <td>{{ $t(`comp-scenario-datasheet-type-${scenarioType}`) }}</td>
    </tr>
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-5') }}</td>
      <td>
        <template v-for="(status, idx) in dataStatus" :key="idx">
          <span>{{ $t(`comp-scenario-datasheet-status-title-${idx}`)
            }}&nbsp;-&nbsp;{{ $t(`comp-scenario-datasheet-status-${status}`) }}</span>
          <br v-if="idx + 1 !== dataStatus.length" />
        </template>
      </td>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-6') }}</td>
      <td>
        <template v-if="scenarioType === 'bond' && parentData.Type === 'bond'">
          <img
            :src="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${String(scenarioId).slice(0,5)}.webp`"
            style="height: 8em; margin-bottom: 6px;">
          <br />
          <NexonI18nDataOutput :data="parentData.Data.CharName"
                               :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
        </template>
        <template v-else-if="scenarioType === 'event' && parentData.Type === 'event'">
          <span>{{ parentData.Data.EventId }}</span>
          <br />
          <NexonI18nDataOutput :data="parentData.Data.EventName"
                               :data-lang="allLangcodeOfNexonBySiteUiLang[setting.ui_lang]" />
        </template>
        <template v-else-if="parentData.Type === 'main'">
          <span><b>{{ $t(`comp-scenario-datasheet-type-${scenarioType}`) }}</b></span>
          <br />
          <span v-if="parentData.Data.VolumeName"><b>{{ $t('comp-scenario-datasheet-parent-main-volume') }}</b>&nbsp;-&nbsp;
            <NexonI18nDataOutput
              :data="parentData.Data.VolumeName!"
              :data-lang="allLangcodeOfNexonBySiteUiLang[setting.ui_lang]" />
          </span>
          <br v-if="parentData.Data.VolumeName" />
          <span><b>{{ $t('comp-scenario-datasheet-parent-main-chapter') }}</b>&nbsp;-&nbsp;
            <NexonI18nDataOutput :data="parentData.Data.ChapterName"
                                 :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
          </span>
        </template>
      </td>
    </tr>
  </table>
  <table class="datasheet" v-else>
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-3') }}</td>
    </tr>
    <tr>
      <td>
        <ul style="margin: 0; padding-left: 1em;">
          <NexonI18nDataOutput :data="scenarioName" html-element-name="li" />
        </ul>
      </td>
    </tr>
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-4') }}</td>
    </tr>
    <tr>
      <td>
        <ul style="margin: 0; padding-left: 1em;">
          <NexonI18nDataOutput :data="scenarioDesc" html-element-name="li" />
        </ul>
      </td>
    </tr>
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-1') }}</td>
    </tr>
    <tr>
      <td><span>{{ scenarioId }}</span>
        <br />
        <ScenarioIsAfterBattleBadge :story-id="scenarioId" />
      </td>
    </tr>
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-2') }}</td>
    </tr>
    <tr>
      <td>{{ $t(`comp-scenario-datasheet-type-${scenarioType}`) }}</td>
    </tr>
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-5') }}</td>
    </tr>
    <tr>
      <td>
        <template v-for="(status, idx) in dataStatus" :key="idx">
          <span>{{ $t(`comp-scenario-datasheet-status-title-${idx}`)
            }}&nbsp;-&nbsp;{{ $t(`comp-scenario-datasheet-status-${status}`) }}</span>
          <br v-if="idx + 1 !== dataStatus.length" />
        </template>
      </td>
    </tr>
    <tr>
      <td class="datasheet-title">{{ $t('comp-scenario-datasheet-item-6') }}</td>
    </tr>
    <tr>
      <td>
        <template v-if="scenarioType === 'bond' && parentData.Type === 'bond'">
          <img
            :src="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${String(scenarioId).slice(0,5)}.webp`"
            style="height: 8em; margin-bottom: 6px;">
          <br />
          <NexonI18nDataOutput :data="parentData.Data.CharName"
                               :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
        </template>
        <template v-else-if="scenarioType === 'event' && parentData.Type === 'event'">
          <span>{{ parentData.Data.EventId }}</span>
          <br />
          <NexonI18nDataOutput :data="parentData.Data.EventName"
                               :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
        </template>
        <template v-else-if="parentData.Type === 'main'">
          <span><b>{{ $t(`comp-scenario-datasheet-type-${scenarioType}`) }}</b></span>
          <br />
          <span v-if="parentData.Data.VolumeName">{{ $t('comp-scenario-datasheet-parent-main-volume') }}&nbsp;-&nbsp;
            <NexonI18nDataOutput
              :data="parentData.Data.VolumeName!"
              :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
          </span>
          <br v-if="parentData.Data.VolumeName" />
          <span>
            <NexonI18nDataOutput :data="parentData.Data.ChapterName"
                                 :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
          </span>
        </template>
      </td>
    </tr>
  </table>
</template>

<style scoped>
</style>