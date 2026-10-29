<script setup lang="ts">
import TagList from '~/components/TagList.vue'
import DateMeta from '~/components/DateMeta.vue'
import { Card, CardContent, CardTitle,CardDescription } from '~/components/ui/card'

const props = defineProps<{
  item: {
    title: string
    description?: string
    date?: string | Date
    tags?: string[]
    path: string
    img?: string
  }
  showDate?: boolean
  showNewBadge?: boolean
  size?: 'default' | 'compact'
}>()

const showDate = props.showDate ?? true
const showNewBadge = props.showNewBadge ?? true
const size = props.size ?? 'default'

const cardClass = size === 'compact'
  ? 'bg-background/50 border border-border rounded-2xl p-5 hover:bg-accent/50 transition'
  : 'bg-background/50 border border-border rounded-2xl p-6 hover:bg-accent/50 transition'

const titleClass = size === 'compact' ? 'text-lg font-semibold' : 'text-xl font-semibold'
</script>

<template>
  <a :href="item.path" class="block">
    <Card :class="cardClass">
      <CardContent class="p-0">
        <div class="flex flex-col gap-2">
          <DateMeta v-if="showDate" :date="item.date" :showNewBadge="showNewBadge" />
          <CardTitle :class="[titleClass]">{{ item.title }}</CardTitle>
          <CardDescription v-if="item.description" class="text-sm text-muted-foreground leading-relaxed">{{ item.description }}</CardDescription>
          <TagList :tags="item.tags" variant="default" />
        </div>
      </CardContent>
    </Card>
  </a>
</template>
