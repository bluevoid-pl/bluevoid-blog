<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
</script>

<template>
  <TooltipProvider>
  <div class="flex gap-2">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">End</Button>
      </TooltipTrigger>
      <TooltipContent align="end">
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">Start</Button>
      </TooltipTrigger>
      <TooltipContent align="start">
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  </div>
  <div class="flex gap-2">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">bottom</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">left</Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">top</Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">right</Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  </div>
  </TooltipProvider>
</template>
