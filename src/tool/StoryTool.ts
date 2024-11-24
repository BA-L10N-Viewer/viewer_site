import { getNexonI18nDataDefault } from '@/tool/Constant'
import { useSetting } from '@/stores/setting'
import { getStaticCdnBasepath } from '@/tool/HttpRequest'
import type {
  I18nBondInfoData,
  I18nStoryInfoIdToXxhash,
  I18nStoryXxhashToL10nData, IndexScenarioInfoToI18nId,
  NexonL10nData
} from '@/types/OutsourcedData'
import type { Nullable } from '@/types/CommonType'
import {
  DirectoryDataCommonFileIndexScenarioI18nEvent,
  DirectoryDataCommonFileIndexScenarioI18nMain,
  DirectoryDataStoryI18nFileI18nBond, DirectoryDataStoryI18nFileI18nEventIndex,
  DirectoryDataStoryI18nFileI18nMainIndex, DirectoryDataStoryI18nFileI18nStory
} from '@/tool/PreFetchedData'

export function checkDialogueSensei(text: string) {
  if (text === 'Answer') return true
  else return false
}

export function getClassDialogueSensei(text: string): string {
  if (checkDialogueSensei(text)) return 'momotalk-dialogue-sensei'
  else return ''
}

export function mmtMessageContentDecorator(dialogueType: string, dialogueContent: string) {
  if (dialogueType === 'Answer') {
    return dialogueContent + '&nbsp;&lt;'
  } else if (dialogueType === 'Feedback') {
    return '&gt;&nbsp;' + dialogueContent
  } else {
    return dialogueContent
  }
}

export function convertNewlineToBr(text: string | Nullable): string {
  if (text)
    return text.replace(/\[\\n\]/g, '<br />')
  else
    return ''
}

export function convertImgToImg(text: string | Nullable) {
  if (text)
    return text.replace(
      /\[img:\s*UIs\/03_Scenario\/04_ScenarioImage\/([^\s\]]+)\s*\]/g,
      (match, p1) => {
        const processedValue = p1.toLowerCase()
        return `<img class="momotalk-dialogue-img" src="${getStaticCdnBasepath('static')}/ba/04_04_ScenarioImage/${processedValue}.png" />`
      }
    );
  else
    return ''
}

export function convertMmtMsgToHtml(text: string | Nullable) {
  return convertImgToImg(convertNewlineToBr(text))
}

// 等下，泛型还能这么写？？？？
export function getNexonL10nData<TypeKey extends string = string, TypeValue extends unknown = string>(entry: Record<TypeKey, TypeValue>, key: TypeKey): TypeValue {
  if (key in entry)
    return entry[key]
  else
    // I approved this and if anything goes wrong I'll handle it
    return '' as TypeValue
}

export function getNexonL10nDataFlattened(entry: NexonL10nData, langs: string[],
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
    const data: I18nBondInfoData = DirectoryDataStoryI18nFileI18nBond.value
    const temp: NexonL10nData[] = data[sId]
    return temp ? temp : [defaultData, defaultData]
  } else {
    const i18nData: I18nStoryXxhashToL10nData = DirectoryDataStoryI18nFileI18nStory.value
    let data: IndexScenarioInfoToI18nId, data2: I18nStoryInfoIdToXxhash, i18nKey: string[] | number[]

    // main (side, main, short (700xxxxx))
    data = DirectoryDataCommonFileIndexScenarioI18nMain.value
    data2 = DirectoryDataStoryI18nFileI18nMainIndex.value
    i18nKey = data[sId]
    if (i18nKey) {
      i18nKey = [data2[i18nKey[0]], data2[i18nKey[1]]]
      return [i18nData[i18nKey[0]], i18nData[i18nKey[1]]]
    }

    // event
    data = DirectoryDataCommonFileIndexScenarioI18nEvent.value //JSON.parse(await httpGetAsync('/data/common/index_scenario_i18n_event.json'))
    data2 = DirectoryDataStoryI18nFileI18nEventIndex.value //JSON.parse(await httpGetAsync('/data/story/i18n/i18n_event_index.json'))
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
  // 逆天nx代码，人物头像数据里写的与实际不符，统一为全部小写
  const temp = path.split("/").slice(-1)[0].toLowerCase()
  if (String(temp) === "null") {
    return null
  }

  return getStaticCdnBasepath('static') + "/ba/01_01_Character/" + temp + ".png"
}
