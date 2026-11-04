<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Alert class="m-auto w-96">
    <IconAlertCircle class="h-4 w-4" />
    <AlertTitle>Alert</AlertTitle>
    <AlertDescription>Alert description</AlertDescription>
  </Alert>
  <Alert class="m-auto w-96" variant="destructive">
    <IconAlertCircle class="h-4 w-4" />
    <AlertTitle>Alert</AlertTitle>
    <AlertDescription>Alert description</AlertDescription>
  </Alert>
  </div>
</template>
