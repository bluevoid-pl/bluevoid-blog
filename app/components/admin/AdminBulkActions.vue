<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{
  selectedCount: number
}>()

const emit = defineEmits<{
  'bulk-action': [action: string]
  'clear': []
}>()
</script>

<template>
  <div v-if="selectedCount > 0" class="flex items-center justify-between p-3 bg-muted/50 rounded-md border mb-4">
    <div class="text-sm font-medium">
      {{ selectedCount }} item(s) selected
    </div>
    <div class="flex items-center gap-2">
      <slot />
      <Button variant="ghost" size="sm" @click="emit('clear')">Clear selection</Button>
    </div>
  </div>
</template>
