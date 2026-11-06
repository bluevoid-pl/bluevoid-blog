<script setup lang="ts">
import AdminLayout from '~/components/AdminLayout.vue'
import AdminPageHeader from '~/components/admin/AdminPageHeader.vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconUsers as Users, IconFileText as FileText, IconMessage as MessageSquare, IconActivity as Activity } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'

definePageMeta({ layout: false })
useHead({ title: 'Dashboard - Admin' })

const stats = [
  { label: 'Total Users', value: 128, icon: Users, change: '+12%' },
  { label: 'Articles', value: 42, icon: FileText, change: '+5%' },
  { label: 'Pending Comments', value: 7, icon: MessageSquare, change: '-3%' },
  { label: 'Active Sessions', value: 34, icon: Activity, change: '+8%' },
]

function quickAction(name: string) {
  toast.info(name, { description: 'Action triggered' })
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <AdminPageHeader title="Admin Dashboard" subtitle="Overview of your content management system" :breadcrumb="[{ label: 'Admin', to: '/admin' }, { label: 'Dashboard' }]" />

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card v-for="s in stats" :key="s.label">
          <CardHeader class="flex items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium">{{ s.label }}</CardTitle>
            <component :is="s.icon" class="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ s.value }}</div>
            <CardDescription class="text-xs">
              <Badge as="span" variant="outline" class="mt-1">{{ s.change }}</Badge>
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent class="grid gap-2">
            <Button variant="outline" class="justify-start" @click="quickAction('Create New User')">Create New User</Button>
            <Button variant="outline" class="justify-start" @click="quickAction('Create New Article')">Create New Article</Button>
            <Button variant="outline" class="justify-start" @click="quickAction('Review Pending Comments')">Review Pending Comments</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 3 actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul class="space-y-3 text-sm">
              <li class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-green-500"/>User Alice updated profile</li>
              <li class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-blue-500"/>Article "Shadcn Vue Components" published</li>
              <li class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-amber-500"/>Comment #102 approved</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  </AdminLayout>
</template>
