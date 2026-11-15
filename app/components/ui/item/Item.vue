<script setup lang="ts">
import { type PrimitiveProps, Primitive } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { type ItemVariants, itemVariants } from "."
import { cn } from "cn"

const props = withDefaults(defineProps<PrimitiveProps & {
  class?: HTMLAttributes["class"]
  variant?: ItemVariants["variant"]
  size?: ItemVariants["size"]
}>(), {
  as: "div",
})
</script>

<template>
  <Primitive
    data-slot="item"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="cn(itemVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
