import { MAX_RETRY_DEPTH } from '@/tool/HttpRequest'

export type GoogleTranslateResponse = {
  /* 并未准确反映出类型，实际上还有一个 `{srctranslit: string}` 始终在array的最后一项，但是不会注解就没写了 */
  sentences:
    {
      trans: string;
      orig: string;
      backend: number;
      model_specification: any[];
      translation_engine_debug_info: any[];
    }[];
  dict?: [];
  src: string;
  confidence: number;
  spell: {};
  ld_result: {
    srclangs: string[];
    srclangs_confidences: number[];
    extended_srclangs: string[];
  };
}
export const GoogleTranslateResponseBlank: GoogleTranslateResponse = {
  confidence: 0,
  ld_result: { extended_srclangs: [], srclangs: [], srclangs_confidences: [] },
  sentences: [{
    trans: 'null',
    orig: 'null',
    backend: 0,
    model_specification: [],
    translation_engine_debug_info: []
  }],
  spell: {},
  src: ''
}

export const apiEndpoint = async (url: string, timeout: number = 5000, depth: number = 0): Promise<GoogleTranslateResponse> => {
  if (depth > MAX_RETRY_DEPTH) {
    return GoogleTranslateResponseBlank
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      method: 'GET',
      /*headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      },*/
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return await apiEndpoint(url, timeout, depth + 1)
    } else {
      return response.json()
    }
  } catch (e) {
    console.error(`ML_Google (${url}): ${e}`)
    return await apiEndpoint(url, timeout, depth + 1)
  }
}

export function getTranslateUrl(text: string, outputLang: string, inputLang: string = 'auto', with_base: boolean = true) {
  const url = new URL(`${with_base ? 'https://translate.googleapis.com' : ''}/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&dt=ex&dt=ld&dt=md&dt=qca&dt=rm&dt=ss`)
  url.searchParams.set('sl', inputLang)
  url.searchParams.set('tl', outputLang)
  url.searchParams.set('q', text)
  return url.toString()
}

export async function translate(text: string, outputLang: string, inputLang: string = 'auto') {
  const url = getTranslateUrl(text, outputLang, inputLang, true)
  return await apiEndpoint(url, 5000)
}

export function joinTranslateResult(resp: GoogleTranslateResponse) {
  const actualSentences = resp.sentences.slice(0, -1)

  let result = ''
  for (const entry of actualSentences) {
    result += entry['trans']
  }

  return result
}
