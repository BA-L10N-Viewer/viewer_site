<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { useRouter } from 'vue-router'
import { NexonLangMapReverse } from '@/tool/Constant'

import 'lazysizes'
import { defineProps, computed, ref, type PropType } from 'vue'
import { type SchaleDbL10nData, type SchaleDbL10nDataLang } from '@/types/OutsourcedData'

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

const setting = useSetting()
const router = useRouter()

const uiLang = ref(setting.ui_lang)
const schaleDbLang = computed(() => NexonLangMapReverse[uiLang.value])
</script>

<template>
  <li style="margin-bottom: 0.6rem">
    <el-tag type="success">{{ char_id }}</el-tag>
    <span>&nbsp;&nbsp;</span>
    <img class="icon-stu lazyload" :data-src="`https://schale.gg/images/student/collection/${char_id}.webp`">
    <span>&nbsp;</span>
    <span v-for="(lang, idx) in schaleDbLang" :key="idx">{{ name[lang as SchaleDbL10nDataLang] }}<span v-if="idx + 1 != schaleDbLang.length">&nbsp;/&nbsp;</span></span>
    <br />
    <ul style="font-size: 1.2rem">
      <li>{{ $t('char-search-tip1') }}<a href="javascript: void 0"
                                         @click="router.push({'name': 'momotalk', 'params': {'charId': char_id}})">{{ $t('char-search-tip2') }}</a>
      </li>
      <li>{{ $t('char-search-tip1') }}<a href="javascript: void 0"
                                         @click="router.push({'name': 'char_info', 'params': {'charId': char_id}})">{{ $t('char-search-tip3') }}</a>
      </li>
    </ul>
  </li>
</template>

<style scoped>
.icon-stu {
  height: 2em;
}
</style>