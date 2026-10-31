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
</script>

<template>
  <a :href="item.path" class="block">
    <Card>
      <CardContent>
        <div class="flex flex-col gap-2">
          <DateMeta v-if="showDate" :date="item.date" :showNewBadge="showNewBadge" />
          <CardTitle>{{ item.title }}</CardTitle>
          <CardDescription v-if="item.description">{{ item.description }}</CardDescription>
          <TagList :tags="item.tags" variant="default" />
        </div>
      </CardContent>
    </Card>
  </a>
</template>
