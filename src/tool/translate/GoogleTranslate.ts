import axios from 'axios'

const apiEndpoint = axios.create({
  baseURL: 'https://translate.googleapis.com',
  timeout: 5000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' }
})

export const getTranslateUrl = (text: string, outputLang: string, inputLang: string = 'auto', with_base: boolean = true) => {
  const url = new URL(`${with_base ? 'https://translate.googleapis.com' : ''}/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&dt=ex&dt=ld&dt=md&dt=qca&dt=rm&dt=ss`)
  url.searchParams.set("sl", inputLang)
  url.searchParams.set("tl", outputLang)
  url.searchParams.set("q", text)
  return url.toString()
}

export const translate = (text: string, outputLang: string, inputLang: string = 'auto') => {
  const url = getTranslateUrl(text, outputLang, inputLang, false)
  return apiEndpoint.get(url)
}
