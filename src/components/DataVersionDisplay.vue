<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { formatDate } from '@/tool/Tool'
import { httpGetAsync } from '@/tool/HttpRequest'

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
    dataUpdateTime.value = Number(await httpGetAsync(`/data/MODIFIED.txt`)) * 1000,
    (async () => {
      const ghAction = JSON.parse(await httpGetAsync('https://gapi-aws.cnfast.top/repos/BA-L10N-Viewer/viewer_site/actions/runs'))
      const ghCommit = JSON.parse(await httpGetAsync('https://gapi-aws.cnfast.top/repos/BA-L10N-Viewer/viewer_site/commits/master'))

      siteUpdatedTime.value = (new Date(ghAction['workflow_runs'][0]['updated_at'])).getTime()
      siteCommitHash.value = ghCommit['sha']
    })()
  ])

  console.log(dataUpdateTimeString.value)
})
</script>

<template>
  <template v-if="verbose">
    <p>{{ $t('comp-data-version-data') }} - {{ dataUpdateTimeString }}</p>
    <p>{{ $t('comp-data-version-site') }} - {{ siteUpdatedTimeString }} [<a
      :href="`https://github.com/BA-L10N-Viewer/viewer_site/commit/${siteCommitHash}`">{{ siteCommitHash.slice(0, 8)
      }}</a>]
    </p>
  </template>
  <template v-else>
    <span>{{ $t('comp-data-version-info') }} - {{ dataUpdateTimeString.slice(0, 10) }} /
      {{ siteUpdatedTimeString.slice(0, 10) }}</span>
  </template>
</template>

<style scoped>

</style>