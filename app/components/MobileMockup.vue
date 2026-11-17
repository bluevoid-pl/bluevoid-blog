<script setup lang="ts">
const props = defineProps<{
  imgSrc?: string
  alt?: string
  class?: string
  innerClass?: string
}>()
</script>

<template>
  <div :class="['relative w-[180px] aspect-[9/19.5] rounded-[1.2rem] p-[3px] mockup-aluminum overflow-hidden', props.class]">
    <div :class="innerClass ?? 'relative w-full h-full overflow-hidden rounded-[1rem]'">
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
