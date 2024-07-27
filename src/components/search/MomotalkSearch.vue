<script setup lang="ts">
import { httpGetBlocking } from '@/tool/HttpRequest'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SchaleDbI18nData } from '@/tool/Type'
import MomotalkSearchEntry from '@/components/search/MomotalkSearchEntry.vue'
import { useSetting } from '@/stores/setting'

const i18n = useI18n()
const setting = useSetting()

const inputQuery = ref('')
const showContent = ref(false)

const charDataRaw = JSON.parse(httpGetBlocking('/data/common/index_stu.json'))
let charData = ref([])

function updateCharData() {
  const checkInput = (entry: SchaleDbI18nData) => {
    for (const key in entry) {
      if (entry[key].toLowerCase().includes(inputQuery.value.toLowerCase())) {
        return true
      }
    }
    return false
  }

  let temp = []
  for (const key in charDataRaw) {
    const value = charDataRaw[String(key)]
    if (checkInput(value['Name'])) {
      temp.push(value)
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
  },
  {
    immediate: true
  }
)
watch(
  () => inputQuery.value,
  (newValue) => {
    showContent.value = newValue.length >= 2;
  }
)
</script>

<template>
  <el-input v-model="inputQuery" :placeholder="i18n.t('search-mmt-input')" @input="updateCharData" />
  <br />
  <h3>{{ i18n.t('search-mmt-h3') }}</h3>
  <el-button v-if="!showContent" @click="showContent = true">{{i18n.t('search-mmt-force-show')}}</el-button>
  <ul class="char-list" :key="inputQuery + setting.ui_lang" v-if="showContent">
    <MomotalkSearchEntry v-for="(item, idx) in charData" :key="idx" :name="item['Name']"
                         :family_name="item['FamilyName']" :char_id="item['Id']" />
  </ul>
</template>

<style scoped>
.char-list {
  font-size: 1.5em;
}
</style>