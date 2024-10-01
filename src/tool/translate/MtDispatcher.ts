import { GoogleTranslateInstance } from '@/tool/translate/GoogleTranslate'

export type MtServiceName = 'google'

export async function getTranslation(mtServiceName: MtServiceName,
                                     inputText: string, outputLang: string, inputLang: string = 'auto') {
  if (mtServiceName === 'google') {
    const resp = await GoogleTranslateInstance.translate(inputText, outputLang, inputLang)
    return GoogleTranslateInstance.concatTranslation(resp)
  } else
    throw new Error('Invalid service name')
}

export async function getDialogueMtTranslation(mtServiceName: MtServiceName,
                                               oriNameText: string, oriDialogueText: string, outputLang: string ='auto') {
  let textName: string, textDialogue: string

  if (oriNameText) textName = await getTranslation(mtServiceName, oriNameText, outputLang)
  else textName = ''
  if (oriDialogueText) textDialogue = await getTranslation(mtServiceName, oriDialogueText, outputLang)
  else textDialogue = ''

  return { name: textName, dialogue: textDialogue }
}
