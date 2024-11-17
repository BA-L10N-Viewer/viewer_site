<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getStaticCdnBasepath, httpGetAsync, httpGetJsonAsync } from '@/tool/HttpRequest'
import { useRoute } from 'vue-router'
import type { SchaleDbI18nDictData, StudentInfoDataSimple } from '@/types/OutsourcedData'
import { useWindowSize } from '@vueuse/core'
import { allLangcodeOfSchaleDbBySiteUiLang, MOBILE_WIDTH } from '@/tool/Constant'

import PvButton from 'primevue/button'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'
import { useSetting } from '@/stores/setting'

const props = defineProps({
  charId: {
    type: [Number, String],
    required: true
  },
  isMmt: {
    type: Boolean,
    required: true
  }
})

const route = useRoute()
const setting = useSetting()
const isLoading = ref(true)

let sdbStuInfoData: StudentInfoDataSimple = {} as unknown as StudentInfoDataSimple
let sdbLocalizationData: SchaleDbI18nDictData = {} as unknown as SchaleDbI18nDictData

const isMobile = computed(() => useWindowSize().width.value <= MOBILE_WIDTH)
const isNpc = computed(() => String(props.charId) in NPC_IMG_URL)

const NPC_IMG_URL: Record<string, string> = {
  '9009000': `${getStaticCdnBasepath('static')}/ba/01_01_Character/npc_portrait_arona.png`, // Arona
  '9009001': `${getStaticCdnBasepath('static')}/ba/01_01_Character/npc_portrait_sora.png`, // Sora
  '9009002': `${getStaticCdnBasepath('static')}/ba/01_01_Character/npc_portrait_momoka.png`, // Momoka
  '9009003': `${getStaticCdnBasepath('static')}/ba/01_01_Character/npc_portrait_rin.png`, // Rin
  '9009004': `${getStaticCdnBasepath('static')}/ba/01_01_Character/npc_portrait_np0013.png`, // Ayumu
  '9009005': `${getStaticCdnBasepath('static')}/ba/01_01_Character/npc_portrait_np0035.png`  // Plana
}
const charImgUrl = isNpc.value ? NPC_IMG_URL[String(props.charId)] : `${getStaticCdnBasepath('schaledb')}/images/student/collection/${String(props.charId)}.webp`
const indexL2dData: Record<string, number> = {} as unknown as Record<string, number>

const cssCharColor = computed(() => {
  if (String(props.charId).startsWith('900'))
    return 'black'
  else if (String(props.charId).startsWith('1'))
    return 'var(--color-ba-stu-striker)'
  else
    return 'var(--color-ba-stu-special)'
})

onMounted(async () => {
  await Promise.allSettled([
    (async () => {
      const sdbStu = JSON.parse(await httpGetAsync(`/data/common/index_stu.json`))
      const sdbNpc = JSON.parse(await httpGetAsync(`/data/common/index_npc.json`))
      sdbStuInfoData = Object.assign({}, sdbStu, sdbNpc)
    })(),
    httpGetJsonAsync(sdbLocalizationData, `/data/common/schale/localization.json`),
    httpGetJsonAsync(indexL2dData, `/data/common/index_momo_l2d.json`)
  ])

  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <table class="datasheet" v-if="!isMobile">
      <tr>
        <td class="datasheet-title">{{ $t('comp-char-datasheet-item-1') }}</td>
        <td class="datasheet-title">{{ $t('comp-char-datasheet-item-2') }}</td>
        <td>
          <template v-if="!isNpc">
            <span>{{ indexL2dData[String(charId)] }}&nbsp;&nbsp;</span>
            <PvButton as="RouterLink" :to="`/scenario/${indexL2dData[String(charId)]}`"
                      size="small"
                      v-if="isMmt">
              {{ $t('comp-char-datasheet-enter-l2d') }}
            </PvButton>
          </template>
        </td>
      </tr>
      <tr>
        <td style="text-align: center; width: 8em;" rowspan="3">
          <img :src="charImgUrl" style="width: 8em; margin-bottom: 6px;" />
          <br />
          <span :style="{'color': cssCharColor}"><b>{{ charId }}</b></span>
        </td>
        <td class="datasheet-title">
          <span>{{ $t('comp-char-datasheet-item-3') }}</span>
        </td>
        <td>
          <template v-if="!isNpc">
            <NexonI18nDataOutput :data="sdbStuInfoData[String(charId)]['FamilyName']"
                                 :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
            <br />
          </template>
          <NexonI18nDataOutput :data="sdbStuInfoData[String(charId)]['Name']"
                               :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
        </td>
      </tr>
      <tr>
        <td class="datasheet-title">
          <span>{{ $t('comp-char-datasheet-item-4') }}</span>
        </td>
        <td>
          <template v-if="!isNpc">
            <NexonI18nDataOutput :data="sdbLocalizationData['School'][sdbStuInfoData[String(charId)]['School']]"
                                 :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
          </template>
        </td>
      </tr>
      <tr>
        <td class="datasheet-title">
          <span>{{ $t('comp-char-datasheet-item-5') }}</span>
        </td>
        <td>
          <template v-if="!isNpc">
            <NexonI18nDataOutput :data="sdbLocalizationData['Club'][sdbStuInfoData[String(charId)]['Club']]"
                                 :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
          </template>
        </td>
      </tr>
    </table>
    <table class="datasheet" v-else>
      <tr>
        <td class="datasheet-title">{{ $t('comp-char-datasheet-item-1') }}</td>
      </tr>
      <tr>
        <td style="text-align: center;">
          <img :src="charImgUrl" style="width: 8em; margin-bottom: 6px;" />
          <br />
          <span :style="{'color': cssCharColor}"><b>{{ charId }}</b></span>
        </td>
      </tr>
      <template v-if="!isNpc">
        <tr>
          <td class="datasheet-title">{{ $t('comp-char-datasheet-item-2') }}</td>
        </tr>
        <tr>
          <td style="text-align: center">
            <span>{{ indexL2dData[String(charId)] }}&nbsp;&nbsp;</span>
            <PvButton as="RouterLink" :to="`/scenario/${indexL2dData[String(charId)]}`"
                      size="small"
                      v-if="isMmt">
              {{ $t('comp-char-datasheet-enter-l2d') }}
            </PvButton>
          </td>
        </tr>
      </template>
      <tr>
        <td class="datasheet-title">
          <span>{{ $t('comp-char-datasheet-item-3') }}</span>
        </td>
      </tr>
      <tr>
        <td>
          <template v-if="!isNpc">
            <NexonI18nDataOutput :data="sdbStuInfoData[String(charId)]['FamilyName']"
                                 :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
            <br />
          </template>
          <NexonI18nDataOutput :data="sdbStuInfoData[String(charId)]['Name']"
                               :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
        </td>
      </tr>
      <template v-if="!isNpc">
        <tr>
          <td class="datasheet-title">
            <span>{{ $t('comp-char-datasheet-item-4') }}</span>
          </td>
        </tr>
        <tr>
          <td>
            <NexonI18nDataOutput :data="sdbLocalizationData['School'][sdbStuInfoData[String(charId)]['School']]"
                                 :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
          </td>
        </tr>
        <tr>
          <td class="datasheet-title">
            <span>{{ $t('comp-char-datasheet-item-5') }}</span>
          </td>
        </tr>
        <tr>
          <td>
            <NexonI18nDataOutput :data="sdbLocalizationData['Club'][sdbStuInfoData[String(charId)]['Club']]"
                                 :data-lang="allLangcodeOfSchaleDbBySiteUiLang[setting.ui_lang]" />
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<style scoped>
.datasheet-title {
  width: 6em !important;
}
</style>