<script setup lang="ts">
import { IconAlertCircle } from "@tabler/icons-vue";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<Command class="rounded-lg border shadow-md">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <IconAlertCircle class="mr-2 h-4 w-4" />
          <span>Calendar</span>
        </CommandItem>
        <CommandItem>
          <IconAlertCircle class="mr-2 h-4 w-4" />
          <span>Search Emoji</span>
        </CommandItem>
        <CommandItem>
          <IconAlertCircle class="mr-2 h-4 w-4" />
          <span>Calculator</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <IconAlertCircle class="mr-2 h-4 w-4" />
          <span>Profile</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <IconAlertCircle class="mr-2 h-4 w-4" />
          <span>Billing</span>
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <IconAlertCircle class="mr-2 h-4 w-4" />
          <span>Settings</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
  </div>
</template>
