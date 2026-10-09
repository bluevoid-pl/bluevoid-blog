<template>
  <header class="navbar">
    <div class="navbar-container">
      <a href="/" class="navbar-brand"><img src="/logo.png" />Blue Void</a>
      <nav class="navbar-links">
        <a href="/" class="navbar-link">Home</a>
        <a href="/blog" class="navbar-link">Blog</a>
        <a href="/projects" class="navbar-link">Projects</a>
        <a href="/about" class="navbar-link">About</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(15, 23, 42, 0.85);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}
.navbar-brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: #f8fafc;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap:0.5rem;

}
.navbar-brand > img {
    height: 2.5rem;
}
.navbar-links {
  display: flex;
  gap: 1.5rem;
}
.navbar-link {
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
}
.navbar-link:hover {
  background: rgba(255,255,255,0.08);
}
</style>
