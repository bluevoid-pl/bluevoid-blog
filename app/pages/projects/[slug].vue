<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const route = useRoute();

const { data: project } = await useAsyncData("projects-" + route.path, () => {
  return queryCollection("projects").path(route.path).first();
});

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

const readingTime = computed(() => {
  const body = project.value?.bodyPlain || "";
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
});
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <header class="pb-6">
      <div class="flex gap-4 items-center mb-4">
        <time class="text-sm text-slate-500 font-medium" :datetime="project.date">
          {{
            new Date(project.date).toLocaleDateString("pl-PL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
        </time>
        <span class="text-sm text-slate-500">{{ readingTime }} min read</span>
        <span v-if="project.client" class="text-sm text-sky-300 font-medium">{{ project.client }}</span>
      </div>
      <h1 class="text-3xl font-extrabold text-slate-100 mb-3">{{ project.title }}</h1>
      <p class="text-base text-slate-400 leading-relaxed mb-4">{{ project.description }}</p>
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in project.tags" :key="tag" class="text-xs text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-md">{{ tag }}</span>
      </div>
    </header>

    <hr class="border-t border-white/10 my-8" />

    <div class="prose prose-invert max-w-none">
      <ContentRenderer v-if="project" :value="project" />
    </div>
  </div>
</template>
