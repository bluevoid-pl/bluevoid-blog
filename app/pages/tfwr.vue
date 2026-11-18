<script setup lang="ts">
import { loadPyodide, type PyodideInterface } from 'pyodide'
import { onMounted, onScopeDispose, ref } from 'vue'
import { IconPinnedOff, IconX } from '@tabler/icons-vue'
import Editor from '~/components/tfwr/Editor.vue'
import Output from '~/components/tfwr/Output.vue'
import Map from '~/components/tfwr/Map.vue'
import ScriptTabs from '~/components/tfwr/ScriptTabs.vue'
import ItemsPanel from '~/components/tfwr/ItemsPanel.vue'
import FloatingWindow from '~/components/tfwr/FloatingWindow.vue'
import { Button } from '~/components/ui/button'
import { Kbd } from '~/components/ui/kbd'
import { useScripts } from '~/composables/tfwr/useScripts'
import { parseScriptPrefill, type PrefillResult } from '~/utils/tfwr-prefill'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'The Farmer Was Replaced - API Simulator',
})

const { scripts, activeIndex, active, hydrate, addScript, duplicateScript, closeScript, renameScript, setActive } = useScripts()

type ConsoleMode = 'hidden' | 'docked' | 'floating'

const consoleMode = ref<ConsoleMode>('hidden')
const lastVisibleMode = ref<ConsoleMode>('docked')

const output = ref('')
const ticks = ref(0)
const running = ref(false)
const board = ref<any[]>([])
const inventory = ref<Record<string, number>>({})
const prefill = ref<PrefillResult>({ status: 'none', items: {} })
const droneX = ref(0)
const droneY = ref(0)
const boardSize = ref(32)
const debug = ref(false)

function setConsoleMode(mode: ConsoleMode) {
  if (mode !== 'hidden') lastVisibleMode.value = mode
  consoleMode.value = mode
}

function toggleConsole() {
  setConsoleMode(consoleMode.value === 'hidden' ? lastVisibleMode.value : 'hidden')
}

function onKeydown(event: KeyboardEvent) {
  if (event.ctrlKey && event.code === 'Backquote') {
    event.preventDefault()
    toggleConsole()
  }
}

onMounted(() => {
  hydrate()
  window.addEventListener('keydown', onKeydown)
})
onScopeDispose(() => window.removeEventListener('keydown', onKeydown))

let pyodidePromise: Promise<PyodideInterface> | null = null
let apiLoaded = false

async function getPyodide() {
  if (!pyodidePromise) pyodidePromise = loadPyodide()
  const pyodide = await pyodidePromise
  if (!apiLoaded) {
    const apiCode = await $fetch('/tfwr_api.py').then(r => r.text())
    await pyodide.runPythonAsync(apiCode)
    apiLoaded = true
  }
  return pyodide
}

async function runCode() {
  running.value = true
  output.value = ''
  ticks.value = 0
  try {
    prefill.value = parseScriptPrefill(active.value.code)
    if (prefill.value.status === 'error') {
      output.value = `Invalid prefill comment:\n${prefill.value.message}`
      setConsoleMode(lastVisibleMode.value)
      return
    }

    const pyodide = await getPyodide()
    let stdout = ''
    pyodide.setStdout({ batched: (s: string) => { stdout += `${s}\n` } })

    pyodide.globals.set('__tfwr_prefill', JSON.stringify(prefill.value.items))
    await pyodide.runPythonAsync('__reset__()\n__set_prefill_items__(json.loads(__tfwr_prefill))')
    await pyodide.runPythonAsync(active.value.code)

    const tickCount = pyodide.runPython('get_tick_count()') as number
    const posX = pyodide.runPython('get_pos_x()') as number
    const posY = pyodide.runPython('get_pos_y()') as number
    const boardJson = pyodide.runPython('get_board_json()') as string
    const inventoryJson = pyodide.runPython('get_inventory_json()') as string

    output.value = stdout
    ticks.value = tickCount
    board.value = JSON.parse(boardJson)
    inventory.value = JSON.parse(inventoryJson)
    droneX.value = posX
    droneY.value = posY
    boardSize.value = pyodide.runPython('get_board_size()') as number
    output.value += `\n---\nTicks: ${tickCount}\nPos: (${posX}, ${posY})`
  }
  catch (e) {
    output.value = String(e)
  }
  finally {
    running.value = false
  }
}
</script>

<template>
  <div class="w-full px-1 py-2">
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-6 items-start">
      <div class="space-y-4 min-w-0">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">
            <Kbd>Ctrl</Kbd> + <Kbd>`</Kbd> toggles the console
          </span>
        </div>
        <ScriptTabs
          :scripts="scripts"
          :active-index="activeIndex"
          @update:active-index="setActive"
          @add="addScript"
          @duplicate="duplicateScript"
          @close="closeScript"
          @rename="renameScript"
        />
        <Editor
          :code="active.code"
          :running="running"
          @update:code="active.code = $event"
          @run="runCode"
        />
        <ItemsPanel :inventory="inventory" :prefill="prefill" />
        <section v-if="consoleMode === 'docked'">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-semibold">Console</h2>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="icon" title="Float console" @click="setConsoleMode('floating')">
                <IconPinnedOff class="h-4 w-4" />
                <span class="sr-only">Float console</span>
              </Button>
              <Button variant="ghost" size="icon" title="Hide console" @click="setConsoleMode('hidden')">
                <IconX class="h-4 w-4" />
                <span class="sr-only">Hide console</span>
              </Button>
            </div>
          </div>
          <Output :output="output" class="h-96" />
        </section>
      </div>
      <div class="lg:w-[34rem] xl:w-[40rem]">
        <Map
          :board="board"
          :board-size="boardSize"
          :drone-x="droneX"
          :drone-y="droneY"
          :debug="debug"
          @update:debug="debug = $event"
        />
      </div>
    </div>
    <FloatingWindow
      v-if="consoleMode === 'floating'"
      title="Console"
      :initial-x="40"
      :initial-y="80"
      :initial-width="640"
      :initial-height="420"
      @dock="setConsoleMode('docked')"
      @close="setConsoleMode('hidden')"
    >
      <Output :output="output" class="border-0 rounded-none" />
    </FloatingWindow>
  </div>
</template>
