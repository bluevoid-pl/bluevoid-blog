<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
</script>

<template>
  <Badge>primary</Badge>
  <Badge variant="secondary">secondary</Badge>
  <Badge variant="outline">outline</Badge>
  <Badge variant="destructive">destructive</Badge>
  <Badge class="border-transparent bg-green-700 hover:bg-green-700/80">custom color</Badge>
</template>
