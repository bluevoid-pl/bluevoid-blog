<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div class="grid w-full max-w-sm items-center gap-1.5">
    <Label for="picture">Picture</Label>
    <Input id="picture" type="file" />
  </div>
  <div class="flex items-center gap-2">
    <Checkbox id="checkbox_unchecked" />
    <Label for="checkbox_unchecked">Unchecked</Label>
  </div>
  </div>
</template>
