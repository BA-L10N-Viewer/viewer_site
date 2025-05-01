import { GoogleTranslateInstance } from '@/tool/translate/GoogleTranslate'
import type { Nullable } from '@/types/CommonType'

export type MtServiceName = 'google'

export async function getTranslation(
  mtServiceName: MtServiceName,
  inputText: string | Nullable,
  outputLang: string,
  inputLang: string = 'auto'
) {
  if (mtServiceName === 'google') {
    const resp = await GoogleTranslateInstance.translate(inputText, outputLang, inputLang)
    return GoogleTranslateInstance.concatTranslation(resp)
  } else throw new Error('Invalid service name')
}

export async function getDialogueMtTranslation(
  mtServiceName: MtServiceName,
  oriNameText: string | Nullable,
  oriNicknameText: string | Nullable,
  oriDialogueText: string | Nullable,
  outputLang: string = 'auto'
) {
  let textName: string, textNickname: string, textDialogue: string

  if (oriNameText) {
    textName = await getTranslation(mtServiceName, oriNameText, outputLang)
  } else {
    textName = ''
  }
  if (oriNicknameText) {
    textNickname = await getTranslation(mtServiceName, oriNicknameText, outputLang)
  } else {
    textNickname = ''
  }
  if (oriDialogueText) {
    textDialogue = await getTranslation(mtServiceName, oriDialogueText, outputLang)
  } else {
    textDialogue = ''
  }

  return { name: textName, nickname: textNickname, dialogue: textDialogue }
}
