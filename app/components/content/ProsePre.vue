<template>
  <pre :class="cn('microlighter', props.class, languageClass)"><slot /></pre>
</template>

<script setup lang="ts">
import { cn } from 'cn'
import { provide } from 'vue'

// Vue preserves whitespace inside <pre>, so the slot is written flush against the
// tags: a newline or indent in the template would show up as literal spaces before
// the first line of code.

const props = defineProps<{
  code?: string
  language?: string | null
  filename?: string | null
  highlights?: number[]
  meta?: string | null
  class?: string
}>()

provide('codeLanguage', props.language)

/** Nuxt Content already puts `language-<lang>` in `props.class`; add it only when missing. */
const languageClass = props.language && !props.class?.includes('language-') ? `language-${props.language}` : ''
</script>
