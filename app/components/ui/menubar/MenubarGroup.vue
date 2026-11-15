<script setup lang="ts">
import { type MenubarGroupProps, MenubarGroup } from "reka-ui"

const props = defineProps<MenubarGroupProps>()
</script>

<template>
  <MenubarGroup
    data-slot="menubar-group"
    v-bind="props"
  >
    <slot />
  </MenubarGroup>
</template>
