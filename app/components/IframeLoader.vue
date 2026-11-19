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
  <div class="relative overflow-hidden rounded-lg border border-white/10 bg-white/4" :style="decodedStyle">
    <!-- Real button so click-to-load is keyboard accessible, not just mouse. -->
    <button v-if="!loaded" type="button" class="group relative block h-full w-full cursor-pointer border-0 bg-transparent p-0" @click="handleClick">
      <img v-if="img" :src="img" alt="" loading="lazy" decoding="async" class="block h-full w-full object-cover" />
      <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        <span class="relative z-10 font-semibold">{{ message || 'Play' }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 71.942253 79.738464" class="absolute bottom-0 left-0 h-full w-full opacity-30" aria-hidden="true">
          <path d="m 0,66.405133 v -53.0718 Q 0,-6.6666666 17.3205,3.3333333 L 63.282,29.869233 q 17.3205,10 0,20 l -45.9615,26.5359 Q 0,86.405133 0,66.405133" />
        </svg>
      </div>
    </button>
    <iframe v-else :src="src" class="w-full h-full min-h-[720px] border-0 bg-[#0b0f14] block" @load="onIframeLoad" />
    <!-- Was dead code before (loading implies loaded here); now shows over the iframe until it fires load. -->
    <div v-if="loading" role="status" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
      Loading...
    </div>
  </div>
</template>
