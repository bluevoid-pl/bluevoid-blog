/**
 * Turns a Pyodide `PythonError` (whose message holds a full Python traceback)
 * into something a console pane or an assertion can show on one line.
 */

export interface PythonErrorDescription {
  /** Exception type name, e.g. `ValueError`. Null when no Python exception was found. */
  type: string | null
  /** One line summary, e.g. `ValueError: Unknown item "gold" in prefill comment`. */
  summary: string
  /** Deepest traceback frame, e.g. `<string>, line 3, in <module>`. Null when absent. */
  frame: string | null
  /** The full original text, for panes that want to show everything. */
  detail: string
}

const TRACEBACK_HEADER = /Traceback \(most recent call last\):/
const FRAME_LINE = /^\s+File "([^"]*)", line (\d+), in (.+)$/
const EXCEPTION_LINE = /^([A-Za-z_][A-Za-z_0-9]*(?:\.[A-Za-z_0-9]*)*)(?::\s?(.*))?$/

function exceptionIn(line: string): { type: string, detail: string } | null {
  const match = EXCEPTION_LINE.exec(line)
  if (!match) return null
  return { type: match[1], detail: match[2] ?? '' }
}

function frameAbove(lines: string[], index: number): string | null {
  for (let i = index - 1; i >= 0; i -= 1) {
    const frame = FRAME_LINE.exec(lines[i])
    if (frame) return `${frame[1]}, line ${frame[2]}, in ${frame[3]}`
  }
  return null
}

function trimDetail(text: string): string {
  return text.trim()
}

function firstLine(lines: string[]): string {
  return lines.find(line => line.trim() !== '')?.trim() ?? ''
}

export function describePythonError(error: unknown): PythonErrorDescription {
  const raw = error instanceof Error ? error.message ?? '' : String(error)
  const lines = raw.split('\n')

  if (!TRACEBACK_HEADER.test(raw)) {
    return { type: null, summary: firstLine(lines), frame: null, detail: trimDetail(raw) }
  }

  // The last line of a traceback is the exception; walk backwards past the
  // caret markers and echoed source lines that Python 3.11+ can interleave.
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i]
    if (line.trim() === '' || /^\s/.test(line) || FRAME_LINE.test(line)) continue
    const found = exceptionIn(line.trim())
    if (!found) continue
    return {
      type: found.type,
      summary: found.detail ? `${found.type}: ${found.detail}` : found.type,
      frame: frameAbove(lines, i),
      detail: trimDetail(raw),
    }
  }

  return { type: null, summary: firstLine(lines), frame: null, detail: trimDetail(raw) }
}
