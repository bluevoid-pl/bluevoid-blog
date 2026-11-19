<script setup lang="ts">
const props = defineProps<{
  imgSrc?: string
  alt?: string
  wrapperClass?: string
  innerClass?: string
}>()
</script>

<template>
  <div :class="wrapperClass || 'group/desktop relative w-full h-[85%] my-auto rounded-xl border-2 border-neutral-800 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden'">
    <img
      :src="props.imgSrc"
      :alt="props.alt"
      width="1200"
      height="675"
      loading="lazy"
      decoding="async"
      :class="innerClass || 'absolute inset-0 w-full h-full object-cover object-left-top'"
    />
  </div>
</template>
