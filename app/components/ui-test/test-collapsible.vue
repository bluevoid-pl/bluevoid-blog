<script setup lang="ts">
import { IconChevronsDown } from "@tabler/icons-vue";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Collapsible class="w-[350px] space-y-2">
    <div class="flex items-center justify-between space-x-4 px-4 gap-2">
      <h4 class="font-semibold text-sm">@peduarte starred 3 repositories</h4>
      <CollapsibleTrigger as-child>
        <Button variant="ghost" size="sm" class="w-9 p-0">
          <IconChevronsDown class="h-4 w-4" />
          <span class="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <div class="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>
    <CollapsibleContent class="space-y-2">
      <div class="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
      <div class="rounded-md border px-4 py-3 font-mono text-sm">@stitches/react</div>
    </CollapsibleContent>
  </Collapsible>
  </div>
</template>
