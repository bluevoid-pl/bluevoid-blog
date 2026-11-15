<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { type CodeBlockLineVariants, codeBlockLineVariants } from "."
import { cn } from "cn"

const props = withDefaults(defineProps<{
  variant?: CodeBlockLineVariants["variant"]
  class?: HTMLAttributes["class"]
  language?: string
  line?: string
}>(), {
  variant: "default",
  language: undefined,
  line: undefined,
})

// A line given as text is rendered with v-text so the element holds a single
// text node: that is what MicroLighter requires to highlight a block. An empty
// line keeps a newline so copying a selection preserves blank lines.
const text = props.line === undefined ? undefined : props.line === "" ? "\n" : props.line
</script>

<template>
  <span
    data-slot="code-block-line"
    :data-variant="variant"
    :data-language="language"
    :class="cn(codeBlockLineVariants({ variant }), props.class)"
  >
    <span
      v-if="line !== undefined"
      data-slot="code-block-line-content"
      class="min-w-0"
      v-text="text"
    />
    <span v-else data-slot="code-block-line-content" class="min-w-0">
      <slot />
    </span>
  </span>
</template>
