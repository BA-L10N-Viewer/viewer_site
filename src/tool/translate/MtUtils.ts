import type { NexonL10nDataLang } from '@/types/OutsourcedData'
import { i18nLangAll } from '@/tool/ConstantComputed'
import { MAX_RETRY_DEPTH } from '@/tool/HttpRequest'

export async function mtPiniaWatchCallback(
  watcherNewValue: [string, string, string, string, string],
  funcUpdate: (lang: NexonL10nDataLang) => Promise<void>,
  funcClear: (lang: NexonL10nDataLang) => void,
  funcStatusSetToComplete: (variable: string) => void
) {
  let translateFirstTime = false

  for (let i = 0; i < 5; i++) {
    if (!translateFirstTime) {
      if (watcherNewValue[i].startsWith('t')) {
        if (i18nLangAll.value[i] as string !== 'null') {
          await funcUpdate(i18nLangAll.value[i])
          funcStatusSetToComplete(`i18n_l${i+1}`)

          translateFirstTime = true
        }
      }
    }

    if (watcherNewValue[i].startsWith('c')) {
      funcClear(i18nLangAll.value[i])

      console.log(i18nLangAll.value[i])
      funcStatusSetToComplete(`i18n_l${i+1}`)
    }
  }
}

export abstract class BaseMtService<ResponseType> {
  constructor(
    public baseurl: string,
    public timeout: number = 5000
  ) {
  }

  public abstract getUrl(
    inputLang: string, inputText: string,
    outputLang: string,
    withBaseurl: boolean
  ): string

  public abstract translate(
    inputText: string, outputLang: string,
    inputLang: string
  ): Promise<ResponseType>

  public abstract concatTranslation(
    response: ResponseType
  ): string
}

export async function requestApi<ResponseType>(
  url: string, timeout: number,
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
      return await requestApi(url, timeout, depth + 1) as ResponseType
    } else {
      return await response.json() as ResponseType
    }
  } catch (e) {
    console.error(`ML Service (${url}): ${e}`)
    return await requestApi(url, timeout, depth + 1) as ResponseType
  }
}
