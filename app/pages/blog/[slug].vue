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

if (post.value.enabled === false) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

useHead(() => ({
  title: post.value?.title,
  meta: [
    { name: 'description', content: post.value?.description ?? '' },
    { name: 'enabled', content: String(post.value?.enabled ?? true) }
  ]
}));
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="flex gap-8 items-start">
      <div class="flex flex-col gap-8 max-w-4xl">
        <ArticleHeader :item="post" />

        <hr class="border-t border-white/10" />

        <div class="typeset typeset-blog mx-auto w-full">
          <ContentRenderer v-if="post" :value="post" />
        </div>
      </div>
      <BlogSidebar :body="post.body" class="w-56" />
    </div>
  </div>
</template>
