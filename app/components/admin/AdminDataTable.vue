<script setup lang="ts" generic="T extends Record<string, any>">
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { IconArrowsUpDown as ArrowUpDown } from '@tabler/icons-vue'

const props = defineProps<{
  items: T[]
  columns: { key: keyof T; label: string; sortable?: boolean; class?: string }[]
  loading?: boolean
  total?: number
  selectedIds?: number[]
  onToggleSort?: (key: string) => void
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSelectAll?: (checked: boolean) => void
  onSelectRow?: (id: number, checked: boolean) => void
}>()

const emit = defineEmits<{
  'update:selectedIds': [value: number[]]
}>()
</script>

<template>
  <div class="rounded-md border overflow-auto">
    <Table>
      <TableCaption v-if="total !== undefined">{{ total }} items found</TableCaption>
      <TableHeader class="sticky top-0 bg-background">
        <TableRow>
          <TableHead class="w-[50px]">
            <input type="checkbox" :checked="selectedIds?.length === items.length && items.length > 0" @change="onSelectAll?.($event.target.checked)" />
          </TableHead>
          <TableHead v-for="col in columns" :key="String(col.key)" :class="col.class">
            <Button v-if="col.sortable" variant="ghost" size="sm" @click="onToggleSort?.(String(col.key))">
              {{ col.label }}
              <ArrowUpDown v-if="sortKey !== String(col.key)" class="ml-2 h-4 w-4" />
            </Button>
            <span v-else>{{ col.label }}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="loading">
          <TableRow v-for="i in 5" :key="'skeleton-'+i">
            <TableCell v-for="col in columns" :key="String(col.key)">
              <Skeleton class="h-4 w-full" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="items.length">
          <TableRow v-for="item in items" :key="item.id">
            <TableCell>
              <input type="checkbox" :checked="selectedIds?.includes(item.id)" @change="onSelectRow?.(item.id, $event.target.checked)" />
            </TableCell>
            <TableCell v-for="col in columns" :key="String(col.key)">
              <slot :name="String(col.key)" :item="item">{{ item[col.key] }}</slot>
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length + 1">
              <slot name="empty" />
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
