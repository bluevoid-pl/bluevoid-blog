import { ref, computed, watch } from 'vue'

export function useAdminList<T>(items: T[], options?: {
  searchFields?: (keyof T)[]
  defaultSortKey?: keyof T
  defaultSortDir?: 'asc' | 'desc'
  defaultPageSize?: number
}) {
  const search = ref('')
  const debouncedSearch = ref('')
  const sortKey = ref<keyof T>(options?.defaultSortKey ?? ('id' as keyof T))
  const sortDir = ref<'asc' | 'desc'>(options?.defaultSortDir ?? 'desc')
  const page = ref(1)
  const pageSize = ref(options?.defaultPageSize ?? 10)
  const selectedIds = ref<Set<unknown>>()
  const searchTimer = ref<number | null>(null)

  watch(search, () => {
    if (searchTimer.value) clearTimeout(searchTimer.value)
    searchTimer.value = setTimeout(() => {
      debouncedSearch.value = search.value
      page.value = 1
    }, 300)
  })

  const filtered = computed(() => {
    let list = [...items]

    if (debouncedSearch.value && options?.searchFields) {
      const q = debouncedSearch.value.toLowerCase()
      list = list.filter(item =>
        options.searchFields!.some(field => {
          const val = item[field]
          return typeof val === 'string' && val.toLowerCase().includes(q)
        })
      )
    }

    list.sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]
      if (aVal < bVal) return sortDir.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir.value === 'asc' ? 1 : -1
      return 0
    })
    return list
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
  const paginated = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filtered.value.slice(start, start + pageSize.value)
  })

  watch([debouncedSearch, sortKey, sortDir], () => {
    page.value = 1
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
  }

  return {
    search,
    debouncedSearch,
    sortKey,
    sortDir,
    page,
    pageSize,
    selectedIds,
    filtered,
    paginated,
    totalPages,
    toggleSort,
    clearFilters,
  }
}
