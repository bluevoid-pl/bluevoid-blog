<script setup lang="ts">
const props = defineProps<{ body: Object }>()
const { body = null } = props

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
          result.push({ id, depth: Number(tagOf(node).slice(1)) || 1, text: textOf(node) })
        }
      }
      walk(childrenOf(node))
    }
  }
  if (body && Array.isArray(body) && body.length > 2) {
    walk(body.slice(2))
  } else if (body && Array.isArray((body as any).children)) {
    walk((body as any).children)
  }
  return result
})()
</script>

<template>
  <Card class="sticky top-20 mb-8">
    <CardHeader>
      <CardDescription>Contents</CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Native CSS scrollspy: links with fragment hrefs become :target-current
           as their sections enter the viewport (scroll-target-group). No JS. -->
      <nav v-if="links.length" aria-label="Table of contents">
        <ul class="toc-list">
          <li v-for="link in links" :key="link.id" :style="{ '--depth': link.depth }">
            <a :href="`#${link.id}`">{{ link.text }}</a>
          </li>
        </ul>
      </nav>
    </CardContent>
  </Card>
</template>

<style scoped>
.toc-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-block-size: calc(100dvh - 16rem);
  overflow-y: auto;
  /* Scope the scrollspy group to the list itself so all headings compete. */
  scroll-target-group: auto;
}

.toc-list a {
  display: block;
  color: var(--color-muted-foreground);
  text-decoration: none;
  transition: color 0.2s ease;
}

.toc-list a:hover {
  color: var(--color-foreground);
}

/* Only the current section's link gets the accent. */
.toc-list a:target-current {
  color: var(--color-primary);
  font-weight: 600;
}

/* Indentation derived from heading depth via custom property inheritance. */
.toc-list li {
  padding-left: calc((var(--depth, 1) - 1) * 1rem);
}
</style>
