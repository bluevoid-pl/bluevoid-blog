<script setup lang="ts">
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { RouterLink } from 'vue-router'
import { IconLayoutDashboard as LayoutDashboard, IconUsers as Users, IconMessage as MessageSquare, IconFileText as FileText } from '@tabler/icons-vue'

const routes = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { name: 'Users', to: '/admin/users', icon: Users },
  { name: 'Comments', to: '/admin/comments', icon: MessageSquare },
  { name: 'Articles', to: '/admin/articles', icon: FileText },
]
</script>

<template>
  <SidebarHeader>
    <div class="px-2 py-2">
      <h2 class="text-lg font-semibold">Admin Panel</h2>
    </div>
  </SidebarHeader>
  <SidebarContent>
    <SidebarMenu>
      <SidebarMenuItem v-for="route in routes" :key="route.to">
        <SidebarMenuButton asChild :is-active="$route.path === route.to">
          <RouterLink :to="route.to">
            <component :is="route.icon" class="w-4 h-4" />
            <span>{{ route.name }}</span>
          </RouterLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarContent>
  <SidebarFooter>
    <div class="p-2 text-xs text-muted-foreground">v1.0</div>
  </SidebarFooter>
</template>
