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
import { clearCharProfileMt, initCharProfileMt, updateCharProfileMt } from '@/script/CharProfileMt'

const props = defineProps({
  charId: {
    type: [Number, String],
    required: true
  }
})

const setting = useSetting()

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

function clearMtTranslation(baselang: SchaleDbL10nDataLang | 'null') {
  clearCharProfileMt(baselang, charDataMt)
}

async function updateMtTranslation(baselang: SchaleDbL10nDataLang | 'null') {
  await updateCharProfileMt(
    baselang,
    mtControl,
    setting.auto_i18n_lang,
    setting.auto_i18n_service,
    charData,
    charDataMt
  )
}

function initMtData() {
  initCharProfileMt(charDataMt)
}

watch(mtI18nLangStats, async (newValue) => {
  await mtPiniaWatchCallback(
    newValue,
    updateMtTranslation,
    clearMtTranslation,
    mtControl.piniaMt.setStatusToComplete
  )
})

// --------------------------------------------------

const isLoading = ref(true)
onMounted(async () => {
  await loadAll()
  initMtData()

  isLoading.value = false
})

function getDataByKey(key: keyof MlForCharProfile) {
  if (key === 'School' || key === 'Club') return sdbL10nData[key][charData[key]]
  else return charData[key]
}
</script>

<template>
  <div v-if="isLoading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <h2>{{ $t('comp-char-profile-h2-0') }}</h2>
    <p>
      <RouterLink :to="`/character/voice/${charId}`">{{
        $t('comp-char-profile-p-0-1')
      }}</RouterLink>
    </p>
    <h2>{{ $t('comp-char-profile-h2-1') }}</h2>
    <table class="datasheet table-datasheet">
      <tr>
        <td>
          <img
            class="table-portrait"
            :src="`${getStaticCdnBasepath('schaledb')}/images/student/portrait/${charId}.webp`"
          />
        </td>
      </tr>
      <tr>
        <td>
          <img
            class="table-portrait-icon"
            :src="`${getStaticCdnBasepath('schaledb')}/images/student/collection/${charId}.webp`"
          />
        </td>
      </tr>
      <tr>
        <td>
          <p>
            <b>{{ charId }}</b>
          </p>
        </td>
      </tr>
    </table>

    <h2>{{ $t('comp-char-profile-h2-2') }}</h2>
    <h3>{{ $t('comp-char-profile-h3-2-1') }}</h3>
    <CharProfileTable :data-mt="charDataMt.FamilyName" :data="getDataByKey('FamilyName')" />
    <h3>{{ $t('comp-char-profile-h3-2-2') }}</h3>
    <CharProfileTable :data-mt="charDataMt.Name" :data="getDataByKey('Name')" />

    <h2>{{ $t('comp-char-profile-h2-3') }}</h2>
    <h3>{{ $t('comp-char-profile-h3-3-1') }}</h3>
    <CharProfileTable :data-mt="charDataMt.School" :data="getDataByKey('School')" />
    <h3>{{ $t('comp-char-profile-h3-3-2') }}</h3>
    <CharProfileTable :data-mt="charDataMt.Club" :data="getDataByKey('Club')" />

    <h2>{{ $t('comp-char-profile-h2-5') }}</h2>
    <h3>{{ $t('comp-char-profile-h3-5-1') }}</h3>
    <CharProfileTable :data-mt="charDataMt.Profile" :data="getDataByKey('Profile')" />
    <h3>{{ $t('comp-char-profile-h3-5-2') }}</h3>
    <CharProfileTable
      :data-mt="charDataMt.CharacterSSRNew"
      :data="getDataByKey('CharacterSSRNew')"
    />
    <h3>{{ $t('comp-char-profile-h3-5-3') }}</h3>
    <CharProfileTable :data-mt="charDataMt.StatusMessage" :data="getDataByKey('StatusMessage')" />
    <h3>{{ $t('comp-char-profile-h3-5-4') }}</h3>
    <CharProfileTable :data-mt="charDataMt.Hobby" :data="getDataByKey('Hobby')" />

    <h2>{{ $t('comp-char-profile-h2-4') }}</h2>
    <h3>{{ $t('comp-char-profile-h3-4-1') }}</h3>
    <CharProfileTable :data-mt="charDataMt.WeaponName" :data="getDataByKey('WeaponName')" />
    <h3>{{ $t('comp-char-profile-h3-4-2') }}</h3>
    <CharProfileTable :data-mt="charDataMt.WeaponDesc" :data="getDataByKey('WeaponDesc')" />
  </div>
</template>

<style scoped>
.table-datasheet {
  text-align: center;
  width: 40vw;
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
