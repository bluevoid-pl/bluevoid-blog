import { ref, type Ref } from 'vue'

export interface WindowDragState {
  dragging: Ref<boolean>
  startDrag: (event: PointerEvent) => void
}

/**
 * Drag a window from a handle element. The window is positioned with fixed
 * coordinates relative to the viewport, so no container ref is needed.
 */
export function useWindowDrag(
  getX: () => number,
  getY: () => number,
  setPos: (x: number, y: number) => void,
): WindowDragState {
  const dragging = ref(false)

  function startDrag(event: PointerEvent) {
    if (event.button !== 0) return
    event.preventDefault()
    const handle = event.currentTarget as HTMLElement
    handle.setPointerCapture(event.pointerId)
    const startX = event.clientX
    const startY = event.clientY
    const originX = getX()
    const originY = getY()

    const onMove = (moveEvent: PointerEvent) => {
      setPos(
        originX + moveEvent.clientX - startX,
        Math.max(0, originY + moveEvent.clientY - startY),
      )
    }
    const onUp = () => {
      dragging.value = false
      handle.removeEventListener('pointermove', onMove)
      handle.removeEventListener('pointerup', onUp)
    }

    dragging.value = true
    handle.addEventListener('pointermove', onMove)
    handle.addEventListener('pointerup', onUp)
  }

  return { dragging, startDrag }
}
