<script setup lang="ts">
import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ResizablePanel } from "@/components/ui/resizable";
import { ResizableHandle } from "@/components/ui/resizable";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<ResizablePanelGroup direction="horizontal" class="max-w-md h-[400px] rounded-lg border">
    <ResizablePanel :default-size="50">
      <div class="flex h-[200px] items-center justify-center p-6 gap-2">
        <span class="font-semibold">One</span>
      </div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel :default-size="50">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel :default-size="25">
          <div class="flex h-full items-center justify-center p-6 gap-2">
            <span class="font-semibold">Two</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :default-size="75">
          <div class="flex h-full items-center justify-center p-6 gap-2">
            <span class="font-semibold">Three</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  </ResizablePanelGroup>
  </div>
</template>
