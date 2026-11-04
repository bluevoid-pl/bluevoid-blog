<script setup lang="ts">
import { Slider } from "@/components/ui/slider";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Slider :default-value="[50]" :max="100" :step="1" class="w-[60%]" />
  <Slider :default-value="[50]" :max="100" :step="10" class="w-[60%]" />
  </div>
</template>
