<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  code: string
  running: boolean
}>()

const emit = defineEmits<{
  'update:code': [value: string]
  'run': []
}>()

const preEl = ref<HTMLElement | null>(null)
const codeEl = ref<HTMLElement | null>(null)
const lineCount = ref(1)
const scrollTop = ref(0)

const digits = computed(() => String(lineCount.value).length)

const lineNumbers = computed(() =>
  Array.from({ length: lineCount.value }, (_, i) => String(i + 1)).join('\n'),
)

/**
 * MicroLighter keeps code as plain text and paints its tokens with
 * `::highlight()`, so there are no line elements to number: the gutter counts
 * the code instead. Lines never wrap here, so one text line is one line on
 * screen and the two columns stay in step.
 */
function syncLineNumbers() {
  const text = codeEl.value?.textContent || ''
  lineCount.value = text.split('\n').length
}

/** Asks the MicroLighter plugin to re-run over this block. */
function requestHighlight() {
  codeEl.value?.dispatchEvent(new CustomEvent('syntax-highlight', { bubbles: true }))
}

function onInput() {
  emit('update:code', codeEl.value?.textContent || '')
  syncLineNumbers()
  requestHighlight()
}

/**
 * The gutter sits beside the scrolling <pre> instead of inside it, so long
 * lines slide under it while the numbers stay put. Only the vertical offset has
 * to be copied from the code.
 */
function onScroll() {
  const top = preEl.value?.scrollTop ?? 0
  if (top !== scrollTop.value) scrollTop.value = top
}

onMounted(() => {
  const el = codeEl.value
  if (el) {
    el.textContent = props.code
    syncLineNumbers()
    requestHighlight()
    el.addEventListener('input', onInput)
  }
  preEl.value?.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  preEl.value?.removeEventListener('scroll', onScroll)
  codeEl.value?.removeEventListener('input', onInput)
})

watch(() => props.code, (newVal) => {
  const el = codeEl.value
  if (el && el.textContent !== newVal) {
    el.textContent = newVal
    syncLineNumbers()
    requestHighlight()
  }
})
</script>

<template>
  <div>
    <div class="mb-3 flex items-center justify-end">
      <button @click="emit('run')" :disabled="running" class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
        {{ running ? 'Running...' : 'Run' }}
      </button>
    </div>
    <div class="tfwr-editor relative h-96 overflow-hidden rounded border bg-muted">
      <pre ref="preEl" class="microlighter tfwr-editor-code h-full w-full overflow-auto p-3" :style="{ paddingLeft: `calc(${digits}ch + 1.5rem)` }"><code class="language-python" ref="codeEl" contenteditable="plaintext-only" spellcheck="false" aria-label="Editable code sample" tabindex="0"></code></pre>
      <span class="tfwr-editor-lines" data-testid="line-numbers" aria-hidden="true" :style="{ width: `calc(${digits}ch + 0.75rem)`, transform: `translateY(${-scrollTop}px)` }">{{ lineNumbers }}</span>
    </div>
  </div>
</template>

<style scoped>
/* The code and its numbers are two separate boxes, so the metrics that put
   lines on a grid live on the wrapper and both columns inherit them: same
   monospace face, same size, same line box. Any drift between the two is then
   impossible, and `ch` in the gutter width and the code's left padding measure
   the same digit in both. */
.tfwr-editor {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 14px;
  line-height: 1.5;
  tab-size: 4;
  white-space: pre;
  overflow-wrap: normal;
}

.microlighter {
  white-space: pre;
  overflow-wrap: normal;
}

/* The numbers share the box with the code and the same monospace metrics, and
   start under the same top padding, so every row lands on the line it counts.
   The strip is as wide as the last number plus a space, which is exactly the
   room the code is given on its left. */
.tfwr-editor-lines {
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 0.75rem 0.75rem 0 0;
  text-align: right;
  user-select: none;
  font-variant-numeric: tabular-nums;
  /* The same surface as the box around it, so code scrolled underneath stays hidden. */
  background-color: inherit;
  color: var(--syntax-comment);
}

.microlighter code {
  display: block;
  min-height: 100%;
  outline: none;
  white-space: pre;
  word-break: normal;
}

.microlighter code[contenteditable="plaintext-only"] {
  cursor: text;
  -webkit-user-modify: read-write-plaintext-only;
  user-modify: read-write-plaintext-only;
}
</style>
