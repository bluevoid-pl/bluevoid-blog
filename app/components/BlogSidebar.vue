<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-sidebar-posts', async () => {
  const posts = await queryCollection('blog').order('date', 'DESC').all()
  return posts.map(({ path, title }) => ({ path, title }))
})
</script>

<template>
  <aside class="blog-sidebar">
    <h3>Blog</h3>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/blog">All posts</NuxtLink>
        </li>
        <li v-for="post in posts" :key="post.path">
          <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.blog-sidebar {
  position: sticky;
  top: 5rem;
  width: 240px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  margin-bottom: 2rem;
}
.blog-sidebar h3 {
  margin-top: 0;
  font-size: 1.1rem;
  color: #f1f5f9;
}
.blog-sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.blog-sidebar li {
  margin: 0.5rem 0;
}
.blog-sidebar a {
  color: #60a5fa;
  text-decoration: none;
}
.blog-sidebar a:hover {
  color: #93c5fd;
  text-decoration: underline;
}
</style>
