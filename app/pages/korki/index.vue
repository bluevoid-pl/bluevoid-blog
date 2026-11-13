<script setup lang="ts">
import { IconPinned } from '@tabler/icons-vue'
import { computed } from 'vue'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Korki'
})

const pinnedPages = [
  {
    title: 'Matura checklista',
    description: 'Interaktywna checklista arkuszów egzaminacyjnych do matury',
    path: '/korki/matura_checklist',
    pinned: true,
  },
]

const { data: articles } = await useAsyncData('korki-articles', () => {
  return queryCollection('content').all()
})

const enabledArticles = computed(() => {
  return (articles.value ?? [])
    .filter((item: any) => {
      const p = item._path || item.path || ''
      return typeof p === 'string' && p.includes('korki/')
    })
    .map((item: any) => {
      let meta = {}
      if (item.meta) {
        if (typeof item.meta === 'string') {
          try { meta = JSON.parse(item.meta) } catch { meta = {} }
        } else if (typeof item.meta === 'object') {
          meta = item.meta
        }
      }
      const urlPath = item.path || (item._path ? item._path.replace(/^content\//, '/') : '')
      return {
        ...item,
        title: item.title,
        description: item.description,
        date: item.date || meta.date,
        tags: item.tags || meta.tags,
        img: item.img || meta.img,
        enabled: item.enabled ?? meta.enabled,
        path: urlPath,
      }
    })
    .filter((item: any) => item.enabled !== false)
    .sort((a: any, b: any) => {
      const da = new Date(a.date || 0).getTime()
      const db = new Date(b.date || 0).getTime()
      return db - da
    })
})

const items = computed(() => {
  const pinned = pinnedPages.map(p => ({ ...p, pinned: true }))
  const rest = enabledArticles.value.map(a => ({ ...a, pinned: false }))
  return [...pinned, ...rest]
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <header class="text-center pb-8">
      <div class="flex items-center justify-center gap-3 mb-3">
        <img src="/PL.svg" alt="PL" class="h-6 w-6" />
        <h1 class="text-4xl font-bold tracking-tight">Korki</h1>
      </div>
      <p class="text-lg">Materiały do nauki i przygotowań egzaminacyjnych.</p>
    </header>

    <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in items" :key="item.path" class="relative">
        <ArticlePreview
          :item="item"
          size="default"
          show-date
          :show-new-badge="!item.pinned"
        />
        <IconPinned v-if="item.pinned" class="size-5 absolute top-3 right-3 text-muted-foreground" />
      </div>
    </section>
  </div>
</template>
