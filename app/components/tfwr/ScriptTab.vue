<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { IconX } from '@tabler/icons-vue'
import { Button } from '~/components/ui/button'
import type { TfwrScript } from '~/composables/tfwr/useScripts'

const props = defineProps<{
  script: TfwrScript
  active: boolean
  editing: boolean
}>()

const emit = defineEmits<{
  select: []
  close: []
  'start-edit': []
  rename: [name: string]
  'cancel-edit': []
}>()

const draft = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

// The parent decides which single tab is being renamed, so this component only
// follows that decision and mirrors the current name into a local draft.
watch(() => props.editing, (editing) => {
  if (!editing) return
  draft.value = props.script.name
  nextTick(() => {
    inputEl.value?.focus()
    inputEl.value?.select()
  })
})

function startRename() {
  emit('start-edit')
}


/** Blur can arrive after the input is already gone; ignore those. */
function commitRename() {
  if (!props.editing) return
  emit('rename', draft.value)
}
</script>

<template>
  <div
    class="group flex items-center gap-1 rounded-t border border-b-0 px-2 py-1.5 text-sm cursor-pointer select-none"
    :class="active
      ? 'bg-background border-border font-medium'
      : 'bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/70'"
    @click="emit('select')"
    @dblclick="startRename"
  >
    <input
      v-if="editing"
      ref="inputEl"
      v-model="draft"
      class="w-24 bg-transparent text-sm outline-none border-b"
      @click.stop
      @keydown.enter="commitRename"
      @keydown.esc="emit('cancel-edit')"
      @blur="commitRename"
    >
    <span v-else>{{ script.name }}</span>
    <Button
      variant="ghost"
      size="icon"
      class="h-5 w-5 opacity-0 group-hover:opacity-100"
      title="Close script"
      @click.stop="emit('close')"
      @dblclick.stop
    >
      <IconX class="h-3.5 w-3.5" />
      <span class="sr-only">Close {{ script.name }}</span>
    </Button>
  </div>
</template>
