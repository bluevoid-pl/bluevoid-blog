<script setup lang="ts">
import TagList from '~/components/TagList.vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

const props = defineProps<{
  item?: {
    title?: string
    description?: string
    tags?: string[]
    path?: string
    img?: string
  }
  fallbackTitle?: string
  fallbackDescription?: string
}>()

const title = props.item?.title ?? props.fallbackTitle ?? 'Showcase'
const description = props.item?.description ?? props.fallbackDescription ?? ''
</script>

<template>
  <Card class="relative overflow-hidden rounded-3xl p-8 bg-card border border-border">
    <CardContent class="p-0">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div class="flex flex-col gap-3">
          <h2 class="text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 dark:from-cyan-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
            {{ title }}
          </h2>
          <p v-if="description" class="text-base text-muted-foreground leading-relaxed">{{ description }}</p>
          <TagList v-if="item?.tags" :tags="item.tags" variant="default" />
          <Button v-if="item?.path" as="a" :href="item.path" variant="outline" class="mt-2">
            View project
          </Button>
        </div>
        <div class="relative overflow-hidden rounded-xl min-h-64">
          <img
            v-if="item?.img"
            :src="item.img"
            :alt="title"
            class="w-full h-full object-cover object-left-center"
          />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
