<script setup lang="ts">
import { computed } from 'vue'
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Blog'
})

const { data: posts } = await useAsyncData('blog-posts', () => {
  return queryCollection('blog').all()
})

const filteredPosts = computed(() => {
  return (posts.value ?? []).filter((post: any) => post.enabled !== false)
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <header class="text-center pb-8">
      <h1 class="text-4xl font-bold tracking-tight mb-3">Blog</h1>
      <p class="text-lg">Notes on databases, programming, and exam preparation.</p>
    </header>

    <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <ArticlePreview
        v-for="post in filteredPosts"
        :key="post.path"
        :item="post"
        size="default"
        show-date
        show-new-badge
      />
    </section>
  </div>
</template>
