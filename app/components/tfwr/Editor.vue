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

/**
 * Remove one level of indentation from a line.
 */
function removeIndent(line: string): string {
  if (line.startsWith('\t')) return line.slice(1)
  if (line.startsWith('    ')) return line.slice(4)
  return line
}

/**
 * Handle Tab / Shift+Tab for indentation.
 */
function onKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Tab') return
  const el = codeEl.value
  if (!el) return
  const indent = !e.shiftKey
  e.preventDefault()

  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return
  const range = sel.getRangeAt(0)
  if (!range || range.startContainer !== el.firstChild || range.endContainer !== el.firstChild) {
    // Fallback: treat as collapsed at caret
    // Try to get caret position via selection
    // If not inside text node, abort
    return
  }

  const text = el.textContent || ''
  const start = range.startOffset
  const end = range.endOffset
  const collapsed = start === end

  if (collapsed) {
    if (indent) {
      const newText = text.slice(0, start) + '\t' + text.slice(start)
      el.textContent = newText
      syncLineNumbers()
      requestHighlight()
      emit('update:code', newText)
      // Move caret after inserted tab
      const newPos = start + 1
      const newRange = document.createRange()
      newRange.setStart(el.firstChild!, newPos)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)
      return
    } else {
      // Dedent current line
      const lineStart = text.lastIndexOf('\n', start - 1)
      const lineStartIdx = lineStart === -1 ? 0 : lineStart + 1
      const lineEnd = text.indexOf('\n', start)
      const lineEndIdx = lineEnd === -1 ? text.length : lineEnd
      const line = text.slice(lineStartIdx, lineEndIdx)
      const newLine = removeIndent(line)
      if (line !== newLine) {
        const newText = text.slice(0, lineStartIdx) + newLine + text.slice(lineEndIdx)
        el.textContent = newText
        syncLineNumbers()
        requestHighlight()
        emit('update:code', newText)
        // Position caret at start of line
        const newPos = lineStartIdx
        const newRange = document.createRange()
        newRange.setStart(el.firstChild!, newPos)
        newRange.collapse(true)
        sel.removeAllRanges()
        sel.addRange(newRange)
      }
      return
    }
  }

  // Multi-line selection
  // Find start of first line and end of last line
  const startLineStart = text.lastIndexOf('\n', start - 1)
  const startIdx = startLineStart === -1 ? 0 : startLineStart + 1
  const endLineEnd = text.indexOf('\n', end)
  const endIdx = endLineEnd === -1 ? text.length : endLineEnd

  const block = text.slice(startIdx, endIdx)
  const lines = block.split('\n')
  const newLines = indent
    ? lines.map(l => '\t' + l)
    : lines.map(l => removeIndent(l))
  const newBlock = newLines.join('\n')
  const newText = text.slice(0, startIdx) + newBlock + text.slice(endIdx)

  el.textContent = newText
  syncLineNumbers()
  requestHighlight()
  emit('update:code', newText)

  // Restore selection roughly over the changed block
  try {
    const newRange = document.createRange()
    const newStart = startIdx
    const newEnd = startIdx + newBlock.length
    newRange.setStart(el.firstChild!, newStart)
    newRange.setEnd(el.firstChild!, newEnd)
    sel.removeAllRanges()
    sel.addRange(newRange)
  } catch {}
}

onMounted(() => {
  const el = codeEl.value
  if (el) {
    el.textContent = props.code
    syncLineNumbers()
    requestHighlight()
    el.addEventListener('input', onInput)
    el.addEventListener('keydown', onKeyDown)
  }
  preEl.value?.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  preEl.value?.removeEventListener('scroll', onScroll)
  codeEl.value?.removeEventListener('input', onInput)
  codeEl.value?.removeEventListener('keydown', onKeyDown)
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
  <div class="tfwr-editor relative flex-1 min-h-0 overflow-hidden rounded border bg-muted">
    <div class="absolute right-2 top-2 z-10 flex items-center gap-1">
      <slot name="actions" />
    </div>
    <pre ref="preEl" class="microlighter tfwr-editor-code h-full w-full overflow-auto p-3" :style="{ paddingLeft: `calc(${digits}ch + 1.5rem)` }"><code class="language-python" ref="codeEl" contenteditable="plaintext-only" spellcheck="false" aria-label="Editable code sample" tabindex="0"></code></pre>
    <span class="tfwr-editor-lines" data-testid="line-numbers" aria-hidden="true" :style="{ width: `calc(${digits}ch + 0.75rem)`, transform: `translateY(${-scrollTop}px)` }">{{ lineNumbers }}</span>
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
