<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IconX, IconPinned, IconPinnedOff } from '@tabler/icons-vue'
import { useWindowDrag } from '~/composables/tfwr/useWindowDrag'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  title: string
  initialX: number
  initialY: number
  initialWidth: number
  initialHeight: number
}>()

const emit = defineEmits<{
  dock: []
  close: []
}>()

const x = ref(props.initialX)
const y = ref(props.initialY)
const winRef = ref<HTMLElement | null>(null)

const { dragging, startDrag } = useWindowDrag(
  () => x.value,
  () => y.value,
  (nx, ny) => {
    x.value = nx
    y.value = ny
  },
)

onMounted(() => {
  const width = winRef.value?.offsetWidth ?? props.initialWidth
  x.value = Math.min(x.value, Math.max(0, window.innerWidth - width))
  y.value = Math.min(y.value, Math.max(0, window.innerHeight - 120))
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="winRef"
      class="fixed z-50 flex flex-col min-w-[280px] min-h-[120px] overflow-hidden rounded-lg border bg-background shadow-2xl resize pb-2.5"
      :class="{ 'select-none': dragging }"
      :style="{ left: `${x}px`, top: `${y}px`, width: `${initialWidth}px`, height: `${initialHeight}px` }"
    >
      <div
        class="flex items-center gap-2 px-3 py-1.5 border-b bg-muted/60 cursor-move touch-none select-none"
        @pointerdown="startDrag"
      >
        <span class="text-sm font-semibold truncate">{{ title }}</span>
        <div class="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" class="h-6 w-6" title="Dock to layout" @click="emit('dock')">
            <IconPinned class="h-4 w-4" />
            <span class="sr-only">Dock</span>
          </Button>
          <Button variant="ghost" size="icon" class="h-6 w-6" title="Close" @click="emit('close')">
            <IconX class="h-4 w-4" />
            <span class="sr-only">Close</span>
          </Button>
        </div>
      </div>
      <div class="flex-1 min-h-0 overflow-hidden">
        <slot />
      </div>
    </div>
  </Teleport>
</template>
