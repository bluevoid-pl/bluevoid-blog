<script setup lang="ts">
import TagList from '~/components/TagList.vue'
import DateMeta from '~/components/DateMeta.vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { computed } from 'vue'

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

const truncatedDescription = computed(() => {
  const desc = props.item.description
  if (!desc) return ''
  return desc.length <= 50 ? desc : desc.slice(0, 50).trim() + '...'
})
</script>

<template>
  <Button as="a" :href="item.path" variant="outline" class="block h-full p-0 hover:shadow-lg transition-shadow rounded-xl min-w-0">
    <Card class="h-full pt-0 rounded-none bg-transparent min-w-0">
      <img
        v-if="item.img"
        :src="item.img"
        :alt="item.title"
        :class="['w-full object-cover', size === 'compact' ? 'h-32' : 'h-40']"
        loading="lazy"
      />
      <CardHeader class="flex flex-col gap-1.5">
        <div class="flex items-center gap-2 mb-2 min-w-0">
          <DateMeta v-if="showDate" :date="item.date" :showNewBadge="showNewBadge" />
        </div>
        <CardTitle class="text-xl hyphens-auto w-full whitespace-break-spaces" style="overflow-wrap: anywhere; word-break: break-word; hyphens: auto;">{{ item.title }}</CardTitle>
        <div class="flex flex-wrap gap-1.5 min-w-0">
          <TagList v-if="item.tags" :tags="item.tags" variant="secondary" />
        </div>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <CardDescription v-if="item.description" class="hyphens-auto w-full whitespace-break-spaces" style="overflow-wrap: anywhere; word-break: break-word; hyphens: auto;">{{ truncatedDescription }}</CardDescription>
      </CardContent>
    </Card>
  </Button>
</template>

<style scoped>
:deep(*) {
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}
</style>
