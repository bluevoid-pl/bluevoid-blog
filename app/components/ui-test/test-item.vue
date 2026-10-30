<script setup lang="ts">
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { IconFolder } from "@tabler/icons-vue";
</script>

<template>
  <div class="w-full max-w-md">
    <Item variant="outline">
      <ItemMedia variant="icon">
        <IconFolder />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Project Files</ItemTitle>
        <ItemDescription>Contains source code, assets, and configuration files.</ItemDescription>
      </ItemContent>
    </Item>
    <Item class="mt-4" size="sm">
      <ItemMedia variant="default">
        <div class="h-8 w-8 rounded bg-muted" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Settings</ItemTitle>
        <ItemDescription>Manage your preferences and account details.</ItemDescription>
      </ItemContent>
    </Item>
  </div>
</template>
