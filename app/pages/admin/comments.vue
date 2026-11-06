<script setup lang="ts">
import AdminLayout from '~/components/AdminLayout.vue'
import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
import AdminFiltersBar from '~/components/admin/AdminFiltersBar.vue'
import AdminBulkActions from '~/components/admin/AdminBulkActions.vue'
import AdminEmptyState from '~/components/admin/AdminEmptyState.vue'
import AdminPaginationControls from '~/components/admin/AdminPaginationControls.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IconCheck as Check, IconTrash as Trash2, IconMessage as MessageSquare, IconDots as MoreHorizontal, IconArrowsUpDown as ArrowUpDown, IconX as X } from '@tabler/icons-vue'
import { ref, computed, watch, onMounted } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: false })
useHead({ title: 'Comments - Admin' })

const loading = ref(true)
const error = ref(false)
onMounted(() => { setTimeout(() => { loading.value = false; error.value = false }, 400) })

const comments = [
  { id: 101, author: 'John Doe', article: 'Vue 3 Tips', content: 'Great article! Very helpful for beginners.', status: 'Approved', date: '2025-10-01' },
  { id: 102, author: 'Jane Roe', article: 'Nuxt Guide', content: 'Needs more examples and code snippets.', status: 'Pending', date: '2025-10-02' },
  { id: 103, author: 'Mike Lee', article: 'Shadcn UI', content: 'Nice!', status: 'Spam', date: '2025-10-03' },
  { id: 104, author: 'Anna Kim', article: 'TypeScript', content: 'Excellent explanation.', status: 'Approved', date: '2025-10-04' },
]

const search = ref('')
const statusFilter = ref('All')
const sortKey = ref<'author'|'article'|'date'>('date')
const sortDir = ref<'asc'|'desc'>('desc')
const page = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 20, 50]
const selectedIds = ref<number[]>([])
const deleteId = ref<number | null>(null)
const actionId = ref<number | null>(null)
const actionType = ref<'approve'|'reject'|null>(null)
const debouncedSearch = ref('')
let searchTimer: number | null = null
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { debouncedSearch.value = search.value }, 300)
})

const filtered = computed(() => {
  let list = [...comments]
  if (debouncedSearch.value) {
    list = list.filter(c => c.author.toLowerCase().includes(debouncedSearch.value.toLowerCase()) || c.article.toLowerCase().includes(debouncedSearch.value.toLowerCase()) || c.content.toLowerCase().includes(debouncedSearch.value.toLowerCase()))
  }
  if (statusFilter.value !== 'All') {
    list = list.filter(c => c.status === statusFilter.value)
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

watch([debouncedSearch, statusFilter, sortKey, sortDir], () => {
  page.value = 1
})

function toggleSort(key: typeof sortKey.value) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'desc'
  }
}

function handleApprove(id: number) { actionId.value = id; actionType.value = 'approve' }
function handleReject(id: number) { actionId.value = id; actionType.value = 'reject' }
function confirmDelete(id: number) { deleteId.value = id }
function handleDelete() { toast.error('Comment deleted', { description: `Comment #${deleteId.value} removed` }); deleteId.value = null }
function handleAction() { if (actionType.value==='approve') toast.success('Comment approved', { description: `Comment #${actionId.value} approved` }); else if (actionType.value==='reject') toast.info('Comment rejected', { description: `Comment #${actionId.value} rejected` }); actionId.value=null; actionType.value=null }
function clearFilters() { search.value = ''; statusFilter.value = 'All' }
function handleBulkDelete() { if (!selectedIds.value.length) { toast.error('No comments selected', { description: 'Select comments to delete' }); return } toast.info('Bulk delete', { description: `Deleting ${selectedIds.value.length} comments` }) }
function handleBulkApprove() { if (!selectedIds.value.length) { toast.error('No comments selected', { description: 'Select comments to approve' }); return } toast.info('Bulk approve', { description: `Approving ${selectedIds.value.length} comments` }) }

const statusVariant = (s: string) => s === 'Approved' ? 'default' : s === 'Pending' ? 'secondary' : s === 'Spam' ? 'destructive' : 'outline'
</script>

<template>
  <AdminLayout>
    <AdminPageHeader title="Comments" :breadcrumb="[{ label: 'Admin', to: '/admin' }, { label: 'Comments' }]">
      <template #actions>
        <Button variant="outline">
          <MessageSquare class="w-4 h-4 mr-2" />
          Export
        </Button>
      </template>
    </AdminPageHeader>

    <Card>
      <CardHeader>
        <AdminFiltersBar
          v-model:search="search"
          search-placeholder="Search comments..."
          :filters="[
            {
              key: 'status',
              label: 'Status',
              value: statusFilter,
              options: [
                { value: 'All', label: 'All' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Spam', label: 'Spam' }
              ]
            }
          ]"
          @clear="clearFilters"
          @update:filter="(key, val) => { if (key === 'status') statusFilter = val }"
        />
      </CardHeader>
      <CardContent>
        <Alert v-if="error" variant="destructive">
          <AlertTitle>Error loading comments</AlertTitle>
          <AlertDescription>Failed to load comments. Please try again later.</AlertDescription>
        </Alert>

        <AdminBulkActions :selected-count="selectedIds.length">
          <Button variant="outline" size="sm" @click="handleBulkApprove">
            <Check class="w-4 h-4 mr-2" /> Approve
          </Button>
          <Button variant="outline" size="sm" @click="handleBulkDelete">
            <Trash2 class="w-4 h-4 mr-2" /> Delete
          </Button>
        </AdminBulkActions>

        <div class="rounded-md border overflow-auto">
          <Table>
            <TableCaption>{{ filtered.length }} comments found</TableCaption>
            <TableHeader class="sticky top-0 bg-background">
              <TableRow>
                <TableHead class="w-[50px]">
                  <input type="checkbox" :checked="selectedIds.length===paginated.length && paginated.length>0" @change="selectedIds = $event.target.checked ? paginated.map(c=>c.id) : []" />
                </TableHead>
                <TableHead :aria-sort="sortKey==='author'?sortDir:'none'">
                  <Button variant="ghost" size="sm" @click="toggleSort('author')">Author <ArrowUpDown v-if="sortKey!=='author'" class="ml-2 h-4 w-4" /></Button>
                </TableHead>
                <TableHead :aria-sort="sortKey==='article'?sortDir:'none'">
                  <Button variant="ghost" size="sm" @click="toggleSort('article')">Article <ArrowUpDown v-if="sortKey!=='article'" class="ml-2 h-4 w-4" /></Button>
                </TableHead>
                <TableHead class="hidden md:table-cell">Content</TableHead>
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
                  <TableCell><Skeleton class="h-4 w-32"/></TableCell>
                  <TableCell class="hidden md:table-cell"><Skeleton class="h-4 w-full"/></TableCell>
                  <TableCell><Skeleton class="h-6 w-20"/></TableCell>
                  <TableCell><Skeleton class="h-4 w-16"/></TableCell>
                  <TableCell class="text-right"><Skeleton class="h-8 w-8"/></TableCell>
                </TableRow>
              </template>
              <template v-else-if="paginated.length">
                <TableRow v-for="c in paginated" :key="c.id">
                  <TableCell>
                    <input type="checkbox" :checked="selectedIds.includes(c.id)" @change="selectedIds = $event.target.checked ? [...selectedIds, c.id] : selectedIds.filter(id=>id!==c.id)" />
                  </TableCell>
                  <TableCell class="font-medium">{{ c.author }}</TableCell>
                  <TableCell>{{ c.article }}</TableCell>
                  <TableCell class="hidden md:table-cell max-w-[300px] truncate">{{ c.content }}</TableCell>
                  <TableCell>
                    <Badge :variant="statusVariant(c.status)">{{ c.status }}</Badge>
                  </TableCell>
                  <TableCell>{{ c.date }}</TableCell>
                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="outline" size="sm" aria-label="Open actions">
                          <MoreHorizontal class="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="handleApprove(c.id)">
                          <Check class="w-4 h-4 mr-2" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="handleReject(c.id)">
                          <X class="w-4 h-4 mr-2" /> Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="confirmDelete(c.id)" class="text-destructive">
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
                    <AdminEmptyState title="No comments found" description="Try changing filters." />
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </div>

        <AdminPaginationControls v-model:page="page" v-model:page-size="pageSize" :total="filtered.length" :page-size-options="[5,10,20,50]" />
      </CardContent>
    </Card>

    <AlertDialog :open="!!deleteId" @update:open="deleteId = null">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete comment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the comment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleDelete" class="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog :open="!!actionId" @update:open="actionId = null">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ actionType === 'approve' ? 'Approve comment?' : 'Reject comment?' }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ actionType === 'approve' ? 'This will mark the comment as approved.' : 'This will mark the comment as rejected.' }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleAction" class="bg-primary text-primary-foreground">Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </AdminLayout>
</template>
