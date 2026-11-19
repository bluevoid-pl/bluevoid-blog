<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '~/components/ui/badge'

const props = withDefaults(defineProps<{
  date?: string | Date
  showNewBadge?: boolean
  readingTime?: number
}>(), {
  showNewBadge: true,
})

// One Intl.DateTimeFormat instance is reused; per the Intl guide, repeated
// formatting goes through the object form instead of creating one per call.
const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  return dateFormatter.format(new Date(props.date))
})

const isNewPost = computed(() => {
  if (!props.date) return false
  // Copy first, then roll the month back — no mutation of the live Date.
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return new Date(props.date) >= oneMonthAgo
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <time class="text-sm text-muted-foreground" :datetime="date">
      {{ formattedDate || '---' }}
    </time>
    <Badge v-if="showNewBadge && isNewPost" variant="default" class="text-[10px] font-bold uppercase tracking-wide">
      New
    </Badge>
  </div>
</template>
