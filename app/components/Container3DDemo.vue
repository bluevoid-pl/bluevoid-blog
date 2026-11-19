<script setup lang="ts">
import Container3D from './Container3D.vue'
</script>

<template>
  <Container3D :max-tilt="10" :depth-step="50" class="h-[600px] w-full relative overflow-hidden">
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="layer-1 p-8 bg-white/10 backdrop-blur rounded-xl">Layer 1</div>
      <div class="layer-3 p-8 bg-white/20 backdrop-blur rounded-xl">Layer 3</div>
      <div class="layer-5 p-8 bg-white/30 backdrop-blur rounded-xl">Layer 5</div>
    </div>
  </Container3D>
</template>
