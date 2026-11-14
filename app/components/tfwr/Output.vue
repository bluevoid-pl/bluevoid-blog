<script setup lang="ts">
const props = defineProps<{
  output: string
}>()
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-3">Output</h2>
    <div class="border rounded p-3 h-96 overflow-auto bg-gray-900 text-green-400 font-mono text-sm">
      {{ output }}
    </div>
  </div>
</template>
