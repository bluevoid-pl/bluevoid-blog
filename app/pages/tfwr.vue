<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref } from 'vue'
import { IconPinnedOff, IconTerminal2, IconX } from '@tabler/icons-vue'
import Editor from '~/components/tfwr/Editor.vue'
import Output from '~/components/tfwr/Output.vue'
import Map from '~/components/tfwr/Map.vue'
import ScriptTabs from '~/components/tfwr/ScriptTabs.vue'
import ItemsPanel from '~/components/tfwr/ItemsPanel.vue'
import FloatingWindow from '~/components/tfwr/FloatingWindow.vue'
import { Button } from '~/components/ui/button'
import { useEngine } from '~/composables/tfwr/useEngine'
import { useScripts } from '~/composables/tfwr/useScripts'
import type { PrefillResult } from '~/utils/tfwr-prefill'
import { createTfwrRunner, type TfwrStep } from '~/utils/tfwr-runner'

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
const itemNames = ref<string[]>([])
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

const { getEngine } = useEngine()
const runner = createTfwrRunner(getEngine)

/**
 * The preview always lists the whole item catalogue, so a run reads as a
 * change in amounts instead of a set of items appearing out of nowhere.
 */
const allItems = computed(() => {
  const amounts: Record<string, number> = {}
  for (const name of itemNames.value) amounts[name] = 0
  for (const [name, amount] of Object.entries(inventory.value)) {
    amounts[name] = (amounts[name] ?? 0) + amount
  }
  return amounts
})

async function loadItemNames() {
  try {
    itemNames.value = await runner.getItems()
  }
  catch {
    // The preview stays empty until the engine can answer for the catalogue.
  }
}

/** Statement log lines: each top-level statement with the ticks it cost. */
function stepLines(steps: TfwrStep[]): string[] {
  const lines: string[] = []
  let previous = 0
  for (const step of steps) {
    lines.push(`${step.index}: ${step.code} [${step.ticks - previous}t]`)
    previous = step.ticks
  }
  return lines
}

async function runCode() {
  running.value = true
  output.value = ''
  ticks.value = 0
  try {
    const result = await runner.runStepped(active.value.code)
    prefill.value = result.prefill
    await loadItemNames()

    const lines: string[] = []
    if (result.output) lines.push(result.output.trimEnd())
    if (result.status === 'prefill-error') {
      lines.push(`Invalid prefill comment:\n${result.prefill.message}`)
    }
    else if (result.error) {
      const frame = result.error.frame ? ` (${result.error.frame})` : ''
      lines.push(`${result.error.summary}${frame}`)
    }
    if (result.state) {
      board.value = result.state.board
      boardSize.value = result.state.boardSize
      droneX.value = result.state.posX
      droneY.value = result.state.posY
      inventory.value = result.state.inventory
      ticks.value = result.state.ticks
      lines.push('', `Ticks: ${result.state.ticks}`, `Pos: (${result.state.posX}, ${result.state.posY})`)
    }
    if (result.steps.length) lines.push('', 'Statement log:', ...stepLines(result.steps))
    output.value = lines.join('\n')
  }
  catch (e) {
    output.value = String(e)
  }
  finally {
    // Output is only useful if it can be seen: reveal the console after every run.
    setConsoleMode(lastVisibleMode.value)
    running.value = false
  }
}
</script>

<template>
  <div class="w-full px-1 py-2">
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-6 items-start">
      <div class="space-y-4 min-w-0">
        <div class="flex items-center justify-end">
          <Button
            variant="outline"
            size="xs"
            :title="consoleMode === 'hidden' ? 'Open console' : 'Close console'"
            @click="toggleConsole"
          >
            <IconTerminal2 class="h-3.5 w-3.5" />
            Console
          </Button>
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
      <div class="lg:w-[34rem] xl:w-[40rem] space-y-3">
        <ItemsPanel :items="allItems" :prefill="prefill" />
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
