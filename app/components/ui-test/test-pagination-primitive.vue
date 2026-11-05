<script setup lang="ts">
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from "@/components/ui/pagination";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<PaginationRoot :items-per-page="10" :total="30">
    <PaginationContent>
      <PaginationPrevious />
      <PaginationItem :value="1">1</PaginationItem>
      <PaginationItem :value="2">2</PaginationItem>
      <PaginationItem :value="3">3</PaginationItem>
      <PaginationEllipsis />
      <PaginationNext />
    </PaginationContent>
  </PaginationRoot>
  </div>
</template>
