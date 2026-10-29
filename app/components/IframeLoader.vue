<script setup lang="ts">
const props = defineProps<{
  src?: string
  img?: string
  message?: string
  style?: string
  width?: string
  height?: string
  size?: string
}>()

const emit = defineEmits<{
  load: []
}>()

const loaded = ref(false)
const loading = ref(false)

const decodedStyle = computed(() => {
  let style = typeof props.style === 'string' ? props.style : `DEBUG type=${typeof props.style} json=${JSON.stringify(props.style)}`
  style = String(style).replace(/&quot;/g, '"').replace(/&amp;/g, '&')
  if (props.width) style += `; width: ${props.width}`
  if (props.height) style += `; height: ${props.height}`
  if (props.size === '720p') {
    style += `; width: 1280px; height: 720px`
  }
  return style
})

function handleClick() {
  if (!loaded.value) {
    loading.value = true
    loaded.value = true
  }
}

function onIframeLoad() {
  loaded.value = true
  loading.value = false
  emit('load')
}
</script>

<template>
  <div class="iframe-loader" :style="decodedStyle">
    <div v-if="!loaded" class="iframe-preview" @click="handleClick">
      <img v-if="img" :src="img" alt="Preview" class="iframe-preview-img" />
      <div class="iframe-overlay">
        <span class="iframe-message">{{ message || 'Kliknij aby za\u0142adowa\u0107' }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 71.942253 79.738464" class="svg_triangle">
          <path d="m 0,66.405133 v -53.0718 Q 0,-6.6666666 17.3205,3.3333333 L 63.282,29.869233 q 17.3205,10 0,20 l -45.9615,26.5359 Q 0,86.405133 0,66.405133" />
        </svg>
      </div>
    </div>
    <iframe v-else :src="src" class="iframe-frame" @load="onIframeLoad" />
    <div v-if="loading && !loaded" class="iframe-loading">
      Loading...
    </div>
  </div>
</template>

<style scoped>
.iframe-loader {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.5rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
}
.iframe-preview {
  position: relative;
  width: 100%;
  height: 100%;
}
.iframe-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.iframe-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  transition: opacity 0.2s;
}
.iframe-loader:hover .iframe-overlay {
  opacity: 1;
}
.iframe-message {
  color: #f1f5f9;
  font-weight: 600;
  z-index: 1;
}
.svg_triangle {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  pointer-events: none;
}
.iframe-frame {
  width: 100%;
  height: 100%;
  min-height: 720px;
  border: 0;
  background: #0b0f14;
  display: block;
}
.iframe-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #93c5fd;
  font-size: 0.9rem;
}
</style>
