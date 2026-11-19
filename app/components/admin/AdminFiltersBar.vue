<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconX as X } from '@tabler/icons-vue'

defineProps<{
  search: string
  searchPlaceholder?: string
  filters?: { key: string; label: string; value: string; options: { value: string; label: string }[] }[]
  onSearch?: (v: string) => void
  onFilterChange?: (key: string, v: string) => void
  onClear?: () => void
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:filter': [key: string, value: string]
  'clear': []
}>()
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
    <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <Input
        :value="search"
        @update:modelValue="(v) => emit('update:search', v)"
        :placeholder="searchPlaceholder || 'Search...'"
        aria-label="Search"
        class="w-full sm:w-[300px]"
      />
      <template v-for="f in filters" :key="f.key">
        <Select :modelValue="f.value" @update:modelValue="(v) => emit('update:filter', f.key, v)">
          <SelectTrigger class="w-full sm:w-[180px]" :aria-label="f.label">
            <SelectValue :placeholder="f.label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="opt in f.options" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
          </SelectContent>
        </Select>
      </template>
    </div>
    <Button variant="outline" size="sm" @click="emit('clear')">
      <X class="w-4 h-4 mr-2" /> Clear
    </Button>
  </div>

  <div class="flex gap-2 mt-3">
    <Badge
      v-if="search"
      as-child
      variant="secondary"
      class="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <button type="button" @click="emit('update:search', '')">
        Search: {{ search }} <X class="w-3 h-3 ml-1" aria-hidden="true" />
        <span class="sr-only">Remove filter</span>
      </button>
    </Badge>
    <template v-for="f in filters" :key="`badge-${f.key}`">
      <Badge
        v-if="f.value !== 'All' && f.value !== ''"
        as-child
        variant="secondary"
        class="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <button type="button" @click="emit('update:filter', f.key, 'All')">
          {{ f.label }}: {{ f.value }} <X class="w-3 h-3 ml-1" aria-hidden="true" />
          <span class="sr-only">Remove filter</span>
        </button>
      </Badge>
    </template>
  </div>
</template>
