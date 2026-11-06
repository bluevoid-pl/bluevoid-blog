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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IconPencil as Pencil, IconTrash as Trash2, IconUserPlus as UserPlus, IconDots as MoreHorizontal, IconArrowsUpDown as ArrowUpDown } from '@tabler/icons-vue'
import { ref, computed, watch } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: false })
useHead({ title: 'Users - Admin' })

const error = ref(false)

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', createdAt: '2024-01-10' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', createdAt: '2024-02-15' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'User', status: 'Inactive', createdAt: '2024-03-20' },
  { id: 4, name: 'David Lee', email: 'david@example.com', role: 'User', status: 'Active', createdAt: '2024-04-05' },
]

const search = ref('')
const roleFilter = ref('All')
const sortKey = ref<'name'|'email'|'role'|'createdAt'>('name')
const sortDir = ref<'asc'|'desc'>('asc')
const deleteId = ref<number | null>(null)
const page = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 20, 50]
const selectedIds = ref<number[]>([])
const debouncedSearch = ref('')
let searchTimer: number | null = null
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { debouncedSearch.value = search.value }, 300)
})

const filtered = computed(() => {
  let list = [...users]
  if (debouncedSearch.value) {
    list = list.filter(u => u.name.toLowerCase().includes(debouncedSearch.value.toLowerCase()) || u.email.toLowerCase().includes(debouncedSearch.value.toLowerCase()))
  }
  if (roleFilter.value !== 'All') {
    list = list.filter(u => u.role === roleFilter.value)
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

watch([debouncedSearch, roleFilter, sortKey, sortDir], () => {
  page.value = 1
  selectedIds.value = []
})

function toggleSort(key: typeof sortKey.value) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function handleEdit(id: number) { toast.info('Edit user', { description: `Opening editor for user #${id}` }) }
function confirmDelete(id: number) { deleteId.value = id }
function handleDelete() { toast.success('User deleted', { description: `User #${deleteId.value} removed` }); deleteId.value = null }
function handleCreate() { toast.info('Create user', { description: 'Opening new user form' }) }
function handleBulkDelete() { if (!selectedIds.value.length) { toast.error('No users selected', { description: 'Select users to delete' }); return } toast.info('Bulk delete', { description: `Deleting ${selectedIds.value.length} users` }) }
function handleBulkExport() { if (!selectedIds.value.length) { toast.error('No users selected', { description: 'Select users to export' }); return } toast.info('Bulk export', { description: `Exporting ${selectedIds.value.length} users` }) }
function clearFilters() { search.value = ''; roleFilter.value = 'All' }

const statusVariant = (s: string) => s === 'Active' ? 'default' : s === 'Inactive' ? 'secondary' : 'outline'
</script>

<template>
  <AdminLayout>
    <AdminPageHeader title="Users" :breadcrumb="[{ label: 'Admin', to: '/admin' }, { label: 'Users' }]">
      <template #actions>
        <Button @click="handleCreate">
          <UserPlus class="w-4 h-4 mr-2" />
          New User
        </Button>
      </template>
    </AdminPageHeader>

    <Card>
      <CardHeader>
        <AdminFiltersBar
          v-model:search="search"
          search-placeholder="Search by name or email..."
          :filters="[
            {
              key: 'role',
              label: 'Role',
              value: roleFilter,
              options: [
                { value: 'All', label: 'All Roles' },
                { value: 'Admin', label: 'Admin' },
                { value: 'Editor', label: 'Editor' },
                { value: 'User', label: 'User' }
              ]
            }
          ]"
          @clear="clearFilters"
          @update:filter="(key, val) => { if (key === 'role') roleFilter = val }"
        />
      </CardHeader>
      <CardContent>
        <Alert v-if="error" variant="destructive">
          <AlertTitle>Error loading users</AlertTitle>
          <AlertDescription>Failed to load users. Please try again later.</AlertDescription>
        </Alert>

        <AdminBulkActions :selected-count="selectedIds.length">
          <Button variant="outline" size="sm" @click="handleBulkDelete">
            <Trash2 class="w-4 h-4 mr-2" /> Delete
          </Button>
          <Button variant="outline" size="sm" @click="handleBulkExport">
            Export
          </Button>
        </AdminBulkActions>

        <div class="rounded-md border overflow-auto">
          <Table>
            <TableCaption>{{ filtered.length }} users found</TableCaption>
            <TableHeader class="sticky top-0 bg-background">
              <TableRow>
                <TableHead class="w-[50px]">
                  <input type="checkbox" :checked="selectedIds.length===paginated.length && paginated.length>0" @change="selectedIds = $event.target.checked ? paginated.map(u=>u.id) : []" />
                </TableHead>
                <TableHead class="w-[200px]" :aria-sort="sortKey==='name'?sortDir:'none'">
                  <Button variant="ghost" size="sm" @click="toggleSort('name')">Name <ArrowUpDown v-if="sortKey!=='name'" class="ml-2 h-4 w-4" /></Button>
                </TableHead>
                <TableHead class="hidden md:table-cell" :aria-sort="sortKey==='email'?sortDir:'none'">
                  <Button variant="ghost" size="sm" @click="toggleSort('email')">Email <ArrowUpDown v-if="sortKey!=='email'" class="ml-2 h-4 w-4" /></Button>
                </TableHead>
                <TableHead :aria-sort="sortKey==='role'?sortDir:'none'">
                  <Button variant="ghost" size="sm" @click="toggleSort('role')">Role <ArrowUpDown v-if="sortKey!=='role'" class="ml-2 h-4 w-4" /></Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="paginated.length">
                <TableRow v-for="user in paginated" :key="user.id">
                  <TableCell>
                    <input type="checkbox" :checked="selectedIds.includes(user.id)" @change="selectedIds = $event.target.checked ? [...selectedIds, user.id] : selectedIds.filter(id=>id!==user.id)" />
                  </TableCell>
                  <TableCell class="font-medium">{{ user.name }}</TableCell>
                  <TableCell class="hidden md:table-cell">{{ user.email }}</TableCell>
                  <TableCell>{{ user.role }}</TableCell>
                  <TableCell>
                    <Badge :variant="statusVariant(user.status)">{{ user.status }}</Badge>
                  </TableCell>
                  <TableCell class="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="outline" size="sm" aria-label="Open actions">
                          <MoreHorizontal class="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click="handleEdit(user.id)">
                          <Pencil class="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="confirmDelete(user.id)" class="text-destructive">
                          <Trash2 class="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow>
                  <TableCell colspan="6">
                    <AdminEmptyState title="No users found" description="No users match your filters. Try adjusting search." />
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
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user.
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
