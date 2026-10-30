<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
</script>

<template>
  <form class="w-2/3 space-y-6">
    <div class="space-y-2">
      <Label for="username">Username</Label>
      <Input id="username" placeholder="shadcn" />
      <p class="text-sm text-muted-foreground">This is your public display name.</p>
    </div>
    <Button type="submit">Submit</Button>
  </form>
</template>
