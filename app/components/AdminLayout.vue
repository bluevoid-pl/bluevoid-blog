<script setup lang="ts">
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'

useHead({ title: 'Admin' })
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <AdminSidebar />
    </Sidebar>
    <SidebarInset class="flex-1">
      <main class="p-6">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
