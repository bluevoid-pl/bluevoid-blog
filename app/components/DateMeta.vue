<script setup lang="ts">
import { Badge } from '~/components/ui/badge'

const props = defineProps<{
  date?: string | Date
  showNewBadge?: boolean
  showReadingTime?: boolean
  readingTime?: number
  client?: string
  showClient?: boolean
}>()

const showNewBadge = props.showNewBadge ?? true
const showReadingTime = props.showReadingTime ?? true
const showClient = props.showClient ?? false

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
    <time v-if="date" class="text-sm text-slate-500 font-medium" :datetime="date">
      {{ formatDate(date) }}
    </time>
    <Badge v-if="showNewBadge && isNew(date)" variant="default" class="text-[10px] font-bold uppercase tracking-wide">
      New
    </Badge>
    <span v-if="showReadingTime && readingTime !== undefined" class="text-sm text-slate-500">{{ readingTime }} min read</span>
    <span v-if="showClient && client" class="text-sm text-sky-300 font-medium">{{ client }}</span>
  </div>
</template>
