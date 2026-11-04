<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div>
    <div class="space-y-1">
      <h4 class="font-medium text-sm leading-none">Radix Primitives</h4>
      <p class="text-muted-foreground text-sm">An open-source UI component library.</p>
    </div>
    <Separator class="my-4" />
    <div class="flex h-5 items-center space-x-4 text-sm gap-2">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  </div>
  </div>
</template>
