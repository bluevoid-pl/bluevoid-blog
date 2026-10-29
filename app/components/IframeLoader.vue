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
  <div class="relative cursor-pointer overflow-hidden rounded-lg bg-white/4 border border-white/10" :style="decodedStyle">
    <div v-if="!loaded" class="relative w-full h-full group" @click="handleClick">
      <img v-if="img" :src="img" alt="Preview" class="w-full h-full object-cover block" />
      <div class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span class="text-slate-100 font-semibold z-10">{{ message || 'Play' }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 71.942253 79.738464" class="absolute bottom-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <path d="m 0,66.405133 v -53.0718 Q 0,-6.6666666 17.3205,3.3333333 L 63.282,29.869233 q 17.3205,10 0,20 l -45.9615,26.5359 Q 0,86.405133 0,66.405133" />
        </svg>
      </div>
    </div>
    <iframe v-else :src="src" class="w-full h-full min-h-[720px] border-0 bg-[#0b0f14] block" @load="onIframeLoad" />
    <div v-if="loading && !loaded" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-300 text-sm">
      Loading...
    </div>
  </div>
</template>
