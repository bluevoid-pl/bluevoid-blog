<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { IconDots as MoreHorizontal } from '@tabler/icons-vue'

defineProps<{
  actions?: Array<{
    label: string
    icon?: any
    onClick: () => void
    variant?: 'default' | 'destructive'
  }>
}>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" aria-label="Open actions">
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="(action, idx) in actions"
        :key="idx"
        @click="action.onClick"
        :class="action.variant === 'destructive' ? 'text-destructive' : ''"
      >
        <component v-if="action.icon" :is="action.icon" class="w-4 h-4 mr-2" />
        {{ action.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
