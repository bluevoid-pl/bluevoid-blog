<script lang="ts" setup>
import { type RangeCalendarGridBodyProps, RangeCalendarGridBody } from "reka-ui"

const props = defineProps<RangeCalendarGridBodyProps>()
</script>

<template>
  <RangeCalendarGridBody
    data-slot="range-calendar-grid-body"
    v-bind="props"
  >
    <slot />
  </RangeCalendarGridBody>
</template>
