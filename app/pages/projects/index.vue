<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { data: projects } = await useAsyncData('projects-list', () => {
  return queryCollection('projects')
    .order('date', 'DESC')
    .all()
})

function formatDate(d: any): string {
  return new Date(d).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <header class="text-center pb-8">
      <h1 class="text-4xl font-extrabold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent mb-3">Projects</h1>
      <p class="text-lg text-slate-400">Games, apps and experiments built along the way.</p>
    </header>

    <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <a
        v-for="project in projects"
        :key="project.path"
        :href="project.path"
        class="block bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-sky-500/40 transition"
      >
        <div class="flex flex-col gap-2">
          <div class="flex items-center">
            <time class="text-xs text-slate-500 font-medium" :datetime="project.date">{{ formatDate(project.date) }}</time>
          </div>
          <h2 class="text-xl font-bold text-slate-100">{{ project.title }}</h2>
          <p class="text-sm text-slate-400 leading-relaxed">{{ project.description }}</p>
          <div class="flex flex-wrap gap-2 mt-1">
            <span v-for="tag in project.tags" :key="tag" class="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">{{ tag }}</span>
          </div>
        </div>
      </a>
    </section>
  </div>
</template>
