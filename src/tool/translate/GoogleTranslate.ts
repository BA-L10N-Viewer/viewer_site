import { BaseMtService, requestApi } from '@/tool/translate/MtUtils'
import { ipClientCountryAtInit } from '@/tool/ClientIp'
import type { Nullable } from '@/types/CommonType'

type GoogleTranslateResponseSentence = {
  trans: string;
  orig: string;
  backend: number;
  model_specification: unknown[];
  translation_engine_debug_info: unknown[];
} | {
  srctranslit: string
}

export type GoogleTranslateResponse = {
  /* 并未准确反映出类型，实际上还有一个 `{srctranslit: string}` 始终在array的最后一项，但是不会注解就没写了 */
  sentences: GoogleTranslateResponseSentence[];
  dict?: unknown[];
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

class MtGoogleTranslate extends BaseMtService<GoogleTranslateResponse> {
  public isCn: boolean

  constructor() {
    if (ipClientCountryAtInit.value === 'CN')
      super('https://aws-gt-api.cnfast.top/', 5000)
    else
      super('https://translate.googleapis.com', 3000)

    this.isCn = ipClientCountryAtInit.value === 'CN'
  }

  getUrl(inputLang: string, inputText: string, outputLang: string, withBaseurl: boolean): string {
    let url: URL
    if (this.isCn) {
      url = new URL(`${withBaseurl ? this.baseurl : ''}`)
      url.pathname = `dt=ss&sl=${inputLang}&tl=${outputLang}&q=${inputText}`
    } else {
      url = new URL(`${withBaseurl ? this.baseurl : ''}/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&dt=ex&dt=ld&dt=md&dt=qca&dt=rm&dt=ss`)
      url.searchParams.set('sl', inputLang)
      url.searchParams.set('tl', outputLang)
      url.searchParams.set('q', inputText)
    }

    return url.toString()
  }

  async translate(inputText: string | Nullable, outputLang: string, inputLang: string = 'auto') {
    const url = this.getUrl(inputLang, String(inputText), outputLang, true)
    return await requestApi<GoogleTranslateResponse>(url, this.timeout, GoogleTranslateResponseBlank)
  }

  concatTranslation(response: GoogleTranslateResponse): string {
    const actualSentences = response.sentences.slice(0, -1)

    let result = ''
    for (const entry of actualSentences) {
      if ('trans' in entry)
        result += entry['trans']
    }

    return result
  }
}

export const GoogleTranslateInstance = new MtGoogleTranslate()
