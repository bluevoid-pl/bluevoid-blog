<script setup lang="ts">
import { IconCalendar } from "@tabler/icons-vue";
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "cn";
import { today } from "@internationalized/date";

const date = ref(today());
const date2 = ref(today());
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <Calendar :model-value="date" @update:model-value="date = $event" class="rounded-md border" />
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline" :class="cn('w-[240px] pl-3 text-left font-normal')">
          {{ date2 ? date2.toString() : 'Pick a date' }}
          <IconCalendar class="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar
          :model-value="date2"
          @update:model-value="date2 = $event"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
