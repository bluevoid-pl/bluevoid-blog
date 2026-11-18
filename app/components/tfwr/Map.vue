<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { IconZoomIn, IconZoomOut, IconMaximize } from '@tabler/icons-vue'
import { Button } from '~/components/ui/button'
import { usePanZoom } from '~/composables/tfwr/usePanZoom'
import MapTile from './MapTile.vue'
import type { TfwrStep } from '~/utils/tfwr-runner'

const props = defineProps<{
  board: any[]
  boardSize: number
  droneX: number
  droneY: number
  debug: boolean
  steps?: any[]
  replayIndex?: number
  replayPlaying?: boolean
  replaySpeed?: number
}>()

const emit = defineEmits<{
  'update:debug': [value: boolean]
}>()

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

// Tiles read shared state through injection instead of one prop per tile.
provide('tfwr:state', props)
provide('tfwr:entityTexture', entityTexture)

const viewportEl = ref<HTMLElement | null>(null)
const { scale, transformStyle, zoomBy, reset, bind } = usePanZoom(() => viewportEl.value)

onMounted(() => {
  if (viewportEl.value) bind(viewportEl.value)
})

// The wrapper's base size; tiles keep this size at every zoom level, and zoom
// only rewrites this element's `transform` (one style mutation per frame).
const CELL = 20
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.boardSize}, ${CELL}px)`,
  gridTemplateRows: `repeat(${props.boardSize}, ${CELL}px)`,
  transform: transformStyle.value,
  transformOrigin: '0 0',
}))

// Board rows render bottom-up, so the top rendered row is the last board row.
const cells = computed(() => {
  const out: { index: number; cell: any }[] = []
  for (let ry = 0; ry < props.boardSize; ry++) {
    const row = props.board[props.board.length - 1 - ry]
    for (let x = 0; x < props.boardSize; x++) {
      out.push({ index: ry * props.boardSize + x, cell: row?.[x] ?? null })
    }
  }
  return out
})

const replayPoints = computed(() => {
  if (!props.steps || props.replayIndex === undefined || props.replayIndex < 0) return []
  const points: { x: number; y: number }[] = []
  for (let i = 0; i <= props.replayIndex && i < props.steps.length; i++) {
    const step = props.steps[i] as TfwrStep
    if (step && typeof step.x === 'number' && typeof step.y === 'number') {
      points.push({ x: step.x, y: step.y })
    }
  }
  return points
})

const replaySvgPath = computed(() => {
  const points = replayPoints.value
  if (points.length < 2) return ''
  const d = points.map((p, i) => {
    const row = props.boardSize - 1 - p.y
    const col = p.x
    const cx = (col + 0.5) * CELL
    const cy = (row + 0.5) * CELL
    return `${i === 0 ? 'M' : 'L'} ${cx} ${cy}`
  }).join(' ')
  return d
})

const replayActions = computed(() => {
  if (!props.steps || props.replayIndex === undefined || props.replayIndex < 0) return []
  const actions: { x: number; y: number; type: 'move' | 'harvest' | 'plant' | 'till'; code: string }[] = []
  for (let i = 0; i <= props.replayIndex && i < props.steps.length; i++) {
    const step = props.steps[i] as TfwrStep
    if (!step || !step.code) continue
    const code = step.code.toLowerCase()
    let type: 'move' | 'harvest' | 'plant' | 'till' | null = null
    if (code.includes('move(')) type = 'move'
    else if (code.includes('harvest(')) type = 'harvest'
    else if (code.includes('plant(')) type = 'plant'
    else if (code.includes('till(')) type = 'till'
    if (type) {
      actions.push({ x: step.x, y: step.y, type, code: step.code })
    }
  }
  return actions
})
</script>

<template>
  <div class="select-none">
    <div
      ref="viewportEl"
      class="relative overflow-hidden rounded border bg-gray-950 cursor-grab active:cursor-grabbing touch-none"
      style="height: min(45rem, 90vw)"
    >
      <div class="grid w-fit will-change-transform" :style="gridStyle">
        <MapTile v-for="{ index, cell } in cells" :key="index" :index="index" :cell="cell" />
        <svg
          v-if="props.steps && props.replayIndex !== undefined"
          class="absolute inset-0 pointer-events-none"
          :width="props.boardSize * CELL"
          :height="props.boardSize * CELL"
          :viewBox="`0 0 ${props.boardSize * CELL} ${props.boardSize * CELL}`"
        >
        <path
          v-if="replaySvgPath"
          :d="replaySvgPath"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <g
          v-for="action in replayActions"
          :key="`${action.x}-${action.y}-${action.type}`"
        >
          <circle
            :cx="(action.x + 0.5) * CELL"
            :cy="(props.boardSize - 1 - action.y + 0.5) * CELL"
            r="6"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.8)"
            stroke-width="1.5"
          />
          <text
            :x="(action.x + 0.5) * CELL"
            :y="(props.boardSize - 1 - action.y + 0.5) * CELL"
            text-anchor="middle"
            dominant-baseline="central"
            font-size="10"
            fill="white"
          >{{ action.type[0].toUpperCase() }}</text>
        </g>
      </svg>
      <div class="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground pointer-events-none">
        {{ (scale * 100).toFixed(0) }}% · drag to pan, scroll to zoom
      </div>
      <div class="absolute bottom-2 right-2 flex items-center gap-1">
        <Button variant="secondary" size="icon" class="h-7 w-7" title="Zoom in" @click="zoomBy(1.25)">
          <IconZoomIn class="h-4 w-4" />
          <span class="sr-only">Zoom in</span>
        </Button>
        <Button variant="secondary" size="icon" class="h-7 w-7" title="Zoom out" @click="zoomBy(1 / 1.25)">
          <IconZoomOut class="h-4 w-4" />
          <span class="sr-only">Zoom out</span>
        </Button>
        <Button variant="secondary" size="icon" class="h-7 w-7" title="Reset view" @click="reset()">
          <IconMaximize class="h-4 w-4" />
          <span class="sr-only">Reset view</span>
        </Button>
      </div>
    </div>
  </div>
</template>
