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

  return {
    latest: list[0],
    featured: list.slice(0, 3),
    count: list.length,
    tags: uniqueTags.slice(0, 8)
  }
})

function formatDate(d: any): string {
  return new Date(d).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="landing">
    <section class="hero">
      <div class="hero-aurora" aria-hidden="true">
        <span class="aurora-blob" />
        <span class="aurora-blob" />
        <span class="aurora-blob" />
      </div>

      <div class="hero-inner">
        <h1 class="hero-title" v-if="landing.latest">
          Latest on the blog: {{ landing.latest.title }}
        </h1>
        <h1 class="hero-title" v-else>Blog</h1>

        <p class="hero-subtitle" v-if="landing.latest">
          {{ landing.latest.description }}
        </p>

        <div class="hero-meta" v-if="landing.latest">
          <time class="hero-date" :datetime="landing.latest.date">
            {{ formatDate(landing.latest.date) }}
          </time>
          <span v-for="tag in landing.latest.tags" :key="tag" class="hero-tag">{{ tag }}</span>
        </div>

        <div class="hero-actions">
          <a v-if="landing.latest" :href="landing.latest.path" class="btn">Read the latest</a>
          <a href="/blog" class="btn btn-secondary">Browse all posts</a>
        </div>
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
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 3.5rem 2rem;
  background: radial-gradient(120% 100% at 50% 0%, rgba(56, 189, 248, 0.14), transparent 60%),
    rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.hero-aurora {
  position: absolute;
  inset: -20%;
  filter: blur(60px);
  opacity: 0.55;
  pointer-events: none;
}
.aurora-blob {
  position: absolute;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  animation: drift 18s ease-in-out infinite alternate;
}
.aurora-blob:nth-child(1) { left: -10%; top: -10%; background: rgba(56, 189, 248, 0.35); animation-delay: -2s; }
.aurora-blob:nth-child(2) { left: 45%; top: 10%; background: rgba(167, 139, 250, 0.35); animation-duration: 22s; }
.aurora-blob:nth-child(3) { left: 10%; top: 50%; background: rgba(244, 114, 182, 0.25); animation-duration: 26s; }
@keyframes drift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(6rem, -4rem, 0) scale(1.25); }
}
.hero-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7dd3fc;
  background: rgba(125, 211, 252, 0.08);
  border: 1px solid rgba(125, 211, 252, 0.25);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}
.badge-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: #34d399;
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.35); }
}
.hero-title {
  font-size: clamp(2rem, 5vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(100deg, #38bdf8, #a78bfa 55%, #f472b6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}
.hero-subtitle {
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  color: #cbd5e1;
  max-width: 46rem;
  margin: 0;
}
.hero-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #94a3b8;
}
.hero-date {
  color: #7dd3fc;
  font-weight: 500;
}
.hero-tag {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}
.hero-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
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
  .aurora-blob, .badge-dot { animation: none; }
  .latest-card:hover, .btn:hover { transform: none; }
}
</style>
