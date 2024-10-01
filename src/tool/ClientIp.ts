import { ref } from 'vue'

export type MyipLaResponse = {
  ip: string;
  location: {
    city: string; country_code: string;
    latitude: string; longitude: string;
    province: string;
  }
}

export async function getIpDetail(depth: number,
                                  lang: string = 'en', dataType: string = 'json'): Promise<MyipLaResponse | string> {
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
    return await getIpDetail(depth + 1)
  }
}

export async function getIpCountryCode() {
  const data = await getIpDetail(0)
  if (typeof data !== 'string') {
    return data['location']['country_code']
  } else {
    return 'unknown'
  }
}

export const ipClientCountryAtInit = ref<string>('unknown')
export const updateIpAtInitValue = async () => {
  ipClientCountryAtInit.value = await getIpCountryCode()
}

await updateIpAtInitValue()
