/**
 * Loads Pyodide and the TFWR engine once per test file and reuses them across
 * tests, so the suite does not pay the interpreter boot cost per case. Each
 * run starts from a clean engine through `__reset__`, which the shared runner
 * already does.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { loadPyodide, type PyodideInterface } from 'pyodide'
import { createTfwrRunner } from '../../app/utils/tfwr-runner.ts'

const enginePath = fileURLToPath(new URL('../../public/tfwr_api.py', import.meta.url))

let pyodidePromise: Promise<PyodideInterface> | null = null
let engineLoaded = false

export async function getPyodide(): Promise<PyodideInterface> {
  pyodidePromise ??= loadPyodide()
  const pyodide = await pyodidePromise
  if (!engineLoaded) {
    pyodide.runPython(readFileSync(enginePath, 'utf8'))
    engineLoaded = true
  }
  return pyodide
}

/** A runner wired to the shared engine, mirroring what the page builds. */
export function createTestRunner() {
  return createTfwrRunner(getPyodide)
}
