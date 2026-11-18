<script setup lang="ts">
defineProps<{
  output: string
}>()
</script>

<template>
  <div class="h-full border rounded bg-gray-900 text-green-400 font-mono text-sm overflow-auto p-3 whitespace-pre-wrap break-words">
    {{ output }}
  </div>
</template>
