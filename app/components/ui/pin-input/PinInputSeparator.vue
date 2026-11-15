<script setup lang="ts">
import { type PrimitiveProps, Primitive, useForwardProps } from "reka-ui"
import { IconMinus } from '@tabler/icons-vue'

const props = defineProps<PrimitiveProps>()
const forwardedProps = useForwardProps(props)
</script>

<template>
  <Primitive
    data-slot="pin-input-separator"
    v-bind="forwardedProps"
  >
    <slot>
      <IconMinus />
    </slot>
  </Primitive>
</template>
