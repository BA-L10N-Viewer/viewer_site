// By ChatGPT
export function createDictionaryWithDefault<K extends string, V>(keys: K[], defaultValue: V): Record<K, V> {
  const dictionary: Record<K, V> = {} as Record<K, V>
  for (const key of keys) {
    dictionary[key] = defaultValue
  }
  return dictionary
}

export function formatDate(date: Date, timezone: 'local' | 'utc'): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = timezone === 'utc' ? date.getUTCFullYear() : date.getFullYear();
  const month = pad((timezone === 'utc' ? date.getUTCMonth() : date.getMonth()) + 1); // Months are 0-based
  const day = pad(timezone === 'utc' ? date.getUTCDate() : date.getDate());
  const hours = pad(timezone === 'utc' ? date.getUTCHours() : date.getHours());
  const minutes = pad(timezone === 'utc' ? date.getUTCMinutes() : date.getMinutes());
  const seconds = pad(timezone === 'utc' ? date.getUTCSeconds() : date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}