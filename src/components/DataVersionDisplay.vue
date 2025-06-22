<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { formatDate } from '@/tool/Tool'
import { getStaticCdnBasepath, httpGetAsync } from '@/tool/HttpRequest'

const dataUpdateTime = ref(0)
const dataUpdateTimeString = ref('')
const siteUpdatedTime = ref(0)
const siteUpdatedTimeString = ref('')
const siteCommitHash = ref('')

const props = defineProps({
  verbose: {
    type: Boolean,
    required: true
  }
})

watch(
  () => [dataUpdateTime.value, siteUpdatedTime.value],
  (newValue) => {
    dataUpdateTimeString.value = formatDate(new Date(newValue[0]), 'local')
    siteUpdatedTimeString.value = formatDate(new Date(newValue[1]), 'local')
  },
  { immediate: true }
)

onMounted(async () => {
  await Promise.allSettled([
    (dataUpdateTime.value = Number(await httpGetAsync(`/data/MODIFIED.txt`)) * 1000),
    (async () => {
      const ghCommit = JSON.parse(
        await httpGetAsync(
          `${getStaticCdnBasepath('ghapi')}/repos/BA-L10N-Viewer/viewer_site/commits/master`
        )
      )
      siteUpdatedTime.value = new Date(ghCommit['commit']['author']['date']).getTime()
      siteCommitHash.value = ghCommit['sha']
    })()
  ])

  console.log(dataUpdateTimeString.value)
})
</script>

<template>
  <template v-if="verbose">
    <p>{{ $t('comp-data-version-data') }} - {{ dataUpdateTimeString }}</p>
    <p>
      {{ $t('comp-data-version-site') }} - {{ siteUpdatedTimeString }} [<a
        :href="`https://github.com/BA-L10N-Viewer/viewer_site/commit/${siteCommitHash}`"
        >{{ siteCommitHash.slice(0, 8) }}</a
      >]
    </p>
  </template>
  <template v-else>
    <span
      >{{ $t('comp-data-version-info') }} - {{ dataUpdateTimeString.slice(0, 10) }} /
      {{ siteUpdatedTimeString.slice(0, 10) }}</span
    >
  </template>
</template>

<style scoped></style>
