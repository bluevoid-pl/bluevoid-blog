<script setup lang="ts">
import { Kbd, KbdGroup } from "@/components/ui/kbd";
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <span>Press</span>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>C</Kbd>
      <span>to copy</span>
    </div>
    <KbdGroup>
      <Kbd>Shift</Kbd>
      <Kbd>Alt</Kbd>
      <Kbd>Enter</Kbd>
    </KbdGroup>
  </div>
</template>
