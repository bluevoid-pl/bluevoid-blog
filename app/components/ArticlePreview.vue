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
    language?: string
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
  <Button as="a" :href="item.path" variant="outline" class="block h-full min-w-0 rounded-xl p-0 transition-shadow hover:shadow-lg">
    <Card class="h-full min-w-0 rounded-none bg-transparent pt-0">
      <!-- Explicit width/height reserve the aspect ratio while the remote image loads (avoids layout shift). -->
      <img
        v-if="item.img"
        :src="item.img"
        :alt="item.title"
        :class="['w-full object-cover', size === 'compact' ? 'h-32' : 'h-40']"
        width="1600"
        height="900"
        loading="lazy"
        decoding="async"
      />
      <CardHeader class="flex flex-col gap-1.5">
        <div class="mb-2 flex min-w-0 items-center gap-2">
          <DateMeta v-if="showDate" :date="item.date" :show-new-badge="showNewBadge" />
        </div>
        <CardTitle class="w-full min-w-0 break-words [text-wrap:balance]">{{ item.title }}</CardTitle>
        <div class="flex min-w-0 flex-wrap gap-1.5">
          <TagList v-if="item.tags" :tags="item.tags" :language="item.language" variant="secondary" />
        </div>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <!-- break-words contains long URLs; line-clamp-3 limits the blurb to three lines (CSS over JS truncation). -->
        <CardDescription v-if="item.description" class="line-clamp-3 w-full min-w-0 break-words [text-wrap:pretty]">{{ item.description }}</CardDescription>
      </CardContent>
    </Card>
  </Button>
</template>
