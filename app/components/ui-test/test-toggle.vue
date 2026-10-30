<script setup lang="ts">
import { IconAlertCircle } from "@tabler/icons-vue";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
</script>

<template>
  <Card class="p-2">
    <div class="flex gap-2">
      <Toggle aria-label="Toggle italic">
        <IconAlertCircle class="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic" variant="outline">
        <IconAlertCircle class="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <IconAlertCircle class="h-4 w-4" /> Text
      </Toggle>
    </div>
    <div class="flex gap-2">
      <Toggle aria-label="Toggle italic" size="sm">
        <IconAlertCircle class="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic" size="default">
        <IconAlertCircle class="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic" size="lg">
        <IconAlertCircle class="h-4 w-4" />
      </Toggle>
    </div>
  </Card>
</template>
