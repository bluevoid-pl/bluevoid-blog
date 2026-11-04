<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Card class="p-4">
    <div class="flex items-center gap-6">
      <div class="flex flex-col items-center gap-2">
        <Spinner />
        <span class="text-xs">Default</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Spinner class="size-6" />
        <span class="text-xs">Size 6</span>
      </div>
      <div class="flex flex-col items-center gap-2">
        <Spinner class="size-8" />
        <span class="text-xs">Size 8</span>
      </div>
    </div>
  </Card>
  </div>
</template>
