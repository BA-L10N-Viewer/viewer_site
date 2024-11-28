<script setup lang="ts">
import { useSetting } from '@/stores/setting'
import { useI18n } from 'vue-i18n'
import type { SchaleDbL10nData, SchaleDbStuInfoFull } from '@/types/OutsourcedData'
import { SchaleDbL10nDataLang } from '@/types/OutsourcedData'
import { DirectoryDataCommonSchaleFileLocalization } from '@/tool/PreFetchedData'
import { getStaticCdnBasepath, httpGetJsonAsync } from '@/tool/HttpRequest'
import type { MlForCharProfile } from '@/types/MachineTranslation'
import { onMounted, ref, watch } from 'vue'
import { useI18nTlControl } from '@/stores/i18nTlControl'
import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import { getTranslation } from '@/tool/translate/MtDispatcher'
import { mtI18nLangStats } from '@/tool/ConstantComputed'
import { mtPiniaWatchCallback } from '@/tool/translate/MtUtils'
import CharProfileTable from '@/components/profile/CharProfileTable.vue'

const props = defineProps({
  charId: {
    type: [Number, String],
    required: true
  }
})

const setting = useSetting()
const i18n = useI18n()

let charData: SchaleDbStuInfoFull = {} as unknown as SchaleDbStuInfoFull
const sdbL10nData = DirectoryDataCommonSchaleFileLocalization.value

async function loadAll() {
  await httpGetJsonAsync(charData, `/data/common/schale_stu/${props.charId}.json`)
}

// ----------------------------- MACHINE TRANSLATION
const charDataMt = ref<MlForCharProfile>({
  FamilyName: {} as unknown as SchaleDbL10nData,
  Name: {} as unknown as SchaleDbL10nData,
  WeaponName: {} as unknown as SchaleDbL10nData,
  WeaponDesc: {} as unknown as SchaleDbL10nData,
  School: {} as unknown as SchaleDbL10nData,
  Club: {} as unknown as SchaleDbL10nData,
  Profile: {} as unknown as SchaleDbL10nData,
  CharacterSSRNew: {} as unknown as SchaleDbL10nData,
  Hobby: {} as unknown as SchaleDbL10nData,
  StatusMessage: {} as unknown as SchaleDbL10nData
})
const mtControl = {
  inProgress: ref(false),
  piniaMt: useI18nTlControl()
}

const charDataMtKey: (keyof MlForCharProfile)[] = [
  'FamilyName', 'Name',
  'WeaponName', 'WeaponDesc',
  'School', 'Club',
  'Profile', 'CharacterSSRNew', 'Hobby', 'StatusMessage'
] as const

function clearMtTranslation(baselang: SchaleDbL10nDataLang | 'null') {
  if (baselang === 'null')
    return

  for (const key of charDataMtKey)
    charDataMt.value[key] = {
      'j_ja': '',
      'j_ko': '',
      'g_ja': '',
      'g_ko': '',
      'g_en': '',
      'g_tw': '',
      'g_tw_cn': '',
      'g_th': '',
      'c_cn': '',
      'c_cn_tw': '',
      'c_zh': '',
      'c_zh_tw': ''
    }
}

async function updateMtTranslation(baselang: SchaleDbL10nDataLang | 'null') {
  if (baselang === 'null')
    return

  mtControl.inProgress.value = true
  clearMtTranslation(baselang)

  const asyncPool = new AsyncTaskPool(8)
  for (const key of charDataMtKey) {
    if (key === 'School' || key === 'Club') {
      const temp = charData[key]
      const temp2 = sdbL10nData[key][temp][baselang]
      asyncPool.addTask(async () => {
        charDataMt.value[key][baselang] = await getTranslation(
          setting.auto_i18n_service,
          temp2,
          setting.auto_i18n_lang
        )
      })
    } else {
      asyncPool.addTask(async () => {
        charDataMt.value[key][baselang] = await getTranslation(
          setting.auto_i18n_service,
          charData[key][baselang],
          setting.auto_i18n_lang
        )
      })
    }
  }

  await asyncPool.runAll(mtControl.piniaMt.updateProgress)
  mtControl.inProgress.value = false
}

function initMtData() {
  for (const lang of SchaleDbL10nDataLang)
    clearMtTranslation(lang)
}

watch(
  mtI18nLangStats,
  async (newValue) => {
    await mtPiniaWatchCallback(newValue, updateMtTranslation, clearMtTranslation, mtControl.piniaMt.setStatusToComplete)
  }
)

// --------------------------------------------------

const isLoading = ref(true)
onMounted(async () => {
  await loadAll()
  initMtData()

  isLoading.value = false
})

function getDataByKey(key: keyof MlForCharProfile) {
  if (key === 'School' || key === 'Club')
    return sdbL10nData[key][charData[key]]
  else
    return charData[key]
}
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <h2>{{ $t('comp-char-profile-h2-0') }}</h2>
    <p>
      <RouterLink :to="`/character/voice/${charId}`">{{ $t('comp-char-profile-p-0-1') }}</RouterLink>
    </p>
    <h2>{{ $t('comp-char-profile-h2-1') }}</h2>
    <table class="datasheet table-datasheet">
      <tr>
        <td>
          <img class="table-portrait"
               :src="`${getStaticCdnBasepath('schaledb')}/images/student/portrait/${charId}.webp`" />
        </td>
      </tr>
      <tr>
        <td>
          <img class="table-portrait-icon"
               :src="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${charId}.webp`" />
        </td>
      </tr>
      <tr>
        <td>
          <p><b>{{ charId }}</b></p>
        </td>
      </tr>
    </table>

    <h2>{{ $t('comp-char-profile-h2-2') }}</h2>
    <h3>{{ $t('comp-char-profile-h3-2-1') }}</h3>
    <CharProfileTable :data-mt="charDataMt.FamilyName"
                      :data="getDataByKey('FamilyName')" />
    <h3>{{ $t('comp-char-profile-h3-2-2') }}</h3>
    <CharProfileTable :data-mt="charDataMt.Name"
                      :data="getDataByKey('Name')" />

    <h2>{{ $t('comp-char-profile-h2-3') }}</h2>
    <h3>{{ $t('comp-char-profile-h3-3-1') }}</h3>
    <CharProfileTable :data-mt="charDataMt.School"
                      :data="getDataByKey('School')" />
    <h3>{{ $t('comp-char-profile-h3-3-2') }}</h3>
    <CharProfileTable :data-mt="charDataMt.Club"
                      :data="getDataByKey('Club')" />

    <h2>{{ $t('comp-char-profile-h2-5') }}</h2>
    <h3>{{ $t('comp-char-profile-h3-5-1') }}</h3>
    <CharProfileTable :data-mt="charDataMt.Profile"
                      :data="getDataByKey('Profile')" />
    <h3>{{ $t('comp-char-profile-h3-5-2') }}</h3>
    <CharProfileTable :data-mt="charDataMt.CharacterSSRNew"
                      :data="getDataByKey('CharacterSSRNew')" />
    <h3>{{ $t('comp-char-profile-h3-5-3') }}</h3>
    <CharProfileTable :data-mt="charDataMt.StatusMessage"
                      :data="getDataByKey('StatusMessage')" />
    <h3>{{ $t('comp-char-profile-h3-5-4') }}</h3>
    <CharProfileTable :data-mt="charDataMt.Hobby"
                      :data="getDataByKey('Hobby')" />

    <h2>{{ $t('comp-char-profile-h2-4') }}</h2>
    <h3>{{ $t('comp-char-profile-h3-4-1') }}</h3>
    <CharProfileTable :data-mt="charDataMt.WeaponName"
                      :data="getDataByKey('WeaponName')" />
    <h3>{{ $t('comp-char-profile-h3-4-2') }}</h3>
    <CharProfileTable :data-mt="charDataMt.WeaponDesc"
                      :data="getDataByKey('WeaponDesc')" />
  </div>
</template>

<style scoped>
.table-datasheet {
  text-align: center;
  width: 40vw
}

.table-portrait {
  width: 30vw;
}

.table-portrait-icon {
  width: 8em;
}

@media screen and (max-width: 800px) {
  .table-portrait {
    height: auto;
    width: 80vw;
  }

  .table-datasheet {
    width: 100%;
  }
}
</style>