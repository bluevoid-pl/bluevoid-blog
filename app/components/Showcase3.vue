<script setup lang="ts">
import TagList from '~/components/TagList.vue'
import MobileMockup from '~/components/MobileMockup.vue'
import DesktopMockup from '~/components/DesktopMockup.vue'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription } from '~/components/ui/card'

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
  <Card class="relative flex flex-col md:flex-row">
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

    <div class="w-full md:w-1/2 order-0 md:order-1 pr-3">
      <div v-if="item?.img" class="relative w-full aspect-[16/9]">
        <DesktopMockup :img-src="item.img" :alt="title" />

        <div class="absolute -top-10 right-8 z-50">
          <MobileMockup :img-src="item.img" :alt="title" />
        </div>
      </div>
      <div v-else class="w-full h-48 flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    </div>
  </Card>
</template>
