<script setup lang="ts">
import AdminLayout from '~/components/AdminLayout.vue'
import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
import AdminResourceList from '~/components/admin/AdminResourceList.vue'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { IconPencil as Pencil, IconTrash as Trash2, IconUserPlus as UserPlus, IconDots as MoreHorizontal } from '@tabler/icons-vue'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: false })
useHead({ title: 'Users - Admin' })

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', createdAt: '2024-01-10' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', createdAt: '2024-02-15' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'User', status: 'Inactive', createdAt: '2024-03-20' },
  { id: 4, name: 'David Lee', email: 'david@example.com', role: 'User', status: 'Active', createdAt: '2024-04-05' },
]

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true, class: 'hidden md:table-cell' },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'createdAt', label: 'Created', sortable: true },
]

const filters = [
  {
    key: 'role',
    label: 'Role',
    value: 'All',
    options: [
      { value: 'All', label: 'All Roles' },
      { value: 'Admin', label: 'Admin' },
      { value: 'Editor', label: 'Editor' },
      { value: 'User', label: 'User' },
    ],
  },
]

const deleteId = ref<number | null>(null)

function handleEdit(id: number) {
  toast.info('Edit user', { description: `Opening editor for user #${id}` })
}
function confirmDelete(id: number) {
  deleteId.value = id
}
function handleDelete() {
  toast.success('User deleted', { description: `User #${deleteId.value} removed` })
  deleteId.value = null
}
function handleCreate() {
  toast.info('Create user', { description: 'Opening new user form' })
}
function handleBulkDelete() {
  toast.info('Bulk delete', { description: 'Deleting selected users' })
}
function handleBulkExport() {
  toast.info('Bulk export', { description: 'Exporting selected users' })
}

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

    <AdminResourceList
      title="Users"
      :items="users"
      :columns="columns"
      :filters="filters"
      search-placeholder="Search by name or email..."
      :search-fields="['name', 'email']"
      :status-field="'status'"
      :status-variant="statusVariant"
    >
      <template #bulk-actions="{ selected }">
        <Button variant="outline" size="sm" @click="handleBulkDelete">
          <Trash2 class="w-4 h-4 mr-2" /> Delete
        </Button>
        <Button variant="outline" size="sm" @click="handleBulkExport">
          Export
        </Button>
      </template>
      <template #row-actions="{ item }">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm" aria-label="Open actions">
              <MoreHorizontal class="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="handleEdit(item.id)">
              <Pencil class="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem @click="confirmDelete(item.id)" class="text-destructive">
              <Trash2 class="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </AdminResourceList>

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
