<script setup lang="ts">
import AdminLayout from '~/components/AdminLayout.vue'
import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
import AdminFiltersBar from '~/components/admin/AdminFiltersBar.vue'
import AdminBulkActions from '~/components/admin/AdminBulkActions.vue'
import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
import AdminPaginationControls from '~/components/admin/AdminPaginationControls.vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { IconPencil as Pencil, IconTrash as Trash2, IconEye as Eye, IconCirclePlus as PlusCircle, IconDots as MoreHorizontal, IconArrowsUpDown as ArrowUpDown } from '@tabler/icons-vue'
import { ref, computed, watch, onMounted } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: false })
useHead({ title: 'Articles - Admin' })

const loading = ref(true)
const error = ref(false)
onMounted(() => { setTimeout(() => { loading.value = false; error.value = false }, 400) })

const articles = [
  { id: 1, title: 'Getting Started with Nuxt', slug: 'getting-started', status: 'Published', author: 'Alice', date: '2025-09-20' },
  { id: 2, title: 'Shadcn Vue Components', slug: 'shadcn-vue', status: 'Draft', author: 'Bob', date: '2025-10-01' },
  { id: 3, title: 'Advanced TypeScript', slug: 'advanced-ts', status: 'Published', author: 'Carol', date: '2025-08-15' },
]

const search = ref('')
const statusFilter = ref('All')
const sortKey = ref<'title'|'slug'|'author'|'date'>('date')
const sortDir = ref<'asc'|'desc'>('desc')
const page = ref(1)
const pageSize = ref(10)
const selectedIds = ref<number[]>([])
const deleteId = ref<number | null>(null)
const debouncedSearch = ref('')
let searchTimer: number | null = null
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { debouncedSearch.value = search.value }, 300)
})

const filtered = computed(() => {
  let list = [...articles]
  if (debouncedSearch.value) {
    list = list.filter(a => a.title.toLowerCase().includes(debouncedSearch.value.toLowerCase()) || a.slug.toLowerCase().includes(debouncedSearch.value.toLowerCase()))
  }
  if (statusFilter.value !== 'All') {
    list = list.filter(a => a.status === statusFilter.value)
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

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

watch([debouncedSearch, statusFilter, sortKey, sortDir], () => { page.value = 1 })

function toggleSort(key: typeof sortKey.value) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function handleEdit(id: number) { toast.info('Edit article', { description: `Opening editor for article #${id}` }) }
function confirmDelete(id: number) { deleteId.value = id }
function handleDelete() { toast.error('Article deleted', { description: `Article #${deleteId.value} removed` }); deleteId.value = null }
function handleView(id: number) { toast.info('View article', { description: `Opening article #${id}` }) }
function handleCreate() { toast.info('Create article', { description: 'Opening new article form' }) }
function clearFilters() { search.value = ''; statusFilter.value = 'All' }
function handleBulkDelete() { if (!selectedIds.value.length) { toast.error('No articles selected'); return } toast.info('Bulk delete', { description: `Deleting ${selectedIds.value.length} articles` }) }
function handleBulkPublish() { if (!selectedIds.value.length) { toast.error('No articles selected'); return } toast.info('Bulk publish', { description: `Publishing ${selectedIds.value.length} articles` }) }

const statusVariant = (s: string) => s === 'Published' ? 'default' : s === 'Draft' ? 'secondary' : 'outline'
</script>

<template>
  <AdminLayout>
    <AdminPageHeader title="Articles" :breadcrumb="[{ label: 'Admin', to: '/admin' }, { label: 'Articles' }]">
      <template #actions>
        <Button @click="handleCreate">
          <PlusCircle class="w-4 h-4 mr-2" />
          New Article
        </Button>
      </template>
    </AdminPageHeader>

    <Card>
      <CardHeader>
        <AdminFiltersBar
          v-model:search="search"
          search-placeholder="Search articles..."
          :filters="[{ key: 'status', label: 'Status', value: statusFilter, options: [
            { value: 'All', label: 'All' },
            { value: 'Published', label: 'Published' },
            { value: 'Draft', label: 'Draft' }
          ]}]"
          @clear="clearFilters"
        />
      </CardHeader>
      <CardContent>
        <Alert v-if="error" variant="destructive">
          <AlertTitle>Error loading articles</AlertTitle>
          <AlertDescription>Failed to load articles. Please try again later.</AlertDescription>
        </Alert>

        <AdminBulkActions :selected-count="selectedIds.length">
          <Button variant="outline" size="sm" @click="handleBulkPublish">Publish</Button>
          <Button variant="outline" size="sm" @click="handleBulkDelete">
            <Trash2 class="w-4 h-4 mr-2" /> Delete
          </Button>
        </AdminBulkActions>

        <div class="rounded-md border overflow-auto">
          <Table>
            <TableCaption>{{ filtered.length }} articles found</TableCaption>
            <TableHeader class="sticky top-0 bg-background">
              <TableRow>
                <TableHead class="w-[50px]">
                  <input type="checkbox" :checked="selectedIds.length===paginated.length && paginated.length>0" @change="selectedIds = $event.target.checked ? paginated.map(a=>a.id) : []" />
                </TableHead>
                <TableHead :aria-sort="sortKey==='title'?sortDir:'none'">
                  <Button variant="ghost" size="sm" @click="toggleSort('title')">Title <ArrowUpDown v-if="sortKey!=='title'" class="ml-2 h-4 w-4" /></Button>
                </TableHead>
                <TableHead class="hidden md:table-cell" :aria-sort="sortKey==='slug'?sortDir:'none'">
                  <Button variant="ghost" size="sm" @click="toggleSort('slug')">Slug <ArrowUpDown v-if="sortKey!=='slug'" class="ml-2 h-4 w-4" /></Button>
                </TableHead>
                <TableHead :aria-sort="sortKey==='author'?sortDir:'none'">
                  <Button variant="ghost" size="sm" @click="toggleSort('author')">Author <ArrowUpDown v-if="sortKey!=='author'" class="ml-2 h-4 w-4" /></Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead :aria-sort="sortKey==='date'?sortDir:'none'">
                  <Button variant="ghost" size="sm" @click="toggleSort('date')">Date <ArrowUpDown v-if="sortKey!=='date'" class="ml-2 h-4 w-4" /></Button>
                </TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="loading">
                <TableRow v-for="i in 5" :key="'skeleton-'+i">
                  <TableCell><Skeleton class="h-4 w-4"/></TableCell>
                  <TableCell><Skeleton class="h-4 w-full"/></TableCell>
                  <TableCell class="hidden md:table-cell"><Skeleton class="h-4 w-32"/></TableCell>
                  <TableCell><Skeleton class="h-4 w-24"/></TableCell>
                  <TableCell><Skeleton class="h-6 w-16"/></TableCell>
                  <TableCell><Skeleton class="h-4 w-16"/></TableCell>
                  <TableCell class="text-right"><Skeleton class="h-8 w-8"/></TableCell>
                </TableRow>
              </template>
              <template v-else-if="paginated.length">
                <TableRow v-for="a in paginated" :key="a.id">
                  <TableCell>
                    <input type="checkbox" :checked="selectedIds.includes(a.id)" @change="selectedIds = $event.target.checked ? [...selectedIds, a.id] : selectedIds.filter(id=>id!==a.id)" />
                  </TableCell>
                  <TableCell class="font-medium">{{ a.title }}</TableCell>
                  <TableCell class="hidden md:table-cell">{{ a.slug }}</TableCell>
                  <TableCell>{{ a.author }}</TableCell>
                  <TableCell>
                    <Badge :variant="statusVariant(a.status)">{{ a.status }}</Badge>
                  </TableCell>
                  <TableCell>{{ a.date }}</TableCell>
                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="outline" size="sm" aria-label="Open actions">
                          <MoreHorizontal class="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="handleView(a.id)">
                          <Eye class="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="handleEdit(a.id)">
                          <Pencil class="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="confirmDelete(a.id)" class="text-destructive">
                          <Trash2 class="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow>
                  <TableCell colspan="7">
                    <AdminEmptyState title="No articles found" description="Try adjusting filters or create a new article." />
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </div>

        <AdminPaginationControls v-model:page="page" v-model:page-size="pageSize" :total="filtered.length" />
      </CardContent>
    </Card>

    <AlertDialog :open="!!deleteId" @update:open="deleteId = null">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete article?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the article.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleDelete" class="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </AdminLayout>
</template>
