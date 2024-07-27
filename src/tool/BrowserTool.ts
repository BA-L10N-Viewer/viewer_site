export function getUserLang() {
  return navigator.language;
}

export function convertLangToNormal(lang: string): string {
  if (lang.startsWith("en")) return "en"
  else if (lang === "zh-HK") return "zh_TW"
  else if (lang === "zh-CN") return "zh_CN"
  else return lang
}