import type { NexonL10nData, NexonL10nDataLang } from "@/types/OutsourcedData"
import { getNexonL10nData } from "./StoryTool"
import { useI18n } from "vue-i18n"

export type AppPageCategory = 'home' | 'faq' | 'about' | 'scenario' | 'momotalk' | 'voice' | 'char' | 'whybalv'

export const AppPageCategory = ['home', 'faq', 'about', 'scenario', 'momotalk', 'voice', 'char', 'whybalv']

export const AppPageCategoryToI18nCode: Record<AppPageCategory, string> = {
    'home': 'app-title-full-home',
    'faq': 'app-title',
    'about': '',
    'scenario': '',
    'momotalk': '',
    'voice': '',
    'char': '',
    'whybalv': ''
}

export function getAppPageTitle(
    data: NexonL10nData,
    langs: NexonL10nDataLang[]) {
        const result = []
        for (const lang of langs){
            const temp = getNexonL10nData(data, lang)
            if (temp && temp !== 'null')
                result.push(temp)
        }
        return result.join("/")
}

export function changeAppPageTitle(
    pageCategory: AppPageCategory,
    data: NexonL10nData = {} as NexonL10nData,
    langs: NexonL10nDataLang[]) {
        const i18n = useI18n()
        const title1 = i18n.t(AppPageCategoryToI18nCode[pageCategory])
        const title2 = getAppPageTitle(data, langs)
        const title = `${title1}${title2} - BA L10N Viewer`
        document.title = title
}