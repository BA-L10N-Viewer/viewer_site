import { getNexonI18nDataDefault, NexonLangMap } from '@/tool/Constant'
import { useSetting } from '@/stores/setting'
import { getStaticCdnBasepath, httpGetAsync } from '@/tool/HttpRequest'
import type {
  I18nBondInfoData,
  I18nStoryInfoIdToXxhash,
  I18nStoryXxhashToL10nData, IndexScenarioInfoToI18nId,
  NexonL10nData,
  NexonL10nDataLang
} from '@/types/OutsourcedData'

export function checkDialogueSensei(text: string) {
  if (text === 'Answer') return true
  else return false
}

export function getClassDialogueSensei(text: string): string {
  if (checkDialogueSensei(text)) return 'momotalk-dialogue-sensei'
  else return ''
}

export function dialogueContentDecorator(dialogueType: string, dialogueContent: string) {
  if (dialogueType === 'Answer') {
    return dialogueContent + '&nbsp;&lt;'
  } else if (dialogueType === 'Feedback') {
    return '&gt;&nbsp;' + dialogueContent
  } else {
    return dialogueContent
  }
}

export function convertNewlineToBr(text: string): string {
  return text.replace(/\[\\n\]/g, '<br />')
}

export function getLangData(entry: NexonL10nData, key: NexonL10nDataLang): string {
  if (key in entry) return entry[key]
  else return ''
}

export function getLangCode(lang: string): string {
  const lang_ = lang
  if (!lang_) {
    return 'en'
  } else if (NexonLangMap[lang_]) {
    return NexonLangMap[lang_]
  } else return lang_
}

export function getLangDataFlattened(entry: NexonL10nData, langs: string[],
                                     splitter: string = ''): string {
  // 尽管这里说是 NexonL10nData 但实际上也可以是 SchaleDbL10nData
  type entryLangKeys = keyof NexonL10nData

  let temp = ''
  if (langs.length >= 1) {
    temp += entry[langs[0] as entryLangKeys]
  }
  if (langs.length > 1) {
    for (const lang of langs) {
      if (lang !== langs[0]) {
        temp += ` ${splitter} ${entry[lang as entryLangKeys] ? entry[lang as entryLangKeys] : ''}`
      }
    }
  }

  return temp
}

export function gotoStory(router: any, storyId: String | Number) {
  router.push({ name: 'scenario', params: { storyId: Number(storyId) } })
}

export function gotoMomotalkCharacter(router: any, charId: String | Number) {
  router.push({ name: 'momotalk', params: { charId: Number(charId) } })
}

export function replaceStoryLineUsernameBlank(text: String) {
  const setting = useSetting()
  const username = setting.username

  if (text === null || text === undefined) {
    return ''
  }
  return text.replaceAll('[USERNAME]', username)
}

export async function getScenarioI18nContent(scenarioId: Number) {
  const sId = String(scenarioId)
  const defaultData = [
    getNexonI18nDataDefault(`[NO DATA for ${scenarioId}'s Name]`),
    getNexonI18nDataDefault(`[NO DATA for ${scenarioId}'s Desc]`)
  ]

  if (sId.length === 7) {
    // bond
    const data: I18nBondInfoData = JSON.parse(await httpGetAsync('/data/story/i18n/i18n_bond.json'))
    const temp: NexonL10nData[] = data[sId]
    return temp ? temp : [defaultData, defaultData]
  } else {
    const i18nData: I18nStoryXxhashToL10nData = JSON.parse(await httpGetAsync('/data/story/i18n/i18n_story.json'))
    let data: IndexScenarioInfoToI18nId, data2: I18nStoryInfoIdToXxhash, i18nKey: string[] | number[]

    // main (side, main, short (700xxxxx))
    data = JSON.parse(await httpGetAsync('/data/common/index_scenario_i18n_main.json'))
    data2 = JSON.parse(await httpGetAsync('/data/story/i18n/i18n_main_index.json'))
    i18nKey = data[sId]
    if (i18nKey) {
      i18nKey = [data2[i18nKey[0]], data2[i18nKey[1]]]
      return [i18nData[i18nKey[0]], i18nData[i18nKey[1]]]
    }

    // event
    data = JSON.parse(await httpGetAsync('/data/common/index_scenario_i18n_event.json'))
    data2 = JSON.parse(await httpGetAsync('/data/story/i18n/i18n_event_index.json'))
    i18nKey = data[sId]
    if (i18nKey) {
      i18nKey = [data2[i18nKey[0]], data2[i18nKey[1]]]
      return [i18nData[i18nKey[0]], i18nData[i18nKey[1]]]
    }
  }

  return defaultData
}

export function getScenarioExtraDataById(scenarioId: number | string) {
  const temp = String(scenarioId)

  const isAfterBattle = temp.slice(-1) === '5'
  const actualScenarioNo = temp.length === 5 ? Number(temp.slice(2, 4)) : Number(temp.slice(3, 5))
  return { isAfterBattle: isAfterBattle, actualScenarioNo: actualScenarioNo }
}

export function checkIfScenarioIdIsMain(scnearioId: number | string) {
  const temp = String(scnearioId)

  // normal
  if (temp.length === 5) {return true}
  // vol.f
  else if (temp.startsWith("101") || temp.startsWith("102") || temp.startsWith("103") || temp.startsWith("104")) {return true}
  // it's not
  else return false
}

export function getScenarioCharacterSmallPortraitPath(path: string): string | null {
  const temp = path.split("/").slice(-1)[0]
  if (String(temp) === "null") {
    return null
  }

  return getStaticCdnBasepath('static') + "/ba/01_01_Character/" + path.split("/").slice(-1)[0] + ".png"
}

