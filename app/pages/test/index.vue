<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Tests'
})

const modules = import.meta.glob('~/pages/test/*.vue', { eager: true })

type Module = { default: import('vue').Component }

const pages = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/index.vue'))
  .map(([path]) => {
    const file = path.split('/').pop() ?? ''
    const name = file.replace(/\.vue$/, '')
    const to = `/test/${name}`
    const title = name
      .split(/[-_]/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return { to, title, name }
  })
  .sort((a, b) => a.name.localeCompare(b.name))
</script>

<template>
  <div class="container mx-auto max-w-7xl px-4 py-8">
    <h1 class="text-3xl font-bold tracking-tight mb-6">Tests</h1>
    <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <li v-for="page in pages" :key="page.to">
        <a
          :href="page.to"
          class="block rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
        >
          {{ page.title }}
        </a>
      </li>
    </ul>
    <div v-if="pages.length === 0" class="mt-8">
      No test pages found.
    </div>
  </div>
</template>
