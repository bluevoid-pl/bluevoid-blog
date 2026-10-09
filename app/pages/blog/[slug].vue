<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()

const { data: post } = await useAsyncData('blog-' + route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const readingTime = computed(() => {
  const body = post.value?.bodyPlain || ''
  const words = body.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
})

function isNew(d: any): boolean {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return new Date(d) >= oneMonthAgo
}
</script>

<template>
  <div class="article-layout mx-auto max-w-[1250px] px-8 pt-10 pb-12">
    <div class="article-page">
    <header class="article-header">
      <div class="header-meta">
        <time class="header-date" :datetime="post.date">
          {{ new Date(post.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </time>
        <span v-if="isNew(post.date)" class="header-new">New</span>
        <span class="header-reading">{{ readingTime }} min read</span>
      </div>
      <h1 class="header-title">{{ post.title }}</h1>
      <p class="header-description">{{ post.description }}</p>
      <div class="header-tags">
        <span v-for="tag in post.tags" :key="tag" class="header-tag">{{ tag }}</span>
      </div>
    </header>

    <hr class="header-divider" />

    <div class="article-body prose prose-invert max-w-none">
      <ContentRenderer
        v-if="post"
        :value="post"
      />
    </div>
    </div>
    <BlogSidebar :body="post.body" />
  </div>
</template>

<style scoped>
.article-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}
.article-page {
  flex: 1;
}
@media (max-width: 1024px) {
  .article-layout {
    flex-direction: column;
  }
}
.article-header {
  padding-bottom: 1.5rem;
}
.header-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
.header-date {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}
.header-new {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #34d399;
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
}
.header-reading {
  font-size: 0.8rem;
  color: #475569;
}
.header-title {
  font-size: 2rem;
  font-weight: 800;
  color: #f1f5f9;
  margin: 0.5rem 0 0.75rem;
  line-height: 1.2;
}
.header-description {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.header-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.header-tag {
  font-size: 0.75rem;
  color: #93c5fd;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.2);
  padding: 0.25rem 0.6rem;
  border-radius: 0.375rem;
}
.header-divider {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 0 2rem;
}
.article-body {
  margin-top: 1rem;
}
.article-body :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}
.article-body :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.article-body :deep(h4) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #94a3b8;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}
.article-body :deep(p) {
  line-height: 1.75;
  color: #cbd5e1;
}
.article-body :deep(ul), .article-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}
.article-body :deep(li) {
  margin: 0.35rem 0;
  color: #cbd5e1;
}
.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin: 1.5rem 0;
}
.article-body :deep(th), .article-body :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.4rem 0.6rem;
}
.article-body :deep(th) {
  background: rgba(255, 255, 255, 0.05);
  font-weight: 600;
}
.article-body :deep(blockquote) {
  border-left: 3px solid #60a5fa;
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: #94a3b8;
}
.article-body :deep(pre) {
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.6;
}
.article-body :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.9em;
}
.article-body :deep(pre code) {
  background: none;
  padding: 0;
  border-radius: 0;
}
.article-body :deep(a) {
  color: #60a5fa;
  text-decoration: none;
}
.article-body :deep(a:hover) {
  color: #93c5fd;
  text-decoration: underline;
}
.article-body :deep(hr) {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 2rem 0;
}
</style>
