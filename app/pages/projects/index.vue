<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const { data: projects } = await useAsyncData('projects-list', () => {
  return queryCollection('projects')
    .order('date', 'DESC')
    .all()
})

function formatDate(d: any): string {
  return new Date(d).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="projects-page">
    <header class="projects-header">
      <h1 class="projects-title">Projects</h1>
      <p class="projects-subtitle">Games, apps and experiments built along the way.</p>
    </header>

    <section class="project-grid">
      <a
        v-for="project in projects"
        :key="project.path"
        :href="project.path"
        class="project-card"
      >
        <div class="card-body">
          <div class="card-meta">
            <time class="card-date" :datetime="project.date">
              {{ formatDate(project.date) }}
            </time>
          </div>
          <h2 class="card-title">{{ project.title }}</h2>
          <p class="card-description">{{ project.description }}</p>
          <div class="card-tags">
            <span v-for="tag in project.tags" :key="tag" class="card-tag">{{ tag }}</span>
          </div>
        </div>
      </a>
    </section>
  </div>
</template>

<style scoped>
.projects-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}
.projects-header {
  text-align: center;
  padding-bottom: 2rem;
}
.projects-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.75rem;
}
.projects-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
.project-card {
  display: block;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: border-color 0.2s, background 0.2s;
  color: inherit;
  text-decoration: none;
}
.project-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(96, 165, 250, 0.4);
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card-meta {
  display: flex;
  align-items: center;
}
.card-date {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}
.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}
.card-description {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.5;
}
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
}
.card-tag {
  font-size: 0.75rem;
  color: #64748b;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;
}
</style>
