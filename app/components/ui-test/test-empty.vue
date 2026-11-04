<script setup lang="ts">
import { IconFolderCode } from "@tabler/icons-vue";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <IconFolderCode />
      </EmptyMedia>
      <EmptyTitle>No Projects Yet</EmptyTitle>
      <EmptyDescription>
        You haven't created any projects yet. Get started by creating your first project.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent class="flex-row justify-center gap-2">
      <Button>Create Project</Button>
      <Button variant="outline">Import Project</Button>
    </EmptyContent>
  </Empty>
  </div>
</template>
