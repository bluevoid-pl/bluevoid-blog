<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div class="flex flex-col items-center gap-2">
    <div class="flex items-center gap-2">
      <Switch id="airplane-mode" />
      <Label for="airplane-mode">Airplane Mode</Label>
    </div>
    <div class="flex items-center gap-2">
      <Switch id="color-mode" />
      <Label for="color-mode">Airplane Mode</Label>
    </div>
  </div>
  </div>
</template>
