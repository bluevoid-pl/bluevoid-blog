<script setup lang="ts">
import { AspectRatio } from '@/components/ui/aspect-ratio';
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div class="h-36 max-h-3xl min-h-36 w-36 min-w-36 max-w-3xl resize overflow-auto border border-red-500 border-solid">
    <AspectRatio :ratio="16 / 9">
      <img
        src="/placeholder.png"
        alt="test"
        class="h-full w-full rounded-md bg-red-200 object-cover"
      />
    </AspectRatio>
  </div>
  </div>
</template>
