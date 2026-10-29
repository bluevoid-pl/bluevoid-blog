<script setup lang="ts">
definePageMeta({
  layout: "default",
});

import ArticleHeader from '~/components/ArticleHeader.vue'

const route = useRoute();

const { data: post } = await useAsyncData("blog-" + route.path, () => {
  return queryCollection("blog").path(route.path).first();
});

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <div class="flex gap-8 items-start">
      <div class="flex-1">
        <ArticleHeader :item="post" />

        <hr class="border-t border-white/10 my-8" />

        <div class="prose prose-invert max-w-none">
          <ContentRenderer v-if="post" :value="post" />
        </div>
      </div>
      <BlogSidebar :body="post.body" />
    </div>
  </div>
</template>
