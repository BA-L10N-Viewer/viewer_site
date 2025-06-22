<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { allLangcodeOfSchaleDbBySiteUiLang, CHAR_NPC_IMG_URL, MOBILE_WIDTH } from '@/tool/Constant'

import 'lazysizes'
import { computed, defineProps, type PropType, ref } from 'vue'
import { type SchaleDbL10nData } from '@/types/OutsourcedData'
import { getStaticCdnBasepath } from '@/tool/HttpRequest'

import PvTag from 'primevue/tag'
import NexonI18nDataOutput from '@/components/genetic/NexonI18nDataOutput.vue'
import { useWindowSize } from '@vueuse/core'

const props = defineProps({
  char_id: {
    type: Number,
    required: true
  },
  family_name: {
    type: Object as PropType<SchaleDbL10nData>,
    required: true
  },
  name: {
    type: Object as PropType<SchaleDbL10nData>,
    required: true
  }
})

function getImgUrlById(charId: string | number) {
  const temp = String(charId)

  if (temp in CHAR_NPC_IMG_URL) return CHAR_NPC_IMG_URL[temp]
  else return `${getStaticCdnBasepath('schaledb')}/images/student/collection/${temp}.webp`
}
function isNpc(charId: string | number) {
  return String(charId) in CHAR_NPC_IMG_URL
}

const setting = useSetting()

const uiLang = ref(setting.ui_lang)
const schaleDbLang = computed(() => allLangcodeOfSchaleDbBySiteUiLang[uiLang.value])

const cssFontSizeForCharName = computed(() =>
  useWindowSize().width.value < MOBILE_WIDTH ? '0.8em' : '1em'
)
</script>

<template>
  <li style="margin-bottom: 0.6rem">
    <PvTag severity="success">{{ char_id }}</PvTag>
    <span>&nbsp;&nbsp;</span>
    <img class="icon-stu lazyload" :data-src="getImgUrlById(char_id)" />
    <span>&nbsp;</span>
    <span class="char-name"><NexonI18nDataOutput :data="name" :data-lang="schaleDbLang" /></span>
    <br />
    <ul style="font-size: 1.2rem">
      <template v-if="!isNpc(char_id)">
        <li>
          {{ $t('char-search-tip1')
          }}<RouterLink :to="`/momotalk/${char_id}`">{{ $t('char-search-tip2') }}</RouterLink>
        </li>
        <li>
          {{ $t('char-search-tip1')
          }}<RouterLink :to="`/character/${char_id}`">{{ $t('char-search-tip3') }}</RouterLink>
        </li>
      </template>
      <li>
        {{ $t('char-search-tip1')
        }}<RouterLink :to="`/character/voice/${char_id}`">{{ $t('char-search-tip4') }}</RouterLink>
      </li>
    </ul>
  </li>
</template>

<style scoped>
.icon-stu {
  height: 2em;
}
.char-name {
  font-size: v-bind(cssFontSizeForCharName);
}
</style>
