<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IconZoomIn, IconZoomOut, IconMaximize } from '@tabler/icons-vue'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { Switch } from '~/components/ui/switch'
import { Button } from '~/components/ui/button'
import { usePanZoom } from '~/composables/tfwr/usePanZoom'

const TILE = 20

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

const viewportEl = ref<HTMLElement | null>(null)
const { offsetX, offsetY, scale, zoomBy, reset, bind } = usePanZoom(() => viewportEl.value)

onMounted(() => {
  if (viewportEl.value) bind(viewportEl.value)
})

const tileSize = computed(() => TILE * scale.value)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.boardSize}, ${tileSize.value}px)`,
  gridTemplateRows: `repeat(${props.boardSize}, ${tileSize.value}px)`,
}))

const panStyle = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px)`,
}))
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-semibold">Game Board ({{ boardSize }}×{{ boardSize }})</h2>
      <div class="flex items-center gap-2 text-sm">
        <span>Debug mode</span>
        <Switch :model-value="debug" @update:model-value="emit('update:debug', $event)" />
      </div>
    </div>
    <div
      ref="viewportEl"
      class="relative overflow-hidden rounded border bg-gray-950 cursor-grab active:cursor-grabbing touch-none"
      style="height: min(45rem, 90vw)"
    >
      <div class="grid w-fit will-change-transform" :style="[panStyle, gridStyle]">
        <template v-for="(row, y) in [...board].reverse()" :key="y">
          <template v-for="(cell, x) in row" :key="x">
            <Tooltip>
              <TooltipTrigger as-child>
                <div
                  class="relative border border-gray-700 bg-gray-800"
                  :style="{ width: `${tileSize}px`, height: `${tileSize}px` }"
                  :class="{ 'ring-2 ring-yellow-400': droneX === x && droneY === (board.length - 1 - y) }"
                >
                  <img v-if="cell.ground === 'Grassland'" src="/tfwr/grass3.svg" class="absolute inset-0 w-full h-full object-cover" alt="grassland">
                  <img v-else-if="cell.ground === 'Soil'" src="/tfwr/dirt.svg" class="absolute inset-0 w-full h-full object-cover" alt="soil">
                  <img v-if="cell.entity" :src="entityTexture(cell.entity)" class="absolute inset-0 w-full h-full object-contain" :style="{ padding: `${tileSize / 14}px` }" :alt="cell.entity">
                  <div v-if="droneX === x && droneY === (board.length - 1 - y)" class="absolute inset-0 flex items-center justify-center">
                    <img src="/tfwr/drone.svg" class="w-3/4 h-3/4" alt="drone">
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
