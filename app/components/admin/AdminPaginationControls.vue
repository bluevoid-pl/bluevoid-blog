<script setup lang="ts">
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const props = defineProps<{
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: number[]
}>()

const emit = defineEmits<{
  'update:page': [value: number]
  'update:pageSize': [value: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil((props.total || 0) / props.pageSize)))
</script>

<template>
  <div class="flex items-center justify-between mt-4">
    <div class="text-sm text-muted-foreground">
      Showing {{ (page - 1) * pageSize + 1 }}-{{ Math.min(page * pageSize, total) }} of {{ total }}
    </div>
    <div class="flex items-center gap-2">
      <Select :modelValue="pageSize" @update:modelValue="(v) => emit('update:pageSize', Number(v))">
        <SelectTrigger class="w-[90px]">
          <SelectValue placeholder="Rows" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="opt in (pageSizeOptions || [5,10,20,50])" :key="opt" :value="opt">{{ opt }} per page</SelectItem>
        </SelectContent>
      </Select>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious @click="emit('update:page', Math.max(1, page - 1))" :disabled="page <= 1" />
          </PaginationItem>
          <PaginationItem v-for="p in Array.from({ length: totalPages }, (_, i) => i + 1)" :key="p">
            <button @click="emit('update:page', p)" :class="{ 'font-medium': page === p }">{{ p }}</button>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext @click="emit('update:page', Math.min(totalPages, page + 1))" :disabled="page >= totalPages" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
