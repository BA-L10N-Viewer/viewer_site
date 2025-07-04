import { SchaleDbStuInfoFullVoicelineCategory } from '@/types/OutsourcedData'

export function findFirstAvailableTabName(
  dataVoiceAvailabilityList: boolean[],
  dataVoiceAvailabilityListName: SchaleDbStuInfoFullVoicelineCategory[]
) {
  for (let i = 0; i < 4; i++) {
    if (dataVoiceAvailabilityList[i]) return dataVoiceAvailabilityListName[i]
  }
  return 'Normal'
}
