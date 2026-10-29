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
  <div class="landing">
    <section id="showcase" class="showcase">
      <div class="showcase-inner">
        <div class="showcase-copy">
          <h2 class="showcase-title">{{ landing.erp?.title ?? 'ERP - webapp' }}</h2>
          <p class="showcase-description">{{ landing.erp?.description ?? 'System zażądania drukarni koszulek.' }}</p>
          <div class="showcase-tags">
            <span v-for="tag in (landing.erp?.tags ?? [])" :key="tag" class="showcase-tag">{{ tag }}</span>
          </div>
          <a v-if="landing.erp" :href="landing.erp.path" class="btn btn-primary">View project</a>
        </div>
        <div class="showcase-image">
          <img
            v-if="landing.erp?.img"
            :src="landing.erp.img"
            :alt="landing.erp.title"
            class="showcase-screenshot"
          />
        </div>
      </div>
    </section>

    <section id="ai-models" class="ai-models">
      <h2 class="section-title">AI model articles</h2>
      <div class="ai-grid">
        <template v-for="(slot, i) in landing.aiSlots" :key="i">
          <a
            v-if="slot"
            :href="slot.path"
            class="ai-card"
          >
            <div class="ai-card-body">
              <h3 class="ai-card-title">{{ slot.title }}</h3>
              <p class="ai-card-description">{{ slot.description }}</p>
              <div class="ai-card-tags">
                <span v-for="tag in (slot.tags ?? [])" :key="tag" class="ai-card-tag">{{ tag }}</span>
              </div>
            </div>
          </a>
          <div v-else class="ai-card ai-placeholder">
            <div class="ai-card-body">
              <h3 class="ai-card-title">More coming soon</h3>
              <p class="ai-card-description">Another AI model article will appear here shortly.</p>
            </div>
          </div>
        </template>
      </div>
    </section>

    <section id="latest" class="latest">
      <h2 class="section-title">Latest from the blog</h2>
      <div class="latest-grid">
        <a
          v-for="post in landing.featured"
          :key="post.path"
          :href="post.path"
          class="latest-card"
        >
          <div class="card-body">
            <div class="card-meta">
              <time class="card-date" :datetime="post.date">{{ formatDate(post.date) }}</time>
              <span v-if="isNew(post.date)" class="card-new">New</span>
            </div>
            <h3 class="card-title">{{ post.title }}</h3>
            <p class="card-description">{{ post.description }}</p>
            <div class="card-tags">
              <span v-for="tag in post.tags" :key="tag" class="card-tag">{{ tag }}</span>
            </div>
          </div>
        </a>
      </div>
    </section>

    <section id="topics" class="topics">
      <h2 class="section-title">Topics covered</h2>
      <div class="topic-strip">
        <span v-for="tag in landing.tags" :key="tag" class="topic-chip">{{ tag }}</span>
      </div>
      <a href="/blog" class="btn btn-secondary">See every post</a>
    </section>
  </div>
</template>

<style scoped>
.landing {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
.showcase {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 2rem;
  background: radial-gradient(120% 100% at 50% 0%, rgba(56, 189, 248, 0.14), transparent 60%),
    rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.showcase-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}
.showcase-copy {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.showcase-title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(100deg, #38bdf8, #a78bfa 55%, #f472b6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}
.showcase-description {
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  color: #cbd5e1;
  line-height: 1.55;
  margin: 0;
}
.showcase-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.showcase-tag {
  font-size: 0.75rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}
.showcase-image {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  height: 100%;
  min-height: 16rem;
}
.showcase-screenshot {
  display: block;
  width: 200%;
  height: 100%;
  object-fit: cover;
  object-position: left center;
}
.btn-primary {
  color: #7dd3fc;
}
.ai-models {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}
.ai-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}
@media (max-width: 900px) {
  .ai-grid {
    grid-template-columns: 1fr;
  }
  .showcase-inner {
    grid-template-columns: 1fr;
  }
}
.ai-card {
  display: block;
  color: inherit;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.4rem;
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}
.ai-card:hover {
  transform: translateY(-4px) rotate(-0.4deg);
  background: rgba(125, 211, 252, 0.07);
  border-color: rgba(125, 211, 252, 0.45);
}
.ai-placeholder {
  border-style: dashed;
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.02);
}
.ai-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.ai-card-title { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; margin: 0; }
.ai-card-description { font-size: 0.9rem; color: #94a3b8; line-height: 1.55; }
.ai-card-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.25rem; }
.ai-card-tag {
  font-size: 0.75rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
}
.btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 0.75rem;
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}
.btn:hover {
  transform: translateY(-2px);
  background: rgba(56, 189, 248, 0.14);
  border-color: rgba(56, 189, 248, 0.5);
}
.btn-secondary {
  color: #94a3b8;
}
.latest, .topics {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}
.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: -0.01em;
  margin: 0;
}
.latest-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}
@media (max-width: 900px) {
  .latest-grid {
    grid-template-columns: 1fr;
  }
}
.latest-card {
  display: block;
  color: inherit;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.4rem;
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}
.latest-card:hover {
  transform: translateY(-4px) rotate(-0.4deg);
  background: rgba(125, 211, 252, 0.07);
  border-color: rgba(125, 211, 252, 0.45);
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card-meta { display: flex; align-items: center; }
.card-date { font-size: 0.8rem; color: #64748b; font-weight: 500; }
.card-new {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #34d399;
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.3);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}
.card-title { font-size: 1.15rem; font-weight: 700; color: #f1f5f9; margin: 0; }
.card-description { font-size: 0.9rem; color: #94a3b8; line-height: 1.55; }
.card-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.25rem; }
.card-tag {
  font-size: 0.75rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
}
.topic-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.topic-chip {
  font-size: 0.85rem;
  color: #cbd5e1;
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.12), rgba(167, 139, 250, 0.12));
  border: 1px solid rgba(148, 163, 163, 0.2);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
}
@media (prefers-reduced-motion: reduce) {
  .ai-card:hover, .btn:hover { transform: none; }
}
</style>
