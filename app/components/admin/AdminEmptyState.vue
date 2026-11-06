<script setup lang="ts">
import { Empty } from '@/components/ui/empty'

defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <Empty>
    <template #title>{{ title || 'No items found' }}</template>
    <template #description>{{ description || 'Try adjusting filters or create a new item.' }}</template>
  </Empty>
</template>
