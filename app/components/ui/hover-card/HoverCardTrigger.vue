<script setup lang="ts">
import { type HoverCardTriggerProps, HoverCardTrigger } from "reka-ui"

const props = defineProps<HoverCardTriggerProps>()
</script>

<template>
  <HoverCardTrigger
    data-slot="hover-card-trigger"
    v-bind="props"
  >
    <slot />
  </HoverCardTrigger>
</template>
