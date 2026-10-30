<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
</script>

<template>
  <div>
    <Input type="email" placeholder="Email" />
  </div>
  <div class="grid w-full max-w-sm items-center gap-1.5">
    <Label for="picture">Picture</Label>
    <Input id="picture" type="file" />
  </div>
  <div>
    <Input disabled type="email" placeholder="Email" />
  </div>

  <div class="flex w-full max-w-sm items-center space-x-2">
    <Input type="email" placeholder="Email" />
    <Button type="submit">Subscribe</Button>
  </div>
</template>
