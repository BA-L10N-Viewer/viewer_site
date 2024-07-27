import type { NexonI18nData } from '@/tool/Type'
import { getNexonI18nDataDefault, NexonLangMap } from '@/tool/Constant'
import { useSetting } from '@/stores/setting'
import { httpGetBlocking } from '@/tool/HttpRequest'

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

export function getLangData(entry: NexonI18nData, key: string): string {
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

export function getLangDataFlattened(entry: NexonI18nData, langs, splitter: string = ''): string {
  let temp = ''
  temp += entry[langs[0]] ? entry[langs[0]] : ''
  if (langs.length > 1) {
    for (const idx in langs) {
      let lang = ''

      if (typeof idx === 'number') {
        // 例如 i18nToUiLangAll 这种
        lang = langs[idx]
      } else {
        // 例如 i18nToUiLangAll 这种
        try {
          lang = langs[Number(idx)]
        } catch (e) {
          lang = idx
        }
      }

      if (lang !== langs[0]) {
        temp += ` ${splitter} ${entry[lang] ? entry[lang] : ''}`
      }
    }
  }

  return temp
}

export function gotoStory(router, storyId: String | Number) {
  router.push({ name: 'scenario', params: { storyId: Number(storyId) } })
}

export function gotoMomotalkCharacter(router, charId: String | Number) {
  router.push({ name: 'momotalk', params: { charId: Number(charId) } })
}

export function replaceStoryLineUsernameBlank(text: String) {
  const setting = useSetting()
  const username = setting.username

  if (text === null || text === undefined) {return ""}
  return text.replaceAll('[USERNAME]', username)
}

export function getScenarioI18nContent(scenarioId: Number) {
  const sId = String(scenarioId)
  const defaultData = [getNexonI18nDataDefault(`[NO DATA for ${scenarioId}'s Name]`),
    getNexonI18nDataDefault(`[NO DATA for ${scenarioId}'s Desc]`)]

  if (sId.length === 7) {
    // bond
    const data = JSON.parse(httpGetBlocking('/data/story/i18n/i18n_bond.json'))
    const temp: NexonI18nData[] = data[sId]
    return temp ? temp : [defaultData, defaultData]
  } else {
    const i18nData = JSON.parse(httpGetBlocking('/data/story/i18n/i18n_story.json'))
    let data, data2, i18nKey;

    // main (side, main, short (700xxxxx))
    data = JSON.parse(httpGetBlocking('/data/common/index_scenario_i18n_main.json'))
    data2 = JSON.parse(httpGetBlocking('/data/story/i18n/i18n_main_index.json'))
    i18nKey = data[scenarioId]
    if (i18nKey) {
      i18nKey = [data2[i18nKey[0]], data2[i18nKey[1]]]
      return [i18nData[i18nKey[0]], i18nData[i18nKey[1]]]
    }

    // event
    data = JSON.parse(httpGetBlocking('/data/common/index_scenario_i18n_event.json'))
    data2 = JSON.parse(httpGetBlocking('/data/story/i18n/i18n_event_index.json'))
    i18nKey = data[scenarioId]
    if (i18nKey) {
      i18nKey = [data2[i18nKey[0]], data2[i18nKey[1]]]
      return [i18nData[i18nKey[0]], i18nData[i18nKey[1]]]
    }
  }

  return [defaultData, defaultData]
}

