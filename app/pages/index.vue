<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Home'
})

import Showcase from '~/components/Showcase.vue'

const { data: landing } = await useAsyncData('landing', async () => {
  const list = await queryCollection('blog')
    .select('path', 'title', 'description', 'date', 'tags', 'img', 'enabled')
    .order('date', 'DESC')
    .all()
  const filteredList = list.filter((post: any) => post.enabled !== false)
  const uniqueTags = [...new Set(filteredList.flatMap((post: any) => post.tags ?? []))]

  const projects = await queryCollection('projects')
    .select('path', 'title', 'description', 'date', 'tags', 'img', 'enabled')
    .all()
  const filteredProjects = projects.filter((p: any) => p.enabled !== false)
  const erp = filteredProjects.find((p: any) => p.path?.toLowerCase() === '/projects/erp' || p.title === 'ERP - webapp') ?? filteredProjects[0]

  const aiArticles = filteredList.filter((post: any) => {
    const tags = post.tags ?? []
    return tags.includes('Model') || tags.includes('GGUF')
  })
  const aiSlots = Array.from({ length: 3 }, (_, i) => aiArticles[i] ?? null)

  return {
    latest: filteredList[0],
    featured: filteredList.slice(0, 3),
    count: filteredList.length,
    tags: uniqueTags.slice(0, 8),
    erp,
    aiSlots
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
    <Showcase :item="landing.erp" fallback-title="ERP - webapp" fallback-description="System zażądania drukarni koszulek." />

    <section id="ai-models" class="flex flex-col gap-4 sm:gap-6">
      <h2 class="text-xl font-bold">AI model articles</h2>
      <div class="grid md:grid-cols-3 gap-4 sm:gap-5">
        <template v-for="(slot, i) in landing.aiSlots" :key="i">
          <ArticlePreview
            v-if="slot"
            :item="slot"
            size="compact"
            :show-date="false"
            :show-new-badge="false"
          />
          <div v-else class="block bg-white/2 border-dashed border-white/20 rounded-2xl p-4 sm:p-5">
            <div class="flex flex-col gap-2">
              <h3 class="text-lg font-bold">More coming soon</h3>
              <p class="text-sm leading-relaxed">Another AI model article will appear here shortly.</p>
            </div>
          </div>
        </template>
      </div>
    </section>

    <section id="latest" class="flex flex-col gap-4 sm:gap-6">
      <h2 class="text-xl font-bold">Latest from the blog</h2>
      <div class="grid md:grid-cols-3 gap-4 sm:gap-5">
        <ArticlePreview
          v-for="post in landing.featured"
          :key="post.path"
          :item="post"
          size="compact"
          show-date
          show-new-badge
        />
      </div>
    </section>

  </div>
</template>
