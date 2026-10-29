<script setup lang="ts">
import { Badge } from '~/components/ui/badge'

const props = defineProps<{
  tags?: string[]
  variant?: 'default' | 'detail'
}>()

const variant = props.variant ?? 'default'

const badgeVariant = variant === 'detail' ? 'outline' : 'secondary'
</script>

<template>
  <div v-if="tags && tags.length" class="flex flex-wrap gap-2">
    <Badge v-for="tag in tags" :key="tag" :variant="badgeVariant" class="text-xs">
      {{ tag }}
    </Badge>
  </div>
</template>
