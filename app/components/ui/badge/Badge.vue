<script setup lang="ts">
import { type PrimitiveProps, Primitive } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { type BadgeVariants, badgeVariants } from "."
import { reactiveOmit } from "@vueuse/core"
import { cn } from "cn"

const props = defineProps<PrimitiveProps & {
  variant?: BadgeVariants["variant"]
  class?: HTMLAttributes["class"]
}>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <Primitive
    data-slot="badge"
    :class="cn(badgeVariants({ variant }), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
