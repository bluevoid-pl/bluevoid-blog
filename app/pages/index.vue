<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { data: landing } = await useAsyncData('landing', async () => {
  const list = await queryCollection('blog')
    .select('path', 'title', 'description', 'date', 'tags')
    .order('date', 'DESC')
    .all()
  const uniqueTags = [...new Set(list.flatMap((post: any) => post.tags ?? []))]

  const projects = await queryCollection('projects')
    .select('path', 'title', 'description', 'date', 'tags', 'img')
    .all()
  const erp = projects.find((p: any) => p.path?.toLowerCase() === '/projects/erp' || p.title === 'ERP - webapp') ?? projects[0]

  const aiArticles = list.filter((post: any) => {
    const tags = post.tags ?? []
    return tags.includes('Model') || tags.includes('GGUF')
  })
  const aiSlots = Array.from({ length: 3 }, (_, i) => aiArticles[i] ?? null)

  return {
    latest: list[0],
    featured: list.slice(0, 3),
    count: list.length,
    tags: uniqueTags.slice(0, 8),
    erp,
    aiSlots
  }
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
  <div class="max-w-6xl mx-auto px-6 py-12 space-y-12">
    <section id="showcase" class="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent border border-white/10">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div class="flex flex-col gap-3">
          <h2 class="text-3xl md:text-4xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {{ landing.erp?.title ?? 'ERP - webapp' }}
          </h2>
          <p class="text-base text-slate-300 leading-relaxed">{{ landing.erp?.description ?? 'System zażądania drukarni koszulek.' }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in (landing.erp?.tags ?? [])" :key="tag" class="text-xs text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">{{ tag }}</span>
          </div>
          <a v-if="landing.erp" :href="landing.erp.path" class="inline-block px-4 py-2 rounded-xl font-semibold bg-white/5 border border-white/12 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/50 transition">View project</a>
        </div>
        <div class="relative overflow-hidden rounded-xl min-h-64">
          <img
            v-if="landing.erp?.img"
            :src="landing.erp.img"
            :alt="landing.erp.title"
            class="w-full h-full object-cover object-left-center"
          />
        </div>
      </div>
    </section>

    <section id="ai-models" class="flex flex-col gap-6">
      <h2 class="text-xl font-bold text-slate-200">AI model articles</h2>
      <div class="grid md:grid-cols-3 gap-5">
        <template v-for="(slot, i) in landing.aiSlots" :key="i">
          <a
            v-if="slot"
            :href="slot.path"
            class="block bg-white/5 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition"
          >
            <div class="flex flex-col gap-2">
              <h3 class="text-lg font-bold text-slate-100">{{ slot.title }}</h3>
              <p class="text-sm text-slate-400 leading-relaxed">{{ slot.description }}</p>
              <div class="flex flex-wrap gap-2 mt-1">
                <span v-for="tag in (slot.tags ?? [])" :key="tag" class="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">{{ tag }}</span>
              </div>
            </div>
          </a>
          <div v-else class="block bg-white/2 border-dashed border-white/20 rounded-2xl p-5">
            <div class="flex flex-col gap-2">
              <h3 class="text-lg font-bold text-slate-100">More coming soon</h3>
              <p class="text-sm text-slate-400 leading-relaxed">Another AI model article will appear here shortly.</p>
            </div>
          </div>
        </template>
      </div>
    </section>

    <section id="latest" class="flex flex-col gap-6">
      <h2 class="text-xl font-bold text-slate-200">Latest from the blog</h2>
      <div class="grid md:grid-cols-3 gap-5">
        <a
          v-for="post in landing.featured"
          :key="post.path"
          :href="post.path"
          class="block bg-white/5 border border-white/10 rounded-2xl p-5 hover:-translate-y-1 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition"
        >
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-3">
              <time class="text-xs text-slate-500 font-medium" :datetime="post.date">{{ formatDate(post.date) }}</time>
              <span v-if="isNew(post.date)" class="text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">New</span>
            </div>
            <h3 class="text-lg font-bold text-slate-100">{{ post.title }}</h3>
            <p class="text-sm text-slate-400 leading-relaxed">{{ post.description }}</p>
            <div class="flex flex-wrap gap-2 mt-1">
              <span v-for="tag in post.tags" :key="tag" class="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">{{ tag }}</span>
            </div>
          </div>
        </a>
      </div>
    </section>

    <section id="topics" class="flex flex-col gap-6">
      <h2 class="text-xl font-bold text-slate-200">Topics covered</h2>
      <div class="flex flex-wrap gap-3">
        <span v-for="tag in landing.tags" :key="tag" class="text-sm text-slate-300 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 px-3 py-1.5 rounded-full">{{ tag }}</span>
      </div>
      <a href="/blog" class="inline-block px-4 py-2 rounded-xl font-semibold bg-white/5 border border-white/12 text-slate-300 hover:bg-cyan-500/15 hover:border-cyan-500/50 transition">See every post</a>
    </section>
  </div>
</template>
