<script setup lang="ts">
const props = defineProps<{
  imgSrc?: string
  alt?: string
  wrapperClass?: string
  innerClass?: string
}>()
</script>

<template>
  <div :class="wrapperClass || 'group/desktop relative w-full h-[85%] my-auto rounded-xl border-2 border-neutral-800 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden pt-8'">
    <div class="absolute inset-y-0 left-0 w-1/2 z-10"></div>
    <div class="absolute top-0 left-0 right-0 h-4 bg-neutral-800 flex items-center justify-end pr-3">
      <div class="flex items-center gap-1.5">
        <span class="size-2 rounded-full bg-green-500/80"></span>
        <span class="size-2 rounded-full bg-yellow-500/80"></span>
        <span class="size-2 rounded-full bg-red-500/80"></span>
      </div>
    </div>
    <img
      :src="props.imgSrc"
      :alt="props.alt"
      :class="innerClass || 'absolute top-8 left-0 right-0 bottom-0 w-full h-full object-cover object-left-top'"
    />
  </div>
</template>
