<script setup lang="ts">
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'

useHead({ title: 'Admin' })
</script>

<template>
  <SidebarProvider>
    <div class="min-h-screen flex w-full">
      <Sidebar>
        <AdminSidebar />
      </Sidebar>
      <SidebarInset class="flex-1">
        <main class="p-6">
          <slot />
        </main>
      </SidebarInset>
    </div>
  </SidebarProvider>
</template>
