/* 根据语言字符集的信息密度自动调整单个字符串的有效数量 */
export function countSingleCharNumberBiased(char: string): number {
  if (char.length !== 1) {
    throw new RangeError('Must provide only one character every time.')
  }

  const code = char.codePointAt(0)!

  // English (ASCII)
  if (code >= 0 && code <= 127) {
    return 1
  }
  // Korean (Hangul)
  else if (code >= 0xac00 && code <= 0xd7af) {
    return 2
  }
  // Thai
  else if (code >= 0x0e00 && code <= 0x0e7f) {
    return 1
  }
  // Japanese (excluding Kanji)
  else if ((code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff)) {
    return 2
  } else {
    return 2
  }
}

export function countCharacterLengthBiased(str: string): number {
  let total = 0
  for (const char of str) {
    total += countSingleCharNumberBiased(char)
  }
  return total
}

export function preProcessStringForSearch(str: string): string {
  let newStr = str

  // no space
  newStr = newStr.replaceAll(' ', '')

  // 统一括号
  newStr = newStr.replaceAll('（', '(').replaceAll('）', ')')

  // 全部小写
  newStr = newStr.toLowerCase()

  return newStr
}
