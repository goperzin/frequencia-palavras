export interface WordEntry {
  word: string
  count: number
}

export function analyzeFrequency(text: string): WordEntry[] {
  const normalized = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')

  const tokens = normalized.split(/\s+/).filter((t) => t.length > 0)

  const counts = tokens.reduce<Map<string, number>>((map, token) => {
    map.set(token, (map.get(token) ?? 0) + 1)
    return map
  }, new Map())

  return Array.from(counts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
}
