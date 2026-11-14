<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { Switch } from '~/components/ui/switch'
import { loadPyodide } from 'pyodide'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'The Farmer Was Replaced - API Simulator',
})

const code = ref(`# Example: Move and harvest
# Plant grass at start
plant(Entities.Grass)
# Move east twice
move(East)
move(East)
# Check entity
if get_entity_type() == Entities.Grass:
    print('Found grass at', get_pos_x(), get_pos_y())
    harvest()
`)

const output = ref('')
const ticks = ref(0)
const running = ref(false)
const animations = ref([])
const board = ref([])
const droneX = ref(0)
const droneY = ref(0)
const boardSize = ref(32)
const debug = ref(false)

const entityTextures: Record<string, string> = {
  'Grass': '/tfwr/grass1.svg',
  'Bush': '/tfwr/bush1.svg',
  'Tree': '/tfwr/oak.svg',
  'Carrots': '/tfwr/wheat1.svg',
  'Pumpkin': '/tfwr/wheat2.svg',
  'Sunflower': '/tfwr/wheat3.svg',
  'Cactus': '/tfwr/seed.svg',
  'Hedge': '/tfwr/bush2.svg',
  'Treasure': '/tfwr/diamond.svg',
  'Dinosaur': '/tfwr/seed.svg',
  'Dead_Pumpkin': '/tfwr/mushroom1.svg',
  'Apple': '/tfwr/seed.svg',
}

function entityTexture(entity: string | null) {
  if (!entity) return ''
  return entityTextures[entity] || '/tfwr/seed.svg'
}

async function runCode() {
  running.value = true
  output.value = ''
  ticks.value = 0
  animations.value = []
  try {
    // Load Pyodide
    const pyodide = await loadPyodide({
      indexURL: `/pyodide/`
    })

    // Capture stdout
    let stdout = ''
    pyodide.setStdout(s => { stdout += s })

    // Load TFWR API
    const apiCode = await $fetch('/tfwr_api.py').then(r => r.text())
    await pyodide.runPythonAsync(apiCode)

    // Run user code
    await pyodide.runPythonAsync(code.value)

    // Gather results
    const tickCount = pyodide.runPython('get_tick_count()')
    const posX = pyodide.runPython('get_pos_x()')
    const posY = pyodide.runPython('get_pos_y()')
    const animCount = pyodide.runPython('get_animation_count()')
    const animLog = pyodide.runPython('get_animation_log()')
    const boardJson = pyodide.runPython('get_board_json()')
    const boardSizeVal = pyodide.runPython('get_board_size()')

    output.value = stdout
    ticks.value = tickCount
    animations.value = animLog
    board.value = JSON.parse(boardJson)
    droneX.value = posX
    droneY.value = posY
    boardSize.value = boardSizeVal
    output.value += `\n---\nTicks: ${tickCount}\nPos: (${posX}, ${posY})\nAnimations: ${animCount}`
  } catch (e) {
    output.value = String(e)
  } finally {
    running.value = false
  }
}
</script>

<template>
  <div class="w-full px-1 py-2">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
      <div class="space-y-6">
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-semibold">Code Editor</h2>
            <button @click="runCode" :disabled="running" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {{ running ? 'Running...' : 'Run' }}
            </button>
          </div>
          <textarea v-model="code" class="w-full h-96 font-mono text-sm border rounded p-3" />
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-3">Output</h2>
          <div class="border rounded p-3 h-96 overflow-auto bg-gray-900 text-green-400 font-mono text-sm">
            {{ output }}
          </div>
          <div class="mt-3 text-sm">
            Ticks: {{ ticks }}
          </div>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-semibold">Game Board ({{ boardSize }}×{{ boardSize }})</h2>
          <div class="flex items-center gap-2 text-sm">
            <span>Debug mode</span>
            <Switch v-model="debug" />
          </div>
        </div>
        <div class="border rounded overflow-hidden" :style="{ width: `${boardSize * 20}px`, height: `${boardSize * 20}px` }">
          <div class="grid w-full h-full" :style="{ gridTemplateColumns: `repeat(${boardSize}, 20px)`, gridTemplateRows: `repeat(${boardSize}, 20px)` }">
            <template v-for="(row, y) in [...board].reverse()" :key="y">
              <template v-for="(cell, x) in row" :key="x">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <div class="relative w-[20px] h-[20px] border border-gray-700 bg-gray-800"
                         :class="{ 'ring-2 ring-yellow-400': droneX === x && droneY === (board.length - 1 - y) }">
                      <img v-if="cell.ground === 'Grassland'" src="/tfwr/grass3.svg" class="absolute inset-0 w-full h-full object-cover" alt="grassland" />
                      <img v-else-if="cell.ground === 'Soil'" src="/tfwr/dirt.svg" class="absolute inset-0 w-full h-full object-cover" alt="soil" />
                      <img v-if="cell.entity" :src="entityTexture(cell.entity)" class="absolute inset-0 w-full h-full object-contain p-0.5" :alt="cell.entity" />
                      <div v-if="droneX === x && droneY === (board.length - 1 - y)" class="absolute inset-0 flex items-center justify-center">
                        <img src="/tfwr/drone.svg" class="w-4 h-4" alt="drone" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" class="max-w-xs text-xs">
                    <div class="space-y-1">
                      <div class="font-semibold text-[11px] uppercase tracking-wide text-muted-foreground">Cell {{ x }},{{ board.length - 1 - y }}</div>
                      <div><strong>Ground:</strong> {{ cell.ground }}</div>
                      <div><strong>Entity:</strong> {{ cell.entity || 'None' }}</div>
                      <div class="text-muted-foreground">
                        <div>Water: {{ (cell.water_level * 100).toFixed(1) }}% ({{ cell.water_level.toFixed(3) }})</div>
                        <div>Fertiliser: {{ (cell.fertiliser_level * 100).toFixed(1) }}% ({{ cell.fertiliser_level.toFixed(3) }})</div>
                        <div>Growth: {{ (cell.growth * 100).toFixed(1) }}% ({{ cell.growth.toFixed(3) }})</div>
                      </div>
                      <div v-if="droneX === x && droneY === (board.length - 1 - y)" class="text-amber-500 font-medium">Drone here</div>
                      <div v-if="debug" class="pt-1 border-t text-[10px] text-muted-foreground whitespace-pre-wrap">Raw: {{ JSON.stringify(cell, null, 2) }}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </template>
            </template>
          </div>
        </div>
        <div class="mt-2 text-sm">Drone at ({{ droneX }}, {{ droneY }})</div>
      </div>
    </div>
  </div>
</template>
