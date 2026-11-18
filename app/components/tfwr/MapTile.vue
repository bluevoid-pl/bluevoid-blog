<script setup lang="ts">
import { computed, inject } from 'vue'

type BoardCell = {
  ground?: string
  entity?: string | null
  water_level?: number
  fertiliser_level?: number
  growth?: number
  [key: string]: unknown
}

const props = defineProps<{
  index: number
  cell: BoardCell | null
}>()

const state = inject<{
  boardSize: number
  board: unknown[]
  droneX: number
  droneY: number
  debug: boolean
}>('tfwr:state')!
const entityTexture = inject<(entity: string | null) => string>('tfwr:entityTexture')!

const x = computed(() => props.index % state.boardSize)
// The rendered grid is flipped vertically, so the last board row shows first.
const y = computed(() => state.board.length - 1 - Math.floor(props.index / state.boardSize))
const isDroneTile = computed(() => state.droneX === x.value && state.droneY === y.value)

// The tooltip is pure CSS: `::after` renders this attribute on hover, so there
// are no tooltip components or per-move JS to pay for on a 1024-tile grid.
const tip = computed(() => {
  const lines = [`Cell ${x.value},${y.value}`]
  const cell = props.cell
  if (cell) {
    lines.push(`Ground: ${cell.ground || 'None'}`)
    lines.push(`Entity: ${cell.entity || 'None'}`)
    lines.push(`Water: ${((cell.water_level ?? 0) * 100).toFixed(1)}%  Fert: ${((cell.fertiliser_level ?? 0) * 100).toFixed(1)}%`)
    lines.push(`Growth: ${((cell.growth ?? 0) * 100).toFixed(1)}%`)
    if (state.debug) lines.push(JSON.stringify(cell))
  }
  if (isDroneTile.value) lines.push('Drone here')
  return lines.join('\n')
})
</script>

<template>
  <div
    class="tile"
    :class="{ 'tile-drone': isDroneTile }"
    :data-tip="tip"
  >
    <img
      v-if="cell && cell.ground === 'Grassland'"
      src="/tfwr/grass3.svg"
      class="tile-fill tile-cover"
      alt=""
    >
    <img
      v-else-if="cell && cell.ground === 'Soil'"
      src="/tfwr/dirt.svg"
      class="tile-fill tile-cover"
      alt=""
    >
    <img
      v-if="cell && cell.entity"
      :src="entityTexture(cell.entity)"
      class="tile-fill tile-entity"
      :alt="cell.entity"
    >
    <img
      v-if="isDroneTile"
      src="/tfwr/drone.svg"
      class="tile-fill tile-drone-sprite"
      alt="drone"
    >
  </div>
</template>

<style scoped>
/* Tiles stay at the base cell size; zooming only rewrites the wrapper's
   transform, so nothing here updates on pan/zoom. */
.tile {
  position: relative;
  width: var(--tfwr-cell, 20px);
  height: var(--tfwr-cell, 20px);
  border: 1px solid #374151;
  background-color: #1f2937;
}

.tile-fill {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.tile-cover {
  object-fit: cover;
}
.tile-entity {
  object-fit: contain;
  padding: 7%;
}
.tile-drone-sprite {
  object-fit: contain;
  padding: 12%;
}

/* Tiles are built from images. Without this a drag that begins on one starts a
   native image drag, which steals the pointer from the pan handler. */
.tile img {
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-touch-callout: none;
}

.tile-drone {
  box-shadow: inset 0 0 0 2px #facc15;
}

/* Shared-style tooltip rendered by the tile itself via CSS. The hovered tile
   is raised so its tooltip paints over the later grid cells. */
.tile:hover {
  z-index: 30;
}
.tile:hover::after {
  content: attr(data-tip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 4px);
  transform: translateX(-50%);
  z-index: 30;
  pointer-events: none;
  white-space: pre-line;
  max-width: 800px;
  border-radius: 0.375rem;
  border: 1px solid var(--border);
  background-color: var(--popover);
  color: var(--popover-foreground);
  padding: 0.375rem 0.625rem;
  font-size: 10px;
  line-height: 1.4;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
</style>
