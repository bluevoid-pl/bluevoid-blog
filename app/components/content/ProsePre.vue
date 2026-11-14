<template>
  <pre :class="cn('microlighter')">
    <slot />
  </pre>
</template>

<script setup lang="ts">
import { cn } from 'cn'
import { provide } from 'vue'

const props = defineProps<{
  code?: string
  language?: string | null
  filename?: string | null
  highlights?: number[]
  meta?: string | null
  class?: string
}>()

provide('codeLanguage', props.language)
</script>
