<script setup lang="ts">
import { Badge, type BadgeVariants } from '~/components/ui/badge'

const props = defineProps<{
  tags?: string[]
  variant?: BadgeVariants["variant"]
}>()
</script>

<template>
  <div v-if="tags && tags.length" class="flex flex-wrap gap-2">
    <Badge v-for="tag in tags" :key="tag" :variant="variant" class="text-xs">
      {{ tag }}
    </Badge>
  </div>
</template>
