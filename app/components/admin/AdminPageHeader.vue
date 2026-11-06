<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

defineProps<{
  title: string
  subtitle?: string
  breadcrumb?: { label: string; to?: string }[]
}>()
</script>

<template>
  <div class="space-y-6">
    <Breadcrumb v-if="breadcrumb">
      <BreadcrumbList>
        <template v-for="(item, i) in breadcrumb" :key="i">
          <BreadcrumbItem>
            <BreadcrumbLink v-if="item.to" :href="item.to">{{ item.label }}</BreadcrumbLink>
            <span v-else>{{ item.label }}</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="i < breadcrumb.length - 1" />
        </template>
      </BreadcrumbList>
    </Breadcrumb>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">{{ title }}</h1>
        <p v-if="subtitle" class="text-muted-foreground">{{ subtitle }}</p>
      </div>
      <slot name="actions" />
    </div>
  </div>
</template>
