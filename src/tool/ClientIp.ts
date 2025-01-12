import { MAX_RETRY_DEPTH } from '@/tool/HttpRequest'

export type MyipLaResponse = {
  ip: string;
  location: {
    city: string; country_code: string;
    latitude: string; longitude: string;
    province: string;
  }
}
export const MyipLaResponseBlank = {
  ip: '1.1.1.1',
  location: {
    city: 'unknown', country_code: 'unknown',
    latitude: '0.0', longitude: '0.0',
    province: 'unknown'
  }
}

export async function getIpDetail(lang: string = 'en', dataType: string = 'json',
                                  depth: number = 0): Promise<MyipLaResponse | string> {
  if (depth > MAX_RETRY_DEPTH)
    return MyipLaResponseBlank

  const url = `https://api.myip.la/${lang}?${dataType}`
  try {
    const res = await fetch(url)
    const dataRaw = await res.text()

    try {
      return JSON.parse(dataRaw) as MyipLaResponse
    } catch (e) {
      return dataRaw
    }
  } catch (e) {
    return await getIpDetail(lang, dataType, depth + 1)
  }
}

export function getIpDetailSync(lang: string = 'en', dataType: string = 'json',
                                depth: number = 0): MyipLaResponse | string {
  if (depth > MAX_RETRY_DEPTH)
    return MyipLaResponseBlank

  const url = `https://api.myip.la/${lang}?${dataType}`

  try {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.send(null)

    if (xhr.status === 200) {
      try {
        return JSON.parse(xhr.responseText) as MyipLaResponse
      } catch (e) {
        return xhr.responseText
      }
    } else {
      return getIpDetailSync(lang, dataType, depth + 1)
    }
  } catch (e) {
    return getIpDetailSync(lang, dataType, depth + 1)
  }
}

export async function getIpCountryCode() {
  const data = await getIpDetail()
  if (typeof data !== 'string') {
    return data['location']['country_code']
  } else {
    return 'unknown'
  }
}

export function getIpCountryCodeSync() {
  if (document.location.hostname === 'ba-l10n-aws.cnfast.top') {
    return 'CN'
  }

  const data = getIpDetailSync()
  if (typeof data !== 'string') {
    return data['location']['country_code']
  } else {
    return 'unknown'
  }
}
