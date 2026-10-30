<script setup lang="ts">
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { lorem } from "./lorem";

const tags = Array.from({ length: 50 }).map((_, i) => `v1.2.0-beta.${50 - i}`);
</script>

<template>
  <ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
    <div>{{ lorem }}</div>
    <div>{{ lorem }}</div>
  </ScrollArea>
  <ScrollArea class="h-72 w-48 rounded-md border">
    <div class="p-4">
      <h4 class="mb-4 font-medium text-sm leading-none">Tags</h4>
      <div v-for="(tag, index) in tags" :key="`TestScrollArea${tag}__${index}`">
        <div class="text-sm">{{ tag }}</div>
        <Separator class="my-2" />
      </div>
    </div>
  </ScrollArea>
</template>
