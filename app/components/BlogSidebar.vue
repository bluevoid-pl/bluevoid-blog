<script setup lang="ts">
const { body } = defineProps({
  body: {
    type: Object,
    default: null
  }
})

const links = (() => {
  const result: { id: string; depth: number; text: string }[] = []
  const textOf = (node: any): string => {
    if (typeof node === 'string') {
      return node
    }
    if (Array.isArray(node)) {
      return node.slice(2).map(textOf).join('')
    }
    if (node.type === 'text') {
      return node.value || ''
    }
    return (node.children || []).map(textOf).join('')
  }
  const tagOf = (node: any) => Array.isArray(node) ? String(node[0] || '') : (node.tag || '')
  const isHeading = (node: any) => /^h[1-6]$/.test(tagOf(node))
  const idOf = (node: any) => Array.isArray(node) ? (node[1]?.id ?? null) : (node.props?.id ?? null)
  const childrenOf = (node: any) => Array.isArray(node) ? node.slice(2) : (node.children || [])
  const walk = (nodes: any[]) => {
    for (const node of nodes) {
      if (isHeading(node)) {
        const id = idOf(node)
        if (id) {
          result.push({ id, depth: Number(tagOf(node).charAt(1)), text: textOf(node) })
        }
      }
      walk(childrenOf(node))
    }
  }
  walk(body?.value || body?.children || [])
  return result
})()
</script>

<template>
  <aside class="blog-sidebar">
    <h3>Contents</h3>
    <nav>
      <ul>
        <li v-for="link in links" :key="link.id" :class="link.depth > 2 ? 'sidebar-sub' : ''">
          <a :href="'#' + link.id">{{ link.text }}</a>
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
.blog-sidebar .sidebar-sub a {
  color: #94a3b8;
  padding-left: 0.75rem;
}
.blog-sidebar .sidebar-sub a:hover {
  color: #cbd5e1;
  text-decoration: underline;
}
</style>
