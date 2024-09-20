import { SITE_VERSION } from '@/tool/Constant'

const MAX_RETRY_DEPTH = 10


export function httpGetBlocking(url: string, depth: number = 0) {
  if (depth > MAX_RETRY_DEPTH) {
    return ""
  }
  try {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url + `?v=${SITE_VERSION}`, false)
    xhr.send(null)

    if (xhr.status === 200) {
      return xhr.responseText
    } else {
      return httpGetBlocking(url, depth + 1)
    }
  }
  catch (e) {
    console.error(`httpGetBlocking(${url}, ${depth}): ${e}`)
    return httpGetBlocking(url, depth + 1)
  }
}

export async function httpGetAsync(url: string, depth: number = 0) {
  if (depth > MAX_RETRY_DEPTH) {
    return ""
  }

  try {
    const res = await fetch(url + `?v=${SITE_VERSION}`)
    if (res.status === 200) {
      return await res.text()
    } else {
      return await httpGetAsync(url, depth + 1)
    }
  }
  catch (e) {
    console.error(`httpGetAsync(${url}, ${depth}): ${e}`)
    return await httpGetAsync(url, depth + 1)
  }
}

const staticCdnBasepath = {
  "schaledb": {
    "no-aws": "https://schaledb.com",
    "aws": "https://schaledb-aws.cnfast.top"
  },
  "static": {
    "no-aws": "https://viewer-static.pages.dev",
    "aws": "https://ba-l10n-static.cnfast.top"
  }
}
export function getStaticCdnBasepath(type: "schaledb" | "static") {
  const currHost = window.location.host
  const currCdn = currHost === 'ba-l10n-aws.cnfast.top' ? "aws" : "no-aws"

  return staticCdnBasepath[type][currCdn]
}