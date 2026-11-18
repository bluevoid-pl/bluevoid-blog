/**
 * Shared bridge between TypeScript and the TFWR engine running in Pyodide.
 * Both the simulation page and the node test harness build a runner with
 * `createTfwrRunner`, so tests exercise exactly the pipeline the page uses.
 */
import type { PyodideInterface } from 'pyodide'
import { describePythonError, type PythonErrorDescription } from './python-error.ts'
import { parseScriptPrefill, type PrefillItems, type PrefillResult } from './tfwr-prefill.ts'

export interface TfwrCell {
  ground: string | null
  entity: string | null
  water_level: number
  fertiliser_level: number
  growth: number
}

export interface TfwrState {
  ticks: number
  posX: number
  posY: number
  boardSize: number
  board: TfwrCell[][]
  inventory: PrefillItems
  animations: string[]
}

/** One journal record: state after a single top-level statement ran. */
export interface TfwrStep {
  index: number
  code: string
  ticks: number
  x: number
  y: number
  cell: TfwrCell
  inventory: PrefillItems
  error: string | null
}

export type TfwrRunStatus = 'ok' | 'error' | 'prefill-error'

export interface TfwrRun {
  status: TfwrRunStatus
  prefill: PrefillResult
  /** Everything the script printed. */
  output: string
  /** Set when the script raised a Python error or the prefill JSON was invalid. */
  error: PythonErrorDescription | null
  /** State after the run. Null only when the engine never got that far. */
  state: TfwrState | null
  /** Per-statement journal from a stepped run. Empty for plain runs. */
  steps: TfwrStep[]
}

export type EngineLoader = () => Promise<PyodideInterface>

const PREPARE_CODE = '__reset__()\n__set_prefill_items__(json.loads(__tfwr_prefill))'

function stateFrom(raw: unknown): TfwrState {
  return raw as TfwrState
}

export function createTfwrRunner(loadEngine: EngineLoader) {
  function readState(pyodide: PyodideInterface): TfwrState | null {
    // Reading state costs no ticks, so it is safe even after an error left the
    // engine mid-run; but the engine itself may be unusable, so guard anyway.
    try {
      return stateFrom(JSON.parse(pyodide.runPython('__state_json__()') as string))
    }
    catch {
      return null
    }
  }

  async function execute(source: string, stepped: boolean): Promise<TfwrRun> {
    const prefill = parseScriptPrefill(source)
    const result: TfwrRun = { status: 'ok', prefill, output: '', error: null, state: null, steps: [] }
    if (prefill.status === 'error') {
      result.status = 'prefill-error'
      return result
    }

    const pyodide = await loadEngine()
    pyodide.setStdout({ batched: (line: string) => { result.output += `${line}\n` } })
    pyodide.globals.set('__tfwr_source', source)
    pyodide.globals.set('__tfwr_prefill', JSON.stringify(prefill.items))

    const code = stepped
      ? `${PREPARE_CODE}\n__run_stepped__(__tfwr_source)`
      : `${PREPARE_CODE}\nexec(compile(__tfwr_source, '<tfwr>', 'exec'), globals())`
    try {
      const raw = await pyodide.runPythonAsync(code)
      if (stepped) {
        // The journal payload carries the final state next to the journal, so
        // one round trip gives the UI both the steps and where the run ended.
        const { journal, error, ...state } = JSON.parse(raw as string) as { journal: TfwrStep[], error: string | null } & TfwrState
        result.steps = journal
        if (error) result.error = describePythonError(error)
        result.state = stateFrom(state)
      }
      else {
        result.state = readState(pyodide)
      }
    }
    catch (error) {
      result.error = describePythonError(error)
      result.state = readState(pyodide)
    }
    if (result.error) result.status = 'error'
    return result
  }

  return {
    /** Run the whole script in one go, like a real interpreter would. */
    run: (source: string) => execute(source, false),
    /** Run statement by statement and journal every state transition. */
    runStepped: (source: string) => execute(source, true),
    /**
     * Every item the game knows about, including ones the drone is not
     * carrying. Loading the engine defines them, so this needs no run.
     */
    getItems: async (): Promise<string[]> => {
      const pyodide = await loadEngine()
      const names = pyodide.globals.get('__item_names__')
      if (names === undefined) return []
      try {
        // toJs turns the Python list into a plain string array we can own.
        return names.toJs() as string[]
      }
      finally {
        names.destroy()
      }
    },
  }
}
