<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { data: posts } = await useAsyncData('blog-posts', () => {
  return queryCollection('blog').all()
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <header class="text-center pb-8">
      <h1 class="text-4xl font-extrabold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent mb-3">Blog</h1>
      <p class="text-lg text-slate-400">Notes on databases, programming, and exam preparation.</p>
    </header>

    <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <ArticlePreview
        v-for="post in posts"
        :key="post.path"
        :item="post"
        size="default"
        show-date
        show-new-badge
      />
    </section>
  </div>
</template>
