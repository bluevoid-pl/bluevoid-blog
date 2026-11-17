<script setup lang="ts">
import { IconArrowRight, IconPhotoOff } from '@tabler/icons-vue'
import TagList from '~/components/TagList.vue'
import DesktopMockup from '~/components/DesktopMockup.vue'
import MobileMockup from '~/components/MobileMockup.vue'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'

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
  <Card
    class="relative flex flex-col gap-0 overflow-hidden py-0 transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-lg md:flex-row"
  >
    <div class="order-1 flex w-full flex-col md:order-none md:w-[46%]">
      <CardHeader class="gap-3 p-6 sm:p-8 lg:p-10">
        <CardTitle
          class="text-3xl font-extrabold leading-tight tracking-tight text-transparent md:text-4xl bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text dark:from-cyan-300 dark:via-purple-300 dark:to-pink-300"
        >
          {{ title }}
        </CardTitle>

        <CardDescription v-if="description" class="text-base leading-relaxed md:text-lg">
          {{ description }}
        </CardDescription>
      </CardHeader>

      <CardContent v-if="item?.tags?.length" class="px-6 sm:px-8 lg:px-10">
        <TagList :tags="item.tags" variant="secondary" />
      </CardContent>

      <CardFooter v-if="item?.path" class="mt-auto p-6 sm:p-8 lg:p-10">
        <Button as-child variant="outline">
          <NuxtLink :href="item.path">
            Read article
            <IconArrowRight />
          </NuxtLink>
        </Button>
      </CardFooter>
    </div>

    <div class="relative order-first w-full md:order-none md:w-[54%]">
      <div v-if="item?.img" class="relative min-h-[230px] w-full sm:min-h-[290px] md:min-h-[440px] lg:min-h-[480px]">
        <DesktopMockup
          :img-src="item.img"
          :alt="title"
          wrapper-class="absolute inset-x-4 top-4 bottom-4 overflow-hidden rounded-xl border-2 border-neutral-800 bg-neutral-900 shadow-[0_18px_50px_rgba(0,0,0,0.45)] sm:inset-x-6 md:inset-x-8"
        />

        <div class="absolute bottom-8 right-5 z-20 hidden opacity-100 transition-opacity duration-300 ease-out hover:opacity-0 md:block md:right-8 lg:right-12">
          <MobileMockup :img-src="item.img" :alt="title" />
        </div>
      </div>

      <div v-else class="flex min-h-[230px] flex-col items-center justify-center gap-3 p-8 text-muted-foreground sm:min-h-[290px] md:min-h-[440px]">
        <div class="flex size-14 items-center justify-center rounded-full border border-dashed">
          <IconPhotoOff class="size-6 opacity-60" />
        </div>
        <p class="text-sm">No preview available</p>
      </div>
    </div>
  </Card>
</template>
