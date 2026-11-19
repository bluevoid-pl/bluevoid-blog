<script setup lang="ts">
import Container3D from '~/components/Container3D.vue'
</script>

<template>
  <div class="min-h-screen bg-background px-4 py-12">
    <div class="mx-auto max-w-6xl">
      <h1 class="text-3xl font-bold mb-6">Container3D Example</h1>
      <p class="text-muted-foreground mb-8">
        Move your mouse over the scene. Elements with <code>layer-1</code>, <code>layer-3</code>, <code>layer-5</code> etc. are placed at different Z depths and parallax with the container rotation.
      </p>

      <Container3D :max-tilt="10" :depth-step="20" class="h-[600px] w-full rounded-2xl border bg-zinc-950">
        <!-- Each layer has a fixed size and a colorful background -->
        <div class="layer-1 w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-30" />
        <div class="layer-2 w-40 h-40 left-20 top-24 bg-emerald-400 rounded-full" />
        <div class="layer-3 w-72 h-48 left-1/2 top-1/3 -translate-x-1/2 bg-white/10 rounded-2xl border border-white/10 p-8">
          <h2 class="text-2xl font-semibold mb-2 text-white">Layer 3</h2>
          <p class="text-sm text-white/70">Mid depth card with fixed size.</p>
        </div>
        <div class="layer-4 w-48 h-48 right-16 bottom-24 bg-pink-400/80 rounded-2xl rotate-12" />
        <div class="layer-5 w-80 h-56 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl shadow-2xl p-10">
          <h2 class="text-3xl font-bold mb-3 text-black">Layer 5</h2>
          <p class="text-black/80">Frontmost element with colorful background.</p>
        </div>
      </Container3D>

      <div class="mt-8 text-sm text-muted-foreground">
        Tip: add <code>layer-[number]</code> to any element inside <code>&lt;Container3D&gt;</code> to control its depth. Higher numbers = farther forward. All layers must have fixed size.
      </div>
    </div>
  </div>
</template>
