<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div class="flex items-center gap-2">
    <Checkbox id="checkbox_unchecked" />
    <Label for="checkbox_unchecked">Unchecked</Label>
  </div>
  <div class="flex items-center gap-2">
    <Checkbox id="checkbox_checked" :checked="true" />
    <Label for="checkbox_checked">Checked</Label>
  </div>
  </div>
</template>
