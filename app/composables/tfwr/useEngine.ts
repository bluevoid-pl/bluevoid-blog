import { loadPyodide, type PyodideInterface } from 'pyodide'

/**
 * Boots Pyodide and loads the TFWR engine script exactly once, no matter how
 * many callers ask for it. Keeping the interpreter boot here means the page,
 * the map preview and anything else that wants the engine share one runtime.
 */
export function useEngine() {
  let pyodidePromise: Promise<PyodideInterface> | null = null
  let engineLoaded = false

  async function getEngine(): Promise<PyodideInterface> {
    pyodidePromise ??= loadPyodide()
    const pyodide = await pyodidePromise
    if (!engineLoaded) {
      const engineCode = await $fetch('/tfwr_api.py', { responseType: 'text' })
      pyodide.runPython(engineCode)
      engineLoaded = true
    }
    return pyodide
  }

  return { getEngine }
}
