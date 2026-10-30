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
  <PaginationRoot>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious />
      </PaginationItem>
      <PaginationItem>
        <button>1</button>
      </PaginationItem>
      <PaginationItem>
        <button>2</button>
      </PaginationItem>
      <PaginationItem>
        <button>3</button>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext />
      </PaginationItem>
    </PaginationContent>
  </PaginationRoot>
</template>
