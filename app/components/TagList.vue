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
    <!-- Flag is decorative: the "PL" text label already conveys it. -->
    <Badge v-if="language === 'pl'" :variant="variant" class="flex items-center gap-1 px-2 text-xs">
      <img src="/PL.svg" alt="" width="12" height="12" class="h-3 w-3 shrink-0" />
      PL
    </Badge>
    <Badge v-for="tag in tags" :key="tag" :variant="variant" class="text-xs">
      {{ tag }}
    </Badge>
  </div>
</template>
