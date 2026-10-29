<script setup lang="ts">
import TagList from '~/components/TagList.vue'
import DateMeta from '~/components/DateMeta.vue'

const props = defineProps<{
  item: {
    title: string
    description?: string
    date?: string | Date
    tags?: string[]
    client?: string
    bodyPlain?: string
  }
  showNewBadge?: boolean
  showReadingTime?: boolean
  showClient?: boolean
}>()

const showNewBadge = props.showNewBadge ?? true
const showReadingTime = props.showReadingTime ?? true
const showClient = props.showClient ?? false

const readingTime = computed(() => {
  const body = props.item.bodyPlain || ''
  const words = body.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
})
</script>

<template>
  <header class="pb-6 space-y-4">
    <DateMeta
      :date="item.date"
      :showNewBadge="showNewBadge"
      :showReadingTime="showReadingTime"
      :readingTime="readingTime"
      :client="item.client"
      :showClient="showClient"
    />
    <h1 class="text-3xl font-bold tracking-tight">{{ item.title }}</h1>
    <p v-if="item.description" class="text-base text-muted-foreground leading-relaxed">{{ item.description }}</p>
    <TagList :tags="item.tags" variant="detail" />
  </header>
</template>
