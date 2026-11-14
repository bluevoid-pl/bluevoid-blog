<script setup lang="ts">
import { Badge, type BadgeVariants } from '~/components/ui/badge'

const props = defineProps<{
  tags?: string[]
  variant?: BadgeVariants["variant"]
  language?: string
}>()
</script>

<template>
  <div v-if="tags && tags.length" class="flex flex-wrap gap-2 items-center">
    <Badge v-if="language !== 'en'" :variant="variant" class="text-xs flex items-center gap-1 px-2">
      <img src="/PL.svg" alt="PL" class="h-3 w-3 flex-shrink-0" />
      PL
    </Badge>
    <Badge v-for="tag in tags" :key="tag" :variant="variant" class="text-xs">
      {{ tag }}
    </Badge>
  </div>
</template>
