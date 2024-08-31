import { SITE_VERSION } from '@/tool/Constant'

const MAX_RETRY_DEPTH = 10


export function httpGetBlocking(url: string, depth: number = 0) {
  if (depth > MAX_RETRY_DEPTH) {
    return ""
  }

  const xhr = new XMLHttpRequest()
  xhr.open('GET', url + `?v=${SITE_VERSION}`, false) // false makes the request synchronous
  xhr.send(null)

  if (xhr.status === 200) {
    return xhr.responseText
  } else {
    return httpGetBlocking(url, depth + 1)
  }
}

export async function httpGetAsync(url: string, depth: number = 0) {
  if (depth > MAX_RETRY_DEPTH) {
    return ""
  }

  const res = await fetch(url + `?v=${SITE_VERSION}`)
  if (res.status === 200) {
    return await res.text()
  } else {
    return await httpGetAsync(url, depth + 1)
  }
}