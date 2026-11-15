<script setup lang="ts">
import { ref } from 'vue';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const show = ref(false);
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div v-if="!show" class="w-full max-h-[500px] overflow-auto border rounded-lg p-4">
    <Button @click="show = true">Open Sidebar</Button>
  </div>
  <div v-else class="w-full max-h-[500px] overflow-auto border rounded-lg">
    <SidebarProvider>
      <div class="flex h-[400px] w-full gap-2">
        <Sidebar>
          <SidebarHeader>
            <div class="p-2">
              <span class="font-medium">Sidebar</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Messages</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Settings</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Analytics</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Reports</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Sign out</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button size="sm" variant="outline" @click="show = false" class="w-full">
                  Close
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div class="flex flex-1 flex-col gap-2">
          <header class="flex items-center justify-between p-4 border-b">
            <span>Main content</span>
            <SidebarInput placeholder="Search..." />
          </header>
          <main class="flex-1 p-4 overflow-auto">
            <p>Sidebar is now visible. Click Close at the bottom of the sidebar to hide it.</p>
          </main>
        </div>
      </div>
    </SidebarProvider>
  </div>
  </div>
</template>
