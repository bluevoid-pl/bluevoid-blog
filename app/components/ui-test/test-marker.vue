<script setup lang="ts">
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { IconCircleCheck } from "@tabler/icons-vue";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<div class="flex flex-col gap-4 max-w-md">
    <Marker>
      <MarkerIcon>
        <IconCircleCheck />
      </MarkerIcon>
      <MarkerContent>This is a default marker with an icon and content.</MarkerContent>
    </Marker>
    <Marker variant="separator">
      <MarkerContent>Section A</MarkerContent>
      <MarkerContent>Section B</MarkerContent>
      <MarkerContent>Section C</MarkerContent>
    </Marker>
    <Marker variant="border">
      <MarkerContent>Bordered marker with content spanning multiple lines.</MarkerContent>
    </Marker>
  </div>
  </div>
</template>
