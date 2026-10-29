<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const route = useRoute();

const { data: post } = await useAsyncData("blog-" + route.path, () => {
  return queryCollection("blog").path(route.path).first();
});

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

const readingTime = computed(() => {
  const body = post.value?.bodyPlain || "";
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
});

function isNew(d: any): boolean {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return new Date(d) >= oneMonthAgo;
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <div class="flex gap-8 items-start">
      <div class="flex-1">
        <header class="pb-6">
          <div class="flex gap-4 items-center mb-4">
            <time class="text-sm text-slate-500 font-medium" :datetime="post.date">
              {{
                new Date(post.date).toLocaleDateString("pl-PL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }}
            </time>
            <span v-if="isNew(post.date)" class="text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">New</span>
            <span class="text-sm text-slate-500">{{ readingTime }} min read</span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-100 mb-3">{{ post.title }}</h1>
          <p class="text-base text-slate-400 leading-relaxed mb-4">{{ post.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in post.tags" :key="tag" class="text-xs text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-md">{{ tag }}</span>
          </div>
        </header>

        <hr class="border-t border-white/10 my-8" />

        <div class="prose prose-invert max-w-none">
          <ContentRenderer v-if="post" :value="post" />
        </div>
      </div>
      <BlogSidebar :body="post.body" />
    </div>
  </div>
</template>
