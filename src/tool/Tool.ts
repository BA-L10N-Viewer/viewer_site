// By ChatGPT
export function createDictionaryWithDefault<K extends string, V>(keys: K[], defaultValue: V): Record<K, V> {
  const dictionary: Record<K, V> = {} as Record<K, V>
  for (const key of keys) {
    dictionary[key] = defaultValue
  }
  return dictionary
}