<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { TableRow, TableCell } from '@/components/ui/table'

defineProps<{
  columns: number
  rows?: number
}>()
</script>

<template>
  <TableRow v-for="i in (rows || 5)" :key="'skeleton-'+i">
    <TableCell v-for="c in columns" :key="c">
      <Skeleton class="h-4 w-full" />
    </TableCell>
  </TableRow>
</template>
