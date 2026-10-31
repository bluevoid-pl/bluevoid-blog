<script setup lang="ts">
import { Badge } from '~/components/ui/badge'

const props = defineProps<{
  date?: string | Date
  showNewBadge?: boolean
  readingTime?: number
}>()

const showNewBadge = props.showNewBadge ?? true

function formatDate(d: any): string {
  if (!d) return ''
  return new Date(d).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
}

function isNew(d: any): boolean {
  if (!d) return false
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return new Date(d) >= oneMonthAgo
}
</script>

<template>
  <div class="flex flex-wrap gap-4 items-center">
    <time class="text-sm text-muted-foreground" :datetime="date">
      {{ date ? formatDate(date) : '---' }}
    </time>
    <Badge v-if="showNewBadge && isNew(date)" variant="default" class="text-[10px] font-bold uppercase tracking-wide">
      New
    </Badge>
  </div>
</template>
