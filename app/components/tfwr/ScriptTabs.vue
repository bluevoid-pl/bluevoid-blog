<script setup lang="ts">
import { ref } from 'vue'
import { IconPlus, IconCopy } from '@tabler/icons-vue'
import { Button } from '~/components/ui/button'
import ScriptTab from './ScriptTab.vue'
import type { TfwrScript } from '~/composables/tfwr/useScripts'

defineProps<{
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

/** Only one tab renames at a time, so that choice belongs to the strip. */
const editingIndex = ref(-1)

function startRename(index: number) {
  editingIndex.value = index
}

function stopEditing() {
  editingIndex.value = -1
}

function commitRename(index: number, name: string) {
  stopEditing()
  emit('rename', index, name)
}

function closeTab(index: number) {
  if (editingIndex.value === index) stopEditing()
  emit('close', index)
}
</script>

<template>
  <div class="flex items-end gap-1 border-b">
    <ScriptTab
      v-for="(script, index) in scripts"
      :key="index"
      :script="script"
      :active="index === activeIndex"
      :editing="index === editingIndex"
      @select="emit('update:activeIndex', index)"
      @start-edit="startRename(index)"
      @rename="commitRename(index, $event)"
      @cancel-edit="stopEditing"
      @close="closeTab(index)"
    />
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
