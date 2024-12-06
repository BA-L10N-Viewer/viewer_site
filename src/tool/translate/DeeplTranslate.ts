import { getRandomInt, MersenneTwister } from '@/tool/Random'
import axios from 'axios'

const _countCharacter = (str: string, char: string): number => {
  // thanks chatgpt
  if (char.length !== 1) {
    throw new Error('Please provide a single character to count.')
  }

  let count = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      count++
    }
  }
  return count
}

const deeplX = {
  deeplAPI: 'https://www2.deepl.com/jsonrpc',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'x-app-os-name': 'iOS',
    'x-app-os-version': '16.3.0',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'x-app-device': 'iPhone13,2',
    'User-Agent': 'DeepL-iOS/2.9.1 iOS 16.3.0 (iPhone13,2)',
    'x-app-build': '510265',
    'x-app-version': '2.9.1',
    'Connection': 'keep-alive'
  },
  getICount: (text: string): number => {
    return _countCharacter(text, 'i')
  },
  getRandomNumber: () => {
    const num = getRandomInt(new MersenneTwister(), 8300000, 8399998)
    return num * 1000
  },
  getTimestamp: (iCount: number): number => {
    const ts = Date.now() // Current timestamp in milliseconds

    if (iCount === 0) {
      return ts
    }

    iCount += 1
    return ts - (ts % iCount) + iCount
  }
}

export const translate = async (text: string,
                                sourceLang: string = 'auto', targetLang = 'en',
                                numberAlternative: number = 0) => {
  const iCount = deeplX.getICount(text)
  const id = deeplX.getRandomNumber()

  const numberAlternative_ = Math.max(Math.min(3, numberAlternative), 0)

  const postData = {
    'jsonrpc': '2.0',
    'method': 'LMT_handle_texts',
    'id': id,
    'params': {
      'texts': [{ 'text': text, 'requestAlternatives': numberAlternative_ }],
      'splitting': 'newlines',
      'lang': {
        'source_lang_user_selected': sourceLang,
        'target_lang': targetLang
      },
      'timestamp': deeplX.getTimestamp(iCount),
      'commonJobParams': {
        'wasSpoken': false,
        'transcribe_as': ''
      }
    }
  }
  let postDataStr = JSON.stringify(postData)

  if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
    postDataStr = postDataStr.replaceAll('"method":"', '"method" : "')
  } else {
    postDataStr = postDataStr.replaceAll('"method":"', '"method": "')
  }

  try {
    const res = await axios.post(deeplX.deeplAPI, postDataStr, { 'headers': deeplX.headers })
    if (res.status !== 200) {
      return `Error [${res.status}]`
    } else {
      const respJson = JSON.parse(res.data)

      if (numberAlternative <= 1) {
        const targetText = respJson.result.texts[0].text
        return targetText
      }

      const targetTextArray = respJson.result.texts[0].alternatives.map((item: any) => item.text)
      return targetTextArray
    }
  } catch (e) {
    return `Error [${e}]`
  }
}