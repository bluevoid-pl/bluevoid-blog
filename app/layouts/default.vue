<template>
  <div class="app-layout">
    <Navbar />
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/Navbar.vue'
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 68px);
}
</style>
