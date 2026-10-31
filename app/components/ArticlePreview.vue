<script setup lang="ts">
import TagList from '~/components/TagList.vue'
import DateMeta from '~/components/DateMeta.vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

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
  <Button as="a" :href="item.path" variant="outline" class="block h-full p-0 hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
    <Card class="h-full overflow-hidden pt-0 rounded-none bg-transparent">
      <img
        v-if="item.img"
        :src="item.img"
        :alt="item.title"
        class="w-full h-40 object-cover"
        loading="lazy"
      />
      <CardHeader>
        <div class="flex items-center gap-2 mb-2">
          <DateMeta v-if="showDate" :date="item.date" :showNewBadge="showNewBadge" />
        </div>
        <CardTitle class="text-xl">{{ item.title }}</CardTitle>
        <div class="flex flex-wrap gap-1.5">
          <TagList v-if="item.tags" :tags="item.tags" variant="secondary" />
        </div>
      </CardHeader>
      <CardContent class="flex flex-col h-full">
        <div class="flex flex-col gap-2 flex-1">
          <CardDescription v-if="item.description" class="line-clamp-3 flex-1">{{ item.description }}</CardDescription>
        </div>
      </CardContent>
    </Card>
  </Button>
</template>
