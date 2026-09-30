<template>
  <aside class="blog-sidebar">
    <h3>Blog</h3>
    <nav>
      <ul>
        <li><NuxtLink to="/blog">All posts</NuxtLink></li>
        <li><NuxtLink to="/blog/wprowadzenie-do-baz">Wprowadzenie do baz</NuxtLink></li>
        <li><NuxtLink to="/blog/mysql-tabele">MySQL - Tabele</NuxtLink></li>
        <li><NuxtLink to="/blog/mysql-data-types">MySQL - Data Types</NuxtLink></li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.blog-sidebar {
  width: 240px;
  padding: 1rem;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  margin-bottom: 2rem;
}
.blog-sidebar h3 {
  margin-top: 0;
  font-size: 1.1rem;
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
  text-decoration: none;
  color: #333;
}
.blog-sidebar a:hover {
  color: #000;
  text-decoration: underline;
}
</style>
