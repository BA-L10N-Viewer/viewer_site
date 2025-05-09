import { SITE_VERSION } from '@/tool/Constant'

export const MAX_RETRY_DEPTH = 10

export function httpGetSync(url: string, depth: number = 0) {
  if (depth > MAX_RETRY_DEPTH) {
    return ''
  }
  try {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url + `?v=${SITE_VERSION}`, false)
    xhr.send(null)

    if (xhr.status === 200) {
      return xhr.responseText
    } else {
      return httpGetSync(url, depth + 1)
    }
  } catch (e) {
    console.error(`httpGetBlocking(${url}, ${depth}): ${e}`)
    return httpGetSync(url, depth + 1)
  }
}

export async function httpGetAsync(url: string, depth: number = 0) {
  if (depth > MAX_RETRY_DEPTH) {
    return ''
  }

  try {
    const res = await fetch(url + `?v=${SITE_VERSION}`)
    if (res.status === 200) {
      return await res.text()
    } else {
      return await httpGetAsync(url, depth + 1)
    }
  } catch (e) {
    console.error(`httpGetAsync(${url}, ${depth}): ${e}`)
    return await httpGetAsync(url, depth + 1)
  }
}

const staticCdnBasepath = {
  schaledb: {
    'no-aws': 'https://schaledb.com',
    aws: 'https://schaledb-aws.cnfast.top'
  },
  static: {
    'no-aws': 'https://ba-l10n-r2.cnfast.top',
    aws: 'https://ba-l10n-r2-aws.cnfast.top'
  },
  ghapi: {
    'no-aws': 'https://api.github.com',
    aws: 'https://gapi-aws.cnfast.top'
  }
}
export function getStaticCdnBasepath(type: 'schaledb' | 'static' | 'ghapi') {
  const currHost = window.location.host
  const currCdn = currHost === 'ba-l10n-aws.cnfast.top' ? 'aws' : 'no-aws'

  return staticCdnBasepath[type][currCdn]
}

export async function httpGetJsonAsync(var_: any, url: string) {
  const data = JSON.parse(await httpGetAsync(url))
  if (Array.isArray(var_)) {
    var_.splice(0, var_.length, ...data)
  } else {
    Object.assign(var_, data)
  }
}
