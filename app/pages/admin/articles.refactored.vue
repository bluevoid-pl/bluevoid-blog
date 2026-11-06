<script setup lang="ts">
import AdminLayout from '~/components/AdminLayout.vue'
import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
import AdminCrudTable from '~/components/admin/AdminCrudTable.vue'
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { IconCirclePlus as PlusCircle } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'

definePageMeta({ layout: false })
useHead({ title: 'Articles - Admin' })

const loading = ref(true)
const error = ref(false)
onMounted(() => { setTimeout(() => { loading.value = false }, 400) })

const articles = [
  { id: 1, title: 'Getting Started with Nuxt', slug: 'getting-started', status: 'Published', author: 'Alice', date: '2025-09-20' },
  { id: 2, title: 'Shadcn Vue Components', slug: 'shadcn-vue', status: 'Draft', author: 'Bob', date: '2025-10-01' },
  { id: 3, title: 'Advanced TypeScript', slug: 'advanced-ts', status: 'Published', author: 'Carol', date: '2025-08-15' },
]

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true, class: 'hidden md:table-cell' },
  { key: 'author', label: 'Author', sortable: true },
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
      { value: 'Published', label: 'Published' },
      { value: 'Draft', label: 'Draft' }
    ]
  }
]

function handleCreate() {
  toast.info('Create article', { description: 'Opening new article form' })
}

function handleEdit(id: number) {
  toast.info('Edit article', { description: `Opening editor for article #${id}` })
}

function handleView(id: number) {
  toast.info('View article', { description: `Opening article #${id}` })
}

function handleDelete(id: number) {
  toast.error('Article deleted', { description: `Article #${id} removed` })
}
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

    <AdminCrudTable
      :items="articles"
      :columns="columns"
      :filters="filters"
      search-placeholder="Search articles..."
      :search-fields="['title', 'slug']"
      :loading="loading"
      :error="error"
    >
      <template #bulk-actions="{ selected }">
        <Button variant="outline" size="sm" @click="toast.info('Bulk publish', { description: `Publishing ${selected.length} articles` })">
          Publish
        </Button>
        <Button variant="outline" size="sm" @click="toast.info('Bulk delete', { description: `Deleting ${selected.length} articles` })">
          Delete
        </Button>
      </template>
    </AdminCrudTable>
  </AdminLayout>
</template>
