<script setup lang="ts">
definePageMeta({
  layout: "default",
});

import ArticleHeader from '~/components/ArticleHeader.vue'
import BlogSidebar from '~/components/BlogSidebar.vue'

const route = useRoute();

const { data: page } = await useAsyncData("page-about", () => {
  return queryCollection("content").path("/about").first();
});

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useHead(() => ({
  title: page.value?.title
}));
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <div class="flex gap-8 items-start">
      <div class="flex-1">
        <ArticleHeader :item="page" />

        <hr class="border-t border-white/10 my-8" />

        <div class="typeset typeset-docs">
          <ContentRenderer v-if="page" :value="page" />
        </div>
      </div>
      <BlogSidebar :body="page?.body" />
    </div>
  </div>
</template>
