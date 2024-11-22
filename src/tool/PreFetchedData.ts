import {
  type I18nStoryXxhashToL10nData,
  type IndexScenarioCharacterData,
  type RelatedScenarioParentInfoData,
  type StudentInfoDataSimple,
  type RelatedScenarioInfoData,
  type I18nBondInfoData,
  type I18nStoryInfoIdToXxhash,
  type IndexManifestScenarioData,
  type IndexManifestScenarioEntry,
  type IndexMomotalkData,
  type IndexScenarioInfoToI18nId,
} from "@/types/OutsourcedData"
import { ref, shallowRef } from "vue"
import { httpGetAsync, httpGetJsonAsync } from "./HttpRequest"
import { AsyncTaskPool } from "./AsyncTaskPool"

export const isFetching = ref(true)

export const DirectoryDataStoryI18nFileI18nStory = shallowRef<I18nStoryXxhashToL10nData>({} as unknown as I18nStoryXxhashToL10nData)
export const DirectoryDataStoryI18nFileI18nEventIndex = shallowRef<I18nStoryInfoIdToXxhash>({} as unknown as I18nStoryInfoIdToXxhash)
export const DirectoryDataStoryI18nFileI18nBond = shallowRef<I18nBondInfoData>({} as unknown as I18nBondInfoData)
export const DirectoryDataStoryI18nFileI18nEventInde = shallowRef<I18nStoryInfoIdToXxhash>({} as unknown as I18nStoryInfoIdToXxhash)
export const DirectoryDataStoryI18nFileI18nMainIndex = shallowRef<I18nStoryInfoIdToXxhash>({} as unknown as I18nStoryInfoIdToXxhash)

export const DirectoryDataCommonFileIndexMomo = shallowRef<IndexMomotalkData>({} as unknown as IndexMomotalkData)
export const DirectoryDataCommonFileIndexMomoL2d = shallowRef<Record<string, number>>({} as unknown as Record<string, number>)
export const DirectoryDataCommonFileIndexStu = shallowRef<StudentInfoDataSimple>({} as unknown as StudentInfoDataSimple)
export const DirectoryDataCommonFileIndexScenarioManifestEvent = shallowRef<IndexManifestScenarioEntry[]>([] as unknown as IndexManifestScenarioEntry[])
export const DirectoryDataCommonFileIndexScenarioI18nEvent = shallowRef<IndexScenarioInfoToI18nId>({} as unknown as IndexScenarioInfoToI18nId)
export const DirectoryDataCommonFileIndexScenarioManifestMain = shallowRef<IndexManifestScenarioData>({} as unknown as IndexManifestScenarioData)
export const DirectoryDataCommonFileIndexScenarioI18nMain = shallowRef<IndexScenarioInfoToI18nId>({} as unknown as IndexScenarioInfoToI18nId)
export const DirectoryDataCommonFileIndexScenarioChar = shallowRef<IndexScenarioCharacterData>({} as unknown as IndexScenarioCharacterData)
export const DirectoryDataCommonFileIndexRelatedManifestParent = shallowRef<RelatedScenarioParentInfoData>({} as unknown as RelatedScenarioParentInfoData)
export const DirectoryDataCommonFileIndexRelatedManifestScenario = shallowRef<RelatedScenarioInfoData>({} as unknown as RelatedScenarioInfoData)

export async function fetchData() {
  isFetching.value = true
  const asyncPool = new AsyncTaskPool(6)
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataStoryI18nFileI18nStory.value, `/data/story/i18n/i18n_story.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataStoryI18nFileI18nEventIndex.value, `/data/story/i18n/i18n_event_index.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataStoryI18nFileI18nBond.value, `/data/story/i18n/i18n_bond.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataStoryI18nFileI18nMainIndex.value, `/data/story/i18n/i18n_main_index.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexMomo.value, `/data/common/index_momo.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexMomoL2d.value, `/data/common/index_momo_l2d.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexStu.value, `/data/common/index_stu.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexScenarioManifestEvent.value, `/data/common/index_scenario_manifest_event.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexScenarioI18nEvent.value, `/data/common/index_scenario_i18n_event.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexScenarioManifestMain.value, `/data/common/index_scenario_manifest_main.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexScenarioI18nMain.value, `/data/common/index_scenario_i18n_main.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexScenarioChar.value, `/data/common/index_scenario_char.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexRelatedManifestParent.value, `/data/common/index_related_manifest_parent.json`)})
  asyncPool.addTask(async () => {await httpGetJsonAsync(DirectoryDataCommonFileIndexRelatedManifestScenario.value, `/data/common/index_related_manifest_scenario.json`)})
  await asyncPool.runAll()
  isFetching.value = false
}