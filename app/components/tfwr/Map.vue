<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { Switch } from '~/components/ui/switch'

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
  </div>
</template>
