<script setup lang="ts">
import { Button } from '~/components/ui/button'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t bg-background/80 backdrop-blur">
    <div class="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
      <p class="text-sm text-muted-foreground">
        BlueVoid &copy; {{ year }} &middot; Mateusz Kifner
      </p>
      <div class="flex items-center gap-4">
        <Button asChild variant="secondary" size="sm">
          <NuxtLink to="/test">Tests</NuxtLink>
        </Button>
      </div>
    </div>
  </footer>
</template>
