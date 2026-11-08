<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch } from 'vue'
import AdminFiltersBar from '~/components/admin/AdminFiltersBar.vue'
import AdminBulkActions from '~/components/admin/AdminBulkActions.vue'
import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
import AdminPaginationControls from '~/components/admin/AdminPaginationControls.vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconArrowsUpDown as ArrowUpDown } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  title?: string
  items: T[]
  columns: Array<{ key: keyof T; label: string; sortable?: boolean; class?: string; render?: (item: T) => any }>
  searchFields?: (keyof T)[]
  searchPlaceholder?: string
  filters?: Array<{ key: string; label: string; value: string; options: { value: string; label: string }[] }>
  statusField?: keyof T
  statusVariant?: (value: any) => string
  loading?: boolean
  error?: boolean
  onEdit?: (id: any) => void
  onView?: (id: any) => void
  onDelete?: (id: any) => void
  onBulkPublish?: () => void
  onBulkDelete?: () => void
}>()

const search = ref('')
const debouncedSearch = ref('')
const sortKey = ref<keyof T>(props.columns[0]?.key || ('id' as keyof T))
const sortDir = ref<'asc'|'desc'>('asc')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref<any[]>([])
const filterValues = ref<Record<string, string>>({})

watch(() => props.filters, () => {
  props.filters?.forEach(f => {
    if (!(f.key in filterValues.value)) filterValues.value[f.key] = f.value
  })
}, { immediate: true })

let timer: number | null = null
watch(search, () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => { debouncedSearch.value = search.value; page.value = 1 }, 300)
})

const filtered = computed(() => {
  let list = [...props.items]
  if (debouncedSearch.value && props.searchFields) {
    const q = debouncedSearch.value.toLowerCase()
    list = list.filter(item => props.searchFields!.some(field => {
      const val = item[field]
      return typeof val === 'string' && val.toLowerCase().includes(q)
    }))
  }
  if (props.filters) {
    props.filters.forEach(f => {
      const val = filterValues.value[f.key]
      if (val && val !== 'All') {
        list = list.filter(item => String(item[f.key as keyof T]) === val)
      }
    })
  }
  list.sort((a,b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    if (aVal < bVal) return sortDir.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir.value === 'asc' ? 1 : -1
    return 0
  })
  return list
})

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function toggleSort(key: keyof T) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function clearFilters() {
  search.value = ''
  debouncedSearch.value = ''
  filterValues.value = {}
  props.filters?.forEach(f => { filterValues.value[f.key] = 'All' })
}
</script>

<template>
  <Card>
    <CardHeader>
      <AdminFiltersBar
        :search="search"
        :search-placeholder="searchPlaceholder"
        :filters="filters?.map(f => ({ ...f, value: filterValues[f.key] || f.value })) || []"
        @update:search="(v) => search = v"
        @update:filter="(k, v) => { filterValues[k] = v }"
        @clear="clearFilters"
      />
    </CardHeader>
    <CardContent class="space-y-4">
      <Alert v-if="error" variant="destructive">
        <AlertTitle>Error loading items</AlertTitle>
        <AlertDescription>Failed to load items. Please try again later.</AlertDescription>
      </Alert>

      <AdminBulkActions :selected-count="selectedIds.length">
        <slot name="bulk-actions" :selected="selectedIds" />
        <Button v-if="props.onBulkPublish" variant="outline" size="sm" @click="props.onBulkPublish">Publish</Button>
        <Button v-if="props.onBulkDelete" variant="outline" size="sm" @click="props.onBulkDelete">Delete</Button>
      </AdminBulkActions>

      <div class="rounded-md border overflow-auto">
        <Table>
          <TableCaption>{{ filtered.length }} items found</TableCaption>
          <TableHeader class="sticky top-0 bg-background">
            <TableRow>
              <TableHead class="w-[50px]">
                <input type="checkbox" :checked="selectedIds.length===paginated.length && paginated.length>0" @change="selectedIds = $event.target.checked ? paginated.map(i=>i.id) : []" />
              </TableHead>
              <TableHead v-for="col in columns" :key="String(col.key)" :class="col.class">
                <Button variant="ghost" size="sm" @click="toggleSort(col.key)">
                  {{ col.label }}
                  <ArrowUpDown v-if="sortKey!==col.key" class="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="loading">
              <TableRow v-for="i in 5" :key="i">
                <TableCell v-for="col in columns" :key="String(col.key)"><div class="h-4 bg-muted animate-pulse rounded"/></TableCell>
              </TableRow>
            </template>
            <template v-else-if="paginated.length">
              <TableRow v-for="item in paginated" :key="item.id">
                <TableCell>
                  <input type="checkbox" :checked="selectedIds.includes(item.id)" @change="selectedIds = $event.target.checked ? [...selectedIds, item.id] : selectedIds.filter(id=>id!==item.id)" />
                </TableCell>
                <TableCell v-for="col in columns" :key="String(col.key)">
                  <template v-if="col.render">{{ col.render(item) }}</template>
                  <template v-else-if="props.statusField && col.key === props.statusField">
                    <Badge :variant="props.statusVariant ? props.statusVariant(item[col.key]) : 'default'">{{ item[col.key] }}</Badge>
                  </template>
                  <template v-else>{{ item[col.key] }}</template>
                </TableCell>
                <TableCell class="text-right">
                  <slot name="row-actions" :item="item">
                    <Button variant="outline" size="sm" @click="props.onEdit ? props.onEdit(item.id) : null">Edit</Button>
                  </slot>
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell :colspan="columns.length + 2">
                  <AdminEmptyState :title="title || 'No items found'" />
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>

      <AdminPaginationControls v-model:page="page" v-model:page-size="pageSize" :total="filtered.length" />
    </CardContent>
  </Card>
</template>
