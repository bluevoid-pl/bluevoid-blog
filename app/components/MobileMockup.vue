<script setup lang="ts">
const props = defineProps<{
  imgSrc?: string
  alt?: string
  class?: string
  innerClass?: string
}>()
</script>

<template>
  <div :class="['relative w-[180px] aspect-[9/19.5]', props.class]">
    <!-- Device chrome is rendered at 2x and scaled back to half so the rounded
         corners rasterize at double detail; this removes the stair-stepping the
         thin bezel shows on 1x displays. All fixed sizes inside are doubled to
         compensate for the 0.5 scale. -->
    <div class="absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-[0.5]">
      <div class="relative h-full w-full rounded-[2.4rem] p-[6px] mockup-aluminum overflow-hidden">
        <div :class="innerClass ?? 'relative h-full w-full overflow-hidden rounded-[calc(2.4rem-6px)] border-4 border-[#010101]'">
          <img
            v-if="imgSrc"
            :src="imgSrc"
            :alt="alt ?? ''"
            class="h-full w-full object-cover"
          />
          <!-- Mobile status bar -->
          <div class="absolute top-0 left-0 right-0 z-40 flex h-8 items-center justify-between bg-black px-4 text-[15px] text-white">
            <span>12:34</span>
            <div class="flex items-center gap-1">
              <div class="relative h-3.5 w-7 rounded-[2px] border border-white/60">
                <div class="absolute inset-[1.5px] w-[70%] rounded-[1px] bg-white/80" />
                <div class="absolute -right-[2px] top-1/2 h-[55%] w-[2px] -translate-y-1/2 rounded-[1px] bg-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
