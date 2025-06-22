import type { NexonL10nData, SchaleDbL10nData } from '@/types/OutsourcedData'
import { getNexonL10nData } from './StoryTool'

export type AppPageCategory =
  | 'home'
  | 'faq'
  | 'about'
  | 'scenario'
  | 'momotalk'
  | 'voice'
  | 'profile'
  | 'whybalv'
  | 'search_advanced'
  | 'search_char'
  | 'misakiii'

export const AppPageCategory = [
  'home',
  'faq',
  'about',
  'scenario',
  'momotalk',
  'voice',
  'profile',
  'whybalv',
  'search_advanced',
  'search_char',
  'misakiii'
]

export const AppPageCategoryToI18nCode: Record<AppPageCategory, string> = {
  home: 'app-title-full-home',
  faq: 'app-title-full-faq',
  about: 'app-title-full-about',
  scenario: 'app-title-prefix-scenario',
  momotalk: 'app-title-prefix-momotalk',
  voice: 'app-title-prefix-voice',
  profile: 'app-title-prefix-profile',
  whybalv: 'app-title-full-whybalv',
  search_advanced: 'app-title-full-search-advanced',
  search_char: 'app-title-full-search-char',
  misakiii: 'app-title-full-misakiii'
}

export function getAppPageTitle<T extends NexonL10nData | SchaleDbL10nData>(
  prefix: string,
  data: T,
  langs: (keyof T)[]
) {
  const result = []
  for (const lang of langs) {
    const temp = getNexonL10nData(data, lang as string)
    if (temp && temp !== 'null') result.push(temp)
  }

  let temp = `${prefix}`
  if (result.length !== 0) temp += result.join('/')

  return temp
}

export function changeAppPageTitle<T extends NexonL10nData | SchaleDbL10nData>(
  prefix: string,
  data: T = {} as T,
  langs: (keyof T)[] = []
) {
  document.title = `${getAppPageTitle(prefix, data, langs)} - BA L10N Viewer`
}
