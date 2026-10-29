<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { data: posts } = await useAsyncData('blog-posts', () => {
  return queryCollection('blog').all()
})

function formatDate(d: any): string {
  return new Date(d).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
}

function isNew(d: any): boolean {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return new Date(d) >= oneMonthAgo
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <header class="text-center pb-8">
      <h1 class="text-4xl font-extrabold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent mb-3">Blog</h1>
      <p class="text-lg text-slate-400">Notes on databases, programming, and exam preparation.</p>
    </header>

    <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <a
        v-for="post in posts"
        :key="post.path"
        :href="post.path"
        class="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-sky-500/40 transition"
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <time class="text-xs text-slate-500 font-medium" :datetime="post.date">{{ formatDate(post.date) }}</time>
            <span v-if="isNew(post.date)" class="text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">New</span>
          </div>
          <h2 class="text-xl font-bold text-slate-100">{{ post.title }}</h2>
          <p class="text-sm text-slate-400 leading-relaxed">{{ post.description }}</p>
          <div class="flex flex-wrap gap-2 mt-1">
            <span v-for="tag in post.tags" :key="tag" class="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">{{ tag }}</span>
          </div>
        </div>
      </a>
    </section>
  </div>
</template>
