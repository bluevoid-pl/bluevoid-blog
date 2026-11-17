<template>
  <pre
    :class="cn('microlighter', props.class, languageClass)"
    :data-numbered="hasLines || undefined"
    :style="{ counterReset: `line ${startLine - 1}` }"
  >
    <code
      :class="cn('grid min-h-lh min-w-max content-start in-data-numbered:grid-cols-[auto_1fr]', `language-${language || 'plaintext'}`)"
    >
      <template v-if="hasLines">
        <CodeBlockLine
          v-for="(line, i) in lines"
          :key="i"
          :line="line"
          :language="language || 'plaintext'"
          :variant="highlights?.includes(startLine + i) ? 'highlighted' : 'default'"
        />
      </template>
      <slot v-else />
    </code>
  </pre>
</template>

<script setup lang="ts">
import { cn } from 'cn'
import { provide, onMounted, nextTick } from 'vue'
import CodeBlockLine from '@/components/ui/code-block/CodeBlockLine.vue'

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

const startLine = 1
const hasLines = !!props.code
const lines = props.code ? props.code.replace(/\n$/, '').split('\n') : []

onMounted(() => {
  // Ensure highlighting runs after the component is mounted and DOM is stable.
  // Dispatch the custom event to trigger Microlighter.
  if (hasLines) {
    nextTick(() => {
      document.dispatchEvent(new CustomEvent('syntax-highlight'))
    })
  }
})
</script>
