<script setup lang="ts">
import { type PrimitiveProps, Primitive } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { type MarkerVariants, markerVariants } from "."
import { cn } from "cn"

interface Props extends PrimitiveProps {
  variant?: MarkerVariants["variant"]
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
})
</script>

<template>
  <Primitive
    data-slot="marker"
    :data-variant="variant"
    :as="as"
    :as-child="asChild"
    :class="cn(markerVariants({ variant }), props.class)"
  >
    <slot />
  </Primitive>
</template>
