<script lang="ts" setup>
import { type DrawerCloseProps, DrawerClose } from "reka-ui"

const props = defineProps<DrawerCloseProps>()
</script>

<template>
  <DrawerClose
    data-slot="drawer-close"
    v-bind="props"
  >
    <slot />
  </DrawerClose>
</template>
