import type { NexonL10nDataLang, NexonL10nDataLangOfUi } from '@/types/OutsourcedData'
import { i18nLangAll } from '@/tool/ConstantComputed'
import { MAX_RETRY_DEPTH } from '@/tool/HttpRequest'
import type { InjectionKey, Ref } from 'vue'
import type { MlForMomotalk, MlForScenario } from '@/types/MachineTranslation'

type funcAsyncTypeOfPiniaWatcher =
  | ((lang: NexonL10nDataLangOfUi) => Promise<void>)
  | ((lang: NexonL10nDataLang) => Promise<void>)
type funcSyncTypeOfPiniaWatcher =
  | ((lang: NexonL10nDataLangOfUi) => void)
  | ((lang: NexonL10nDataLang) => void)
export async function mtPiniaWatchCallback(
  watcherNewValue: [string, string, string, string, string],
  funcUpdate: funcAsyncTypeOfPiniaWatcher,
  funcClear: funcSyncTypeOfPiniaWatcher,
  funcStatusSetToComplete: (variable: string) => void
) {
  let translateFirstTime = false

  for (let i = 0; i < 5; i++) {
    if (!translateFirstTime) {
      if (watcherNewValue[i].startsWith('t')) {
        if ((i18nLangAll.value[i] as string) !== 'null') {
          await funcUpdate(i18nLangAll.value[i])
          funcStatusSetToComplete(`i18n_l${i + 1}`)

          translateFirstTime = true
        }
      }
    }

    if (watcherNewValue[i].startsWith('c')) {
      funcClear(i18nLangAll.value[i])

      // console.log(i18nLangAll.value[i])
      funcStatusSetToComplete(`i18n_l${i + 1}`)
    }
  }
}

export abstract class BaseMtService<ResponseType> {
  constructor(
    public baseurl: string,
    public timeout: number = 5000
  ) {}

  public abstract getUrl(
    inputLang: string,
    inputText: string,
    outputLang: string,
    withBaseurl: boolean
  ): string

  public abstract translate(
    inputText: string,
    outputLang: string,
    inputLang: string
  ): Promise<ResponseType>

  public abstract concatTranslation(response: ResponseType): string
}

export async function requestApi<ResponseType>(
  url: string,
  timeout: number,
  blankData: ResponseType,
  depth: number = MAX_RETRY_DEPTH
): Promise<ResponseType> {
  if (depth > MAX_RETRY_DEPTH) {
    return blankData
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return (await requestApi(url, timeout, depth + 1)) as ResponseType
    } else {
      return (await response.json()) as ResponseType
    }
  } catch (e) {
    console.error(`ML Service (${url}): ${e}`)
    return (await requestApi(url, timeout, depth + 1)) as ResponseType
  }
}

export const symbolForMomotalkMtData = Symbol('mt_data_for_momotalk') as InjectionKey<
  Ref<MlForMomotalk>
>
export const symbolForMomotalkEntryPos = Symbol('mmt_entry_pos') as InjectionKey<number>
export const symbolForMomotalkEntryDialoguePos = Symbol(
  'mmt_entry_dialogue_pos'
) as InjectionKey<number>
export const symbolForScenarioMtData = Symbol('mt_data_for_scenario') as InjectionKey<
  Ref<MlForScenario>
>
export const symbolForMtProgressBool = Symbol('mt_progress_boolean') as InjectionKey<Ref<boolean>>
