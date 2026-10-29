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
  <aside class="sticky top-20 w-60 p-4 bg-white/5 border border-white/10 rounded-2xl mb-8">
    <h3 class="mt-0 text-lg font-semibold text-slate-100">Contents</h3>
    <nav>
      <ul class="list-none p-0 m-0">
        <li v-for="link in links" :key="link.id" class="my-2">
          <a :href="'#' + link.id" class="text-sky-400 hover:text-sky-300 hover:underline" :class="link.depth > 2 ? 'text-slate-400 pl-3 hover:text-slate-300' : ''">{{ link.text }}</a>
        </li>
      </ul>
    </nav>
  </aside>
</template>
