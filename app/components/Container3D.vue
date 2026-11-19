<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  maxTilt?: number
  depthStep?: number
}>()

const containerRef = ref<HTMLElement | null>(null)

const maxTilt = props.maxTilt ?? 12
const depthStep = props.depthStep ?? 20

function onMouseMove(e: MouseEvent) {
  const el = containerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = e.clientX - cx
  const dy = e.clientY - cy
  const rotX = (dy / rect.height) * maxTilt
  const rotY = (dx / rect.width) * maxTilt
  el.style.transform = `rotateY(${rotY}deg) rotateX(${-rotX}deg)`
}

function onMouseLeave() {
  const el = containerRef.value
  if (el) el.style.transform = 'rotateY(0deg) rotateX(0deg)'
}

function initLayers() {
  const el = containerRef.value
  if (!el) return
  const nodes = el.querySelectorAll('[class*="layer-"]')
  nodes.forEach(node => {
    const elHtml = node as HTMLElement
    const classes = Array.from(elHtml.classList)
    const layerClass = classes.find(c => /^layer-\d+$/.test(c))
    if (!layerClass) return
    const num = parseInt(layerClass.split('-')[1], 10)
    if (isNaN(num)) return
    const depth = num * depthStep
    elHtml.style.setProperty('--layer-depth', `${depth}px`)
    elHtml.style.transformStyle = 'preserve-3d'
    elHtml.style.willChange = 'transform'
  })
}

onMounted(() => {
  const el = containerRef.value
  if (!el) return
  el.style.transformStyle = 'preserve-3d'
  el.style.transformOrigin = 'center center'
  el.style.willChange = 'transform'
  initLayers()
  el.addEventListener('mousemove', onMouseMove, { passive: true })
  el.addEventListener('mouseleave', onMouseLeave)
})

onBeforeUnmount(() => {
  const el = containerRef.value
  if (el) {
    el.removeEventListener('mousemove', onMouseMove)
    el.removeEventListener('mouseleave', onMouseLeave)
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="container-3d relative"
    :style="{ perspective: '1200px', transformStyle: 'preserve-3d' }"
  >
    <slot />
  </div>
</template>

<style scoped>
.container-3d {
  position: relative;
  transform-style: preserve-3d;
  perspective: 1200px;
  perspective-origin: center center;
  will-change: transform;
  overflow: visible;
}

/* Layers must be absolutely positioned with fixed size to work correctly */
.container-3d [class*="layer-"] {
  position: absolute;
  transform-style: preserve-3d;
  will-change: transform;
  /* Depth is set via --layer-depth */
  transform: translateZ(var(--layer-depth, 0px));
}

/* Ensure children of layers can be sized explicitly */
.container-3d [class*="layer-"] > * {
  width: 100%;
  height: 100%;
}
</style>
