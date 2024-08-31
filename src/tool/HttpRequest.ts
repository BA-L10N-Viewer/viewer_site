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