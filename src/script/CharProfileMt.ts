import type { useI18nTlControl } from '@/stores/i18nTlControl'
import { AsyncTaskPool } from '@/tool/AsyncTaskPool'
import { DirectoryDataCommonSchaleFileLocalization } from '@/tool/PreFetchedData'
import { getTranslation, type MtServiceName } from '@/tool/translate/MtDispatcher'
import type { MlForCharProfile } from '@/types/MachineTranslation'
import type { SchaleDbStuInfoFull } from '@/types/OutsourcedData'
import { SchaleDbL10nDataLang } from '@/types/OutsourcedData'
import type { Ref } from 'vue'

const charDataMtKey: (keyof MlForCharProfile)[] = [
  'FamilyName',
  'Name',
  'WeaponName',
  'WeaponDesc',
  'School',
  'Club',
  'Profile',
  'CharacterSSRNew',
  'Hobby',
  'StatusMessage'
] as const

export function initCharProfileMt(charDataMt: Ref<MlForCharProfile>) {
  for (const lang of SchaleDbL10nDataLang) {
    clearCharProfileMt(lang, charDataMt)
  }
}

export function clearCharProfileMt(
  baselang: SchaleDbL10nDataLang | 'null',
  charDataMt: Ref<MlForCharProfile>
) {
  if (baselang === 'null') return

  for (const key of charDataMtKey) {
    charDataMt.value[key] = {
      j_ja: '',
      j_ko: '',
      g_ja: '',
      g_ko: '',
      g_en: '',
      g_tw: '',
      g_tw_cn: '',
      g_th: '',
      c_cn: '',
      c_cn_tw: '',
      c_zh: '',
      c_zh_tw: ''
    }
  }
}

export async function updateCharProfileMt(
  baselang: SchaleDbL10nDataLang | 'null',
  mtControl: {
    inProgress: Ref<boolean>
    piniaMt: ReturnType<typeof useI18nTlControl>
  },
  autoI18nLang: string,
  autoI18nService: MtServiceName,
  charData: SchaleDbStuInfoFull,
  charDataMt: Ref<MlForCharProfile>
) {
  if (baselang === 'null') return

  const sdbL10nData = DirectoryDataCommonSchaleFileLocalization.value

  mtControl.inProgress.value = true
  clearCharProfileMt(baselang, charDataMt)

  const asyncPool = new AsyncTaskPool(8)
  for (const key of charDataMtKey) {
    if (key === 'School' || key === 'Club') {
      const temp = charData[key]
      const temp2 = sdbL10nData[key][temp][baselang]
      asyncPool.addTask(async () => {
        charDataMt.value[key][baselang] = await getTranslation(autoI18nService, temp2, autoI18nLang)
      })
    } else {
      asyncPool.addTask(async () => {
        charDataMt.value[key][baselang] = await getTranslation(
          autoI18nService,
          charData[key][baselang],
          autoI18nLang
        )
      })
    }
  }

  await asyncPool.runAll(mtControl.piniaMt.updateProgress)
  mtControl.inProgress.value = false
}
