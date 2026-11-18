<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { IconPlus, IconCopy, IconX } from '@tabler/icons-vue'
import { Button } from '~/components/ui/button'
import type { TfwrScript } from '~/composables/tfwr/useScripts'

const props = defineProps<{
  scripts: TfwrScript[]
  activeIndex: number
}>()

const emit = defineEmits<{
  'update:activeIndex': [index: number]
  add: []
  duplicate: []
  close: [index: number]
  rename: [index: number, name: string]
}>()

const editingIndex = ref(-1)
const editingName = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

function startRename(index: number) {
  editingIndex.value = index
  editingName.value = props.scripts[index].name
  nextTick(() => {
    inputEl.value?.focus()
    inputEl.value?.select()
  })
}

function commitRename() {
  if (editingIndex.value >= 0) {
    emit('rename', editingIndex.value, editingName.value)
  }
  editingIndex.value = -1
}

watch(editingIndex, value => {
  if (value === -1) inputEl.value?.blur()
})
</script>

<template>
  <div class="flex items-end gap-1 border-b">
    <template v-for="(script, index) in scripts" :key="index">
      <div
        class="group flex items-center gap-1 rounded-t border border-b-0 px-2 py-1.5 text-sm cursor-pointer select-none"
        :class="index === activeIndex
          ? 'bg-background border-border font-medium'
          : 'bg-muted/40 border-transparent text-muted-foreground hover:bg-muted/70'"
        @click="emit('update:activeIndex', index)"
        @dblclick="startRename(index)"
      >
        <input
          v-if="editingIndex === index"
          ref="inputEl"
          v-model="editingName"
          class="w-24 bg-transparent text-sm outline-none border-b"
          @keydown.enter="commitRename"
          @keydown.esc="editingIndex = -1"
          @blur="commitRename"
        >
        <span v-else>{{ script.name }}</span>
        <Button
          variant="ghost"
          size="icon"
          class="h-5 w-5 opacity-0 group-hover:opacity-100"
          title="Close script"
          @click.stop="emit('close', index)"
        >
          <IconX class="h-3.5 w-3.5" />
          <span class="sr-only">Close {{ script.name }}</span>
        </Button>
      </div>
    </template>
    <div class="flex items-center gap-1 pb-1 ml-1">
      <Button variant="ghost" size="icon" class="h-6 w-6" title="New script" @click="emit('add')">
        <IconPlus class="h-4 w-4" />
        <span class="sr-only">New script</span>
      </Button>
      <Button variant="ghost" size="icon" class="h-6 w-6" title="Duplicate script" @click="emit('duplicate')">
        <IconCopy class="h-4 w-4" />
        <span class="sr-only">Duplicate script</span>
      </Button>
    </div>
  </div>
</template>
