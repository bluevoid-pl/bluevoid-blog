<script setup lang="ts">
import { type CollapsibleContentProps, CollapsibleContent } from "reka-ui"

const props = defineProps<CollapsibleContentProps>()
</script>

<template>
  <CollapsibleContent
    data-slot="collapsible-content"
    v-bind="props"
  >
    <slot />
  </CollapsibleContent>
</template>
