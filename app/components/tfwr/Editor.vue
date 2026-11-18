<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  code: string
  running: boolean
}>()

const emit = defineEmits<{
  'update:code': [value: string]
  'run': []
}>()

const codeEl = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = codeEl.value
  if (el) {
    el.textContent = props.code
    el.dispatchEvent(new CustomEvent('syntax-highlight', { bubbles: true }))
    el.addEventListener('input', () => {
      emit('update:code', el.textContent || '')
      el.dispatchEvent(new CustomEvent('syntax-highlight', { bubbles: true }))
    })
  }
})

watch(() => props.code, (newVal) => {
  const el = codeEl.value
  if (el && el.textContent !== newVal) {
    el.textContent = newVal
    el.dispatchEvent(new CustomEvent('syntax-highlight', { bubbles: true }))
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
    <pre class="microlighter w-full h-96 overflow-auto border rounded p-3" data-syntax-theme="github"><code class="language-python" ref="codeEl" contenteditable="plaintext-only" spellcheck="false" aria-label="Editable code sample" tabindex="0"></code></pre>
  </div>
</template>

<style scoped>
.microlighter {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  font-size: 14px;
  line-height: 1.5;
  tab-size: 4;
  white-space: pre;
  overflow-wrap: normal;
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
