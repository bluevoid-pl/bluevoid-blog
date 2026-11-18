<script setup lang="ts">
import { computed, onScopeDispose, ref, watch, watchEffect } from 'vue'
import Map from './Map.vue'
import ItemsPanel from './ItemsPanel.vue'
import { Switch } from '~/components/ui/switch'
import { Button } from '~/components/ui/button'
import type { PrefillResult } from '~/utils/tfwr-prefill'
import type { TfwrStep } from '~/utils/tfwr-runner'

const props = defineProps<{
  board: any[]
  boardSize: number
  droneX: number
  droneY: number
  inventory: Record<string, number>
  itemNames: string[]
  prefill: PrefillResult
  steps?: TfwrStep[]
  debug?: boolean
}>()

const emit = defineEmits<{
  'update:debug': [value: boolean]
}>()

const debug = computed({
  get: () => props.debug ?? false,
  set: (v: boolean) => emit('update:debug', v),
})

const replayIndex = ref<number>(-1)
const replayPlaying = ref(false)
const baseSpeed = 300
const speedMultiplier = ref(1)
const replaySpeed = ref(300)
const replayWindowSize = ref<number>(3)

watch(() => speedMultiplier.value, (m) => {
  replaySpeed.value = Math.max(25, Math.round(baseSpeed / m))
})

watch(() => replayPlaying.value, (playing) => {
  if (playing) {
    const stepsLen = props.steps?.length ?? 0
    if (replayIndex.value >= stepsLen - 1) {
      replayIndex.value = -1
    }
  }
})

let replayTimer: number | null = null

watchEffect(() => {
  const steps = props.steps ?? []
  if (replayPlaying.value && steps.length > 0) {
    if (replayTimer) clearInterval(replayTimer)
    replayTimer = setInterval(() => {
      if (replayIndex.value < steps.length - 1) {
        replayIndex.value++
      } else {
        replayPlaying.value = false
        if (replayTimer) clearInterval(replayTimer)
        replayTimer = null
      }
    }, replaySpeed.value)
  } else {
    if (replayTimer) {
      clearInterval(replayTimer)
      replayTimer = null
    }
  }
})

onScopeDispose(() => {
  if (replayTimer) clearInterval(replayTimer)
})

const allItems = computed(() => {
  const amounts: Record<string, number> = {}
  for (const name of props.itemNames) amounts[name] = 0
  for (const [name, amount] of Object.entries(props.inventory)) {
    amounts[name] = (amounts[name] ?? 0) + amount
  }
  return amounts
})
</script>

<template>
  <div class="space-y-3">
    <ItemsPanel :items="allItems" :prefill="prefill" />
    <Map
      :board="board"
      :board-size="boardSize"
      :drone-x="droneX"
      :drone-y="droneY"
      :debug="debug"
      :steps="steps"
      :replay-index="replayIndex"
      :replay-playing="replayPlaying"
      :replay-speed="replaySpeed"
      :replay-window-size="replayWindowSize"
      @update:debug="debug = $event"
    />
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <Button size="sm" :disabled="!(steps && steps.length)" @click="replayPlaying = !replayPlaying">
          {{ replayPlaying ? 'Pause' : 'Play' }}
        </Button>
        <Button size="sm" :disabled="!steps?.length || replayIndex <= 0" @click="replayIndex = Math.max(-1, replayIndex - 1)">
          Prev
        </Button>
        <Button size="sm" :disabled="!steps?.length || replayIndex >= (steps?.length ?? 1) -1" @click="replayIndex = Math.min((steps?.length ?? 1) -1, replayIndex + 1)">
          Next
        </Button>
        <span class="text-xs ml-auto">{{ replayIndex >=0 ? replayIndex+1 : 0 }} / {{ steps?.length ?? 0 }}</span>
        <div class="flex items-center gap-1 ml-2">
          <span class="text-xs">Speed</span>
          <Button size="sm" variant="secondary" :class="{ 'bg-primary/20': speedMultiplier === 1 }" @click="speedMultiplier = 1">1×</Button>
          <Button size="sm" variant="secondary" :class="{ 'bg-primary/20': speedMultiplier === 2 }" @click="speedMultiplier = 2">2×</Button>
          <Button size="sm" variant="secondary" :class="{ 'bg-primary/20': speedMultiplier === 4 }" @click="speedMultiplier = 4">4×</Button>
          <Button size="sm" variant="secondary" :class="{ 'bg-primary/20': speedMultiplier === 8 }" @click="speedMultiplier = 8">8×</Button>
          <span class="text-xs ml-2">{{ replaySpeed }}ms</span>
        </div>
        <div class="flex items-center gap-1 ml-2">
          <span class="text-xs">Window</span>
          <Button size="sm" variant="secondary" :disabled="replayWindowSize <= 1" @click="replayWindowSize = Math.max(1, replayWindowSize - 1)">-</Button>
          <span class="text-xs w-6 text-center">{{ replayWindowSize }}</span>
          <Button size="sm" variant="secondary" :disabled="replayWindowSize >= 10" @click="replayWindowSize = Math.min(10, replayWindowSize + 1)">+</Button>
        </div>
      </div>
      <div class="w-full">
        <input
          class="w-full accent-primary"
          type="range"
          :min="-1"
          :max="(steps?.length ?? 1) -1"
          v-model.number="replayIndex"
          :disabled="!steps?.length"
        />
      </div>
    </div>
    <div class="flex items-center gap-2 text-sm">
      <span>Debug mode</span>
      <Switch :model-value="debug" @update:model-value="debug = $event" />
    </div>
  </div>
</template>
