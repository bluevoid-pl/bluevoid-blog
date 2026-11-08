<script setup lang="ts">
import AdminLayout from '~/components/AdminLayout.vue'
import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
import AdminResourceList from '~/components/admin/AdminResourceList.vue'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { IconCheck as Check, IconTrash as Trash2, IconMessage as MessageSquare, IconDots as MoreHorizontal, IconX as X } from '@tabler/icons-vue'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: false })
useHead({ title: 'Comments - Admin' })

const comments = [
  { id: 101, author: 'John Doe', article: 'Vue 3 Tips', content: 'Great article! Very helpful for beginners.', status: 'Approved', date: '2025-10-01' },
  { id: 102, author: 'Jane Roe', article: 'Nuxt Guide', content: 'Needs more examples and code snippets.', status: 'Pending', date: '2025-10-02' },
  { id: 103, author: 'Mike Lee', article: 'Shadcn UI', content: 'Nice!', status: 'Spam', date: '2025-10-03' },
  { id: 104, author: 'Anna Kim', article: 'TypeScript', content: 'Excellent explanation.', status: 'Approved', date: '2025-10-04' },
]

const columns = [
  { key: 'author', label: 'Author', sortable: true },
  { key: 'article', label: 'Article', sortable: true },
  { key: 'content', label: 'Content', sortable: false, class: 'hidden md:table-cell' },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'date', label: 'Date', sortable: true },
]

const filters = [
  {
    key: 'status',
    label: 'Status',
    value: 'All',
    options: [
      { value: 'All', label: 'All' },
      { value: 'Approved', label: 'Approved' },
      { value: 'Pending', label: 'Pending' },
      { value: 'Spam', label: 'Spam' },
    ],
  },
]

const deleteId = ref<number | null>(null)
const actionId = ref<number | null>(null)
const actionType = ref<'approve' | 'reject' | null>(null)

function handleApprove(id: number) {
  actionId.value = id
  actionType.value = 'approve'
}
function handleReject(id: number) {
  actionId.value = id
  actionType.value = 'reject'
}
function confirmDelete(id: number) {
  deleteId.value = id
}
function handleDelete() {
  toast.error('Comment deleted', { description: `Comment #${deleteId.value} removed` })
  deleteId.value = null
}
function handleAction() {
  if (actionType.value === 'approve') {
    toast.success('Comment approved', { description: `Comment #${actionId.value} approved` })
  } else if (actionType.value === 'reject') {
    toast.info('Comment rejected', { description: `Comment #${actionId.value} rejected` })
  }
  actionId.value = null
  actionType.value = null
}
function handleBulkApprove() {
  toast.info('Bulk approve', { description: 'Approving selected comments' })
}
function handleBulkDelete() {
  toast.info('Bulk delete', { description: 'Deleting selected comments' })
}

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

    <AdminResourceList
      title="Comments"
      :items="comments"
      :columns="columns"
      :filters="filters"
      search-placeholder="Search comments..."
      :search-fields="['author', 'article', 'content']"
      :status-field="'status'"
      :status-variant="statusVariant"
    >
      <template #bulk-actions="{ selected }">
        <Button variant="outline" size="sm" @click="handleBulkApprove">
          <Check class="w-4 h-4 mr-2" /> Approve
        </Button>
        <Button variant="outline" size="sm" @click="handleBulkDelete">
          <Trash2 class="w-4 h-4 mr-2" /> Delete
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
            <DropdownMenuItem @click="handleApprove(item.id)">
              <Check class="w-4 h-4 mr-2" /> Approve
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleReject(item.id)">
              <X class="w-4 h-4 mr-2" /> Reject
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
