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
    <PaginationRoot>
      <PaginationContent>
        <PaginationPrevious />
        <PaginationItem>1</PaginationItem>
        <PaginationItem>2</PaginationItem>
        <PaginationItem>3</PaginationItem>
        <PaginationEllipsis />
        <PaginationNext />
      </PaginationContent>
    </PaginationRoot>
  </div>
</template>
