<script setup lang="ts">
import TagList from '~/components/TagList.vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader,CardDescription } from '~/components/ui/card'

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
  <Card class="relative md:overflow-hidden flex flex-col">
    <img
    v-if="item?.img"
    :src="item.img"
    :alt="title"
    class="md:absolute md:top-0 md:right-0 md:h-full md:w-1/2 md:object-cover md:mask-r-from-transparent md:mask-r-from-0 md:mask-r-to-10% md:mask-r-to-black w-full h-32 sm:h-48 object-cover order-last md:order-1 mt-4 md:mt-0 rounded-lg"
    />
    <CardContent class="flex flex-col z-10 gap-4 sm:gap-6 p-4 sm:p-6 w-full md:w-1/2 order-1 md:order-0">
        <CardHeader class="text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 dark:from-cyan-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent px-0">
          {{ title }}
        </CardHeader>
        <TagList v-if="item?.tags" :tags="item.tags" variant="secondary" />
        <CardDescription v-if="description" class="text-base text-muted-foreground leading-relaxed min-h-32">{{ description }}</CardDescription>
        <Button v-if="item?.path" as="a" :href="item.path" variant="outline" class="mt-4">
          Explore project
        </Button>
    </CardContent>

  </Card>
</template>
