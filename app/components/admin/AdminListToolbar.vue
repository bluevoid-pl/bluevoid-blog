<script setup lang="ts">
import AdminFiltersBar from '~/components/admin/AdminFiltersBar.vue'
import AdminBulkActions from '~/components/admin/AdminBulkActions.vue'

defineProps<{
  searchModelValue?: string
  searchPlaceholder?: string
  filters?: any[]
  selectedCount?: number
  bulkActions?: Array<{
    label: string
    icon?: any
    onClick: () => void
  }>
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:filter': [key: string, value: string]
  'clear': []
}>()
</script>

<template>
  <div class="space-y-4">
    <AdminFiltersBar
      v-model:search="searchModelValue"
      :search-placeholder="searchPlaceholder"
      :filters="filters"
      @update:search="(v) => emit('update:search', v)"
      @update:filter="(k, v) => emit('update:filter', k, v)"
      @clear="emit('clear')"
    />

    <AdminBulkActions :selected-count="selectedCount">
      <template v-for="(action, idx) in bulkActions" :key="idx">
        <Button variant="outline" size="sm" @click="action.onClick">
          <component v-if="action.icon" :is="action.icon" class="w-4 h-4 mr-2" />
          {{ action.label }}
        </Button>
      </template>
    </AdminBulkActions>
  </div>
</template>
