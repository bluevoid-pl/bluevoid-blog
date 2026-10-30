<script setup lang="ts">
import { ref } from 'vue'
import { IconCheck, IconChevronsDown } from "@tabler/icons-vue";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "cn";

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const open = ref(false)
const value = ref("")

function handleSelect(currentValue: string) {
  value.value = currentValue === value.value ? "" : currentValue
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="outline" role="combobox" :aria-expanded="open" class="w-[200px] justify-between">
        {{ value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...' }}
        <IconChevronsDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command>
        <CommandInput placeholder="Search framework..." />
        <CommandList>
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandItem v-for="framework in frameworks" :key="framework.value" :value="framework.value" @select="handleSelect">
              <IconCheck :class="cn('mr-2 h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')" />
              {{ framework.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
