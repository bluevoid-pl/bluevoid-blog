<script setup lang="ts">
const props = defineProps<{
  imgSrc?: string
  alt?: string
  wrapperClass?: string
  innerClass?: string
  hideOnHover?: boolean
}>()

const baseWrapper = `absolute top-[-40%] right-8 z-50 w-[180px] aspect-[9/19.5] rounded-[1.2rem] p-[4px] bg-zinc-300 shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_0_20px_rgba(255,255,255,0.15)] overflow-hidden relative after:absolute after:inset-0 after:rounded-[1.2rem] after:bg-gradient-to-br after:from-white/10 after:via-transparent after:to-transparent after:pointer-events-none after:content-[''] after:-z-10`
const hoverClasses = 'transition-opacity duration-300 ease-out opacity-100 group-hover:opacity-0'
</script>

<template>
  <div :class="[props.wrapperClass ?? baseWrapper, props.hideOnHover ? hoverClasses : '']">
    <div :class="innerClass ?? 'relative w-full h-full overflow-hidden rounded-[0.9rem] z-10'">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        :alt="alt ?? ''"
        class="w-full h-full object-cover"
      />
      <!-- Mobile status bar -->
      <div class="absolute top-0 left-0 right-0 h-6 bg-black text-white text-[9px] flex items-center justify-between px-3 z-40">
        <span>12:34</span>
        <div class="flex items-center gap-1">
          <div class="w-5 h-2.5 border border-white/60 rounded-[2px] relative">
            <div class="absolute inset-[1px] bg-white/80 rounded-[1px] w-[70%]" />
            <div class="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-[60%] bg-white/60 rounded-[1px]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
