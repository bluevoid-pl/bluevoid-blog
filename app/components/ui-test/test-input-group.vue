<script setup lang="ts">
import { IconSearch } from "@tabler/icons-vue";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
</script>

<template>
  <InputGroup>
    <InputGroupAddon align="inline-start">
      <IconSearch />
    </InputGroupAddon>
    <InputGroupInput placeholder="Search..." />
    <InputGroupAddon align="inline-end">
      <Button variant="ghost" size="xs">
        Clear
      </Button>
    </InputGroupAddon>
  </InputGroup>
  <InputGroup class="mt-4">
    <InputGroupAddon align="inline-start">https://</InputGroupAddon>
    <InputGroupInput placeholder="example.com" />
    <InputGroupAddon align="inline-end">
      <Button variant="outline" size="xs">
        Go
      </Button>
    </InputGroupAddon>
  </InputGroup>
</template>
