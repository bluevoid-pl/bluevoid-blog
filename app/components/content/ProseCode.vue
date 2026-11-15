<template>
  <code :class="cn('language-' + (language || 'plaintext'), props.class)">
    <slot />
  </code>
</template>

<script setup lang="ts">
import { cn } from 'cn'
import { inject } from 'vue'

const props = defineProps<{
  code?: string
  class?: string
}>()

const language = inject('codeLanguage', null as unknown as string | null)
</script>
