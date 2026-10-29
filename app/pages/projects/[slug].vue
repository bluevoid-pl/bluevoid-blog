<script setup lang="ts">
definePageMeta({
  layout: "default",
});

import ArticleHeader from '~/components/ArticleHeader.vue'

const route = useRoute();

const { data: project } = await useAsyncData("projects-" + route.path, () => {
  return queryCollection("projects").path(route.path).first();
});

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <ArticleHeader :item="project" :showNewBadge="false" :showClient="true" />

    <hr class="border-t border-white/10 my-8" />

    <div class="prose prose-invert max-w-none">
      <ContentRenderer v-if="project" :value="project" />
    </div>
  </div>
</template>
