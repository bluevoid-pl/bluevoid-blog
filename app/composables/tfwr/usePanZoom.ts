import { computed, onScopeDispose, ref } from 'vue'

export interface PanZoomState {
  offsetX: number
  offsetY: number
  scale: number
}

const MIN_SCALE = 0.4
const MAX_SCALE = 8

/**
 * Pan (pointer drag) and zoom (wheel, cursor-anchored) state for a viewport
 * element. All transforms are applied via CSS in the consumer.
 */
export function usePanZoom(getViewport: () => HTMLElement | null | undefined) {
  const offsetX = ref(0)
  const offsetY = ref(0)
  const scale = ref(1)

  const transformStyle = computed(() =>
    `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
  )

  let panning = false
  let panStartX = 0
  let panStartY = 0
  let originOffsetX = 0
  let originOffsetY = 0

  function clampScale(next: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next))
  }

  function zoomAt(factor: number, clientX: number, clientY: number) {
    const viewport = getViewport()
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    const px = clientX - rect.left
    const py = clientY - rect.top
    const next = clampScale(scale.value * factor)
    // Keep the world point under the cursor stationary
    offsetX.value = px - ((px - offsetX.value) / scale.value) * next
    offsetY.value = py - ((py - offsetY.value) / scale.value) * next
    scale.value = next
  }

  function zoomBy(factor: number) {
    const viewport = getViewport()
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2)
  }

  function reset() {
    offsetX.value = 0
    offsetY.value = 0
    scale.value = 1
  }

  function onPointerDown(event: PointerEvent) {
    if (event.button !== 0 && event.button !== 1) return
    panning = true
    panStartX = event.clientX
    panStartY = event.clientY
    originOffsetX = offsetX.value
    originOffsetY = offsetY.value
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  function onPointerMove(event: PointerEvent) {
    if (!panning) return
    offsetX.value = originOffsetX + (event.clientX - panStartX)
    offsetY.value = originOffsetY + (event.clientY - panStartY)
  }

  function onPointerUp() {
    panning = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault()
    zoomAt(event.deltaY < 0 ? 1.1 : 1 / 1.1, event.clientX, event.clientY)
  }

  function bind(el: HTMLElement) {
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
  }

  onScopeDispose(() => {
    const el = getViewport()
    el?.removeEventListener('wheel', onWheel)
    el?.removeEventListener('pointerdown', onPointerDown)
    onPointerUp()
  })

  return {
    offsetX,
    offsetY,
    scale,
    transformStyle,
    zoomBy,
    reset,
    bind,
  }
}
