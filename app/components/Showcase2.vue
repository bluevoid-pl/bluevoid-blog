<script setup lang="ts">
import TagList from '~/components/TagList.vue'
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
        Read article
      </Button>
    </CardContent>

    <div class="w-full md:w-1/2 order-0 md:order-1 pr-3">
      <div v-if="item?.img" class="relative w-full aspect-[16/9]">
        <!-- Desktop mockup - full width of image area -->
        <div class="group/desktop relative w-full h-full rounded-xl border-2 border-neutral-800 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden pt-8 transition-transform duration-300 ease-out hover:scale-[1.2]">
          <div class="absolute inset-y-0 left-0 w-1/2 z-10"></div>
          <div class="absolute top-0 left-0 right-0 h-4 bg-neutral-800 flex items-center justify-end pr-3">
            <div class="flex items-center gap-1.5">
              <span class="size-2 rounded-full bg-green-500/80"></span>
              <span class="size-2 rounded-full bg-yellow-500/80"></span>
              <span class="size-2 rounded-full bg-red-500/80"></span>
            </div>
          </div>
          <img
            :src="item.img"
            :alt="title"
            class="absolute top-8 left-0 right-0 bottom-0 w-full h-full object-cover object-left-top"
          />
        </div>

        <!-- Mobile mockup wrapper for hover bridge -->
        <div class="group">
          <!-- Mobile mockup - on top of desktop -->
          <div class="absolute -top-10 right-8 z-90 w-[180px] aspect-[9/19.5] rounded-[1.2rem] border-[4px] border-zinc-500 bg-gradient-to-b from-zinc-100 via-zinc-300 to-zinc-500 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-300 ease-out group-hover:scale-[1.3] group-hover:left-1/2 group-hover:top-[40%] group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:right-auto">
            <!-- Mobile status bar -->
            <div class="absolute top-0 left-0 right-0 h-6 bg-black text-white text-[9px] flex items-center justify-between px-3 z-20">
              <span>12:34</span>
              <div class="flex items-center gap-1">
                <div class="w-5 h-2.5 border border-white/60 rounded-[2px] relative">
                  <div class="absolute inset-[1px] bg-white/80 rounded-[1px] w-[70%]" />
                  <div class="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-[60%] bg-white/60 rounded-[1px]" />
                </div>
              </div>
            </div>
            <img
              :src="item.img"
              :alt="title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Mobile pseudo element - transparent hover bridge to prevent flicker -->
          <div class="absolute -top-10 right-8 w-[180px] aspect-[9/19.5] rounded-[1.2rem] bg-transparent pointer-events-auto border border-dashed border-white/10"></div>
        </div>
      </div>
      <div v-else class="w-full h-48 flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    </div>
  </Card>
</template>
