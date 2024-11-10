<script setup lang="ts">
import { httpGetAsync } from '@/tool/HttpRequest'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import MomotalkSearchEntry from '@/components/search/MomotalkSearchEntry.vue'
import { useSetting } from '@/stores/setting'
import type { SchaleDbL10nData, StudentInfoDataSimple, StudentInfoDataSimpleEntry } from '@/types/OutsourcedData'
import { useSearchVars } from '@/stores/search'
import { countCharacterLengthBiased, preProcessStringForSearch } from '@/tool/SearchTool'

import PvInputText from 'primevue/inputtext'
import PvButton from 'primevue/button'

const i18n = useI18n()
const setting = useSetting()
const searchCache = useSearchVars()

const inputQuery = ref('')
const showContent = ref(false)

const isAllDataLoaded = ref(false)

let charDataRaw: StudentInfoDataSimple = {} as unknown as StudentInfoDataSimple
let charData = ref<StudentInfoDataSimpleEntry[]>([])

async function loadAllData() {
  charDataRaw = JSON.parse(await httpGetAsync('/data/common/index_stu.json'))
}

function updateCharData() {
  const checkInput = (entry: SchaleDbL10nData) => {
    return Object.keys(entry).some((key) => {
      const value = entry[key as keyof SchaleDbL10nData]
      return preProcessStringForSearch(value.toLowerCase()).includes(preProcessStringForSearch(inputQuery.value.toLowerCase()))
    })
  }

  let temp = []
  for (const entry of Object.values(charDataRaw)) {
    if (checkInput(entry['Name'])) {
      temp.push(entry)
    }
  }
  charData.value = temp
}

watch(
  () => {
    return setting.ui_lang
  },
  () => {
    updateCharData()
  }
)
watch(
  () => inputQuery.value,
  (newValue) => {
    showContent.value = countCharacterLengthBiased(newValue) >= 2
  }
)

/* 搜索内容缓存 (instance 级) */
onMounted(async () => {
  await loadAllData()
  isAllDataLoaded.value = true

  inputQuery.value = searchCache.m_inputQuery
  updateCharData()
})
watch(
  () => [inputQuery.value],
  () => {
    searchCache.setMomotalkSearchVars(inputQuery.value)
  }
)
</script>

<template>
  <div v-if="!isAllDataLoaded">
    <h2>Loading...</h2>
  </div>
  <div v-if="isAllDataLoaded">
    <!-- h1 标题 -->
    <h1 class="search-h1">
      <i class="pi pi-search"></i>
      <span>&nbsp;&nbsp;<span v-html="i18n.t('search-mmt-h1')"></span></span>
    </h1>

    <!-- Input -->
    <PvInputText v-model="inputQuery" :placeholder="i18n.t('search-mmt-input')" @input="updateCharData"
                 style="width: 100%;" />
    <br />

    <h2>{{ i18n.t('search-mmt-h3') }}</h2>
    <PvButton v-if="!showContent" @click="showContent = true"
              severity="secondary" size="small">{{ i18n.t('search-mmt-force-show') }}
    </PvButton>
    <ul class="char-list" :key="inputQuery + setting.ui_lang" v-if="showContent">
      <MomotalkSearchEntry v-for="(item, idx) in charData" :key="idx" :name="item['Name']"
                           :family_name="item['FamilyName']" :char_id="item['Id']" />
    </ul>
  </div>
</template>

<style scoped>
.char-list {
  font-size: 1.5em;
}
</style>