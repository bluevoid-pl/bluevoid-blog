<script setup lang="ts">
import { loadPyodide } from 'pyodide'
import { ref } from 'vue'
import Editor from '~/components/tfwr/Editor.vue'
import Output from '~/components/tfwr/Output.vue'
import Map from '~/components/tfwr/Map.vue'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'The Farmer Was Replaced - API Simulator',
  htmlAttrs: {
    'data-syntax-theme': 'github'
  },
  link: [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/microlighter@2.2.0/dist/themes/github.css' }
  ],
  script: [
    { src: 'https://cdn.jsdelivr.net/npm/microlighter@2.2.0/dist/microlighter.min.js', type: 'module' }
  ]
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

async function runCode() {
  running.value = true
  output.value = ''
  ticks.value = 0
  animations.value = []
  try {
    const pyodide = await loadPyodide()
    let stdout = ''
    pyodide.setStdout(s => { stdout += s })
    const apiCode = await $fetch('/tfwr_api.py').then(r => r.text())
    await pyodide.runPythonAsync(apiCode)
    await pyodide.runPythonAsync(code.value)

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
        <Editor :code="code" :running="running" @update:code="code = $event" @run="runCode" />
        <Output :output="output" />
      </div>
      <div>
        <Map :board="board" :board-size="boardSize" :drone-x="droneX" :drone-y="droneY" :debug="debug" @update:debug="debug = $event" />
      </div>
    </div>
  </div>
</template>
