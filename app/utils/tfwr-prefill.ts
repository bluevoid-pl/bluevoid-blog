export type PrefillItems = Record<string, number>

export interface PrefillResult {
  status: 'none' | 'ok' | 'error'
  items: PrefillItems
  message?: string
}

const HASH = 35 // '#'

/**
 * Find the index of the first comment character (#) that is not inside a
 * string literal, scanning the script outside of quotes.
 */
function findFirstComment(source: string): number {
  let quote: string | null = null
  let triple = ''
  let escaped = false

  for (let i = 0; i < source.length; i++) {
    const ch = source[i]

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }
      if (ch === '\\') {
        escaped = true
        continue
      }
      if (triple) {
        if (source.startsWith(triple, i)) {
          i += 2
          quote = null
          triple = ''
        }
        continue
      }
      if (ch === quote) {
        quote = null
      }
      continue
    }

    // Reached only outside string literals: # inside them never gets here
    if (ch === '#') return i

    if (ch === '\'' || ch === '"') {
      if (source.startsWith(ch.repeat(3), i)) {
        triple = ch.repeat(3)
        quote = ch
        i += 2
      }
      else {
        quote = ch
      }
    }
  }

  return -1
}

/**
 * Collect the comment lines of the first comment block: consecutive lines
 * starting from the first comment character. Returns successive prefixes of
 * the block so each can be attempted as JSON.
 */
function firstCommentLines(source: string, start: number): string[] {
  const lines: string[] = []
  let pos = start
  while (pos < source.length) {
    const lineEnd = source.indexOf('\n', pos)
    const line = lineEnd === -1 ? source.slice(pos) : source.slice(pos, lineEnd)
    if (!line.trimStart().startsWith('#') && !line.trim().length) {
      break
    }
    if (!line.trimStart().startsWith('#')) {
      break
    }
    lines.push(line.slice(line.indexOf('#') + 1))
    if (lineEnd === -1) break
    pos = lineEnd + 1
  }
  return lines
}

function isPlainObject(value: unknown): value is PrefillItems {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validate(items: PrefillItems): string | undefined {
  for (const [key, amount] of Object.entries(items)) {
    if (!key.length) {
      return 'Item name must not be empty'
    }
    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < 0) {
      return `Amount for "${key}" must be a non-negative integer`
    }
  }
  return undefined
}

/**
 * Parse the first (and only the first) comment of a script as a JSON object
 * of prefill items: { item: amount }. The comment may be single-line
 * (# {"wood": 100}) or a multiline block where every line starts with #.
 * Prefilling the simulation inventory is not part of the game: it costs no
 * ticks. The comment may appear anywhere in the file, including after code.
 */
export function parseScriptPrefill(source: string): PrefillResult {
  const start = findFirstComment(source)
  if (start === -1) {
    return { status: 'none', items: {} }
  }

  const lines = firstCommentLines(source, start)
  let jsonError = ''
  for (let count = 1; count <= lines.length; count++) {
    const candidate = lines.slice(0, count).join('\n').trim()
    if (!candidate.startsWith('{')) continue
    try {
      const parsed = JSON.parse(candidate) as unknown
      if (!isPlainObject(parsed)) {
        jsonError = 'Item prefills must be a JSON object'
        continue
      }
      const message = validate(parsed)
      if (message) {
        return { status: 'error', items: {}, message }
      }
      return { status: 'ok', items: parsed }
    }
    catch (err) {
      jsonError = err instanceof Error ? err.message : 'Invalid JSON'
    }
  }

  if (jsonError) {
    return { status: 'error', items: {}, message: `Could not read items from first comment: ${jsonError}` }
  }
  return { status: 'none', items: {} }
}
