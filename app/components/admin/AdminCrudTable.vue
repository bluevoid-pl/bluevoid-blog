<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch } from 'vue'
import AdminDataTable from '~/components/admin/AdminDataTable.vue'
import AdminFiltersBar from '~/components/admin/AdminFiltersBar.vue'
import AdminBulkActions from '~/components/admin/AdminBulkActions.vue'
import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
import AdminPaginationControls from '~/components/admin/AdminPaginationControls.vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const props = defineProps<{
  title?: string
  items: T[]
  columns: { key: keyof T; label: string; sortable?: boolean; class?: string }[]
  searchFields?: (keyof T)[]
  filters?: { key: string; label: string; value: string; options: { value: string; label: string }[] }[]
  searchPlaceholder?: string
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  'update:selected': [ids: number[]]
  'update:sort': [key: string, dir: 'asc'|'desc']
}>()

const search = ref('')
const debouncedSearch = ref('')
const sortKey = ref<keyof T>(props.columns[0]?.key || ('id' as keyof T))
const sortDir = ref<'asc'|'desc'>('asc')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref<number[]>([])
const filterValues = ref<Record<string, string>>({})

watch(() => props.filters, () => {
  props.filters?.forEach(f => {
    if (!(f.key in filterValues.value)) {
      filterValues.value[f.key] = f.value
    }
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
    list = list.filter(item => 
      props.searchFields!.some(field => {
        const val = item[field]
        return typeof val === 'string' && val.toLowerCase().includes(q)
      })
    )
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
  emit('update:sort', String(key), sortDir.value)
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
      </AdminBulkActions>

      <AdminDataTable
        :items="paginated"
        :columns="columns"
        :loading="loading"
        :total="filtered.length"
        :selected-ids="selectedIds"
        :sort-key="String(sortKey)"
        :sort-dir="sortDir"
        @update:selected-ids="(ids) => { selectedIds = ids; emit('update:selected', ids) }"
        @toggle-sort="toggleSort"
      >
        <template #empty>
          <AdminEmptyState :title="title || 'No items found'" />
        </template>
      </AdminDataTable>

      <AdminPaginationControls
        v-model:page="page"
        v-model:page-size="pageSize"
        :total="filtered.length"
      />
    </CardContent>
  </Card>
</template>
