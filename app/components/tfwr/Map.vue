<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { IconZoomIn, IconZoomOut, IconMaximize } from '@tabler/icons-vue'
import { Switch } from '~/components/ui/switch'
import { Button } from '~/components/ui/button'
import { usePanZoom } from '~/composables/tfwr/usePanZoom'
import MapTile from './MapTile.vue'

const props = defineProps<{
  board: any[]
  boardSize: number
  droneX: number
  droneY: number
  debug: boolean
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
</script>

<template>
  <div class="select-none">
    <div class="mb-3 flex items-center justify-end gap-2 text-sm">
      <span>Debug mode</span>
      <Switch :model-value="debug" @update:model-value="emit('update:debug', $event as boolean)" />
    </div>
    <div
      ref="viewportEl"
      class="relative overflow-hidden rounded border bg-gray-950 cursor-grab active:cursor-grabbing touch-none"
      style="height: min(45rem, 90vw)"
    >
      <div class="grid w-fit will-change-transform" :style="gridStyle">
        <MapTile v-for="{ index, cell } in cells" :key="index" :index="index" :cell="cell" />
      </div>
      <div class="absolute top-2 right-2 flex flex-col gap-1">
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
      <div class="absolute bottom-2 left-2 text-[10px] font-mono text-muted-foreground pointer-events-none">
        {{ (scale * 100).toFixed(0) }}% · drag to pan, scroll to zoom
      </div>
    </div>
  </div>
</template>
