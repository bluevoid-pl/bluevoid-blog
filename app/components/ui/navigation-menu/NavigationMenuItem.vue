<script setup lang="ts">
import { type NavigationMenuItemProps, NavigationMenuItem } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { cn } from "cn"

const props = defineProps<NavigationMenuItemProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <NavigationMenuItem
    data-slot="navigation-menu-item"
    v-bind="delegatedProps"
    :class="cn('relative', props.class)"
  >
    <slot />
  </NavigationMenuItem>
</template>
