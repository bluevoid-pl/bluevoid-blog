<script setup lang="ts">
import { Badge } from '~/components/ui/badge'

const year = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
      <Badge variant="secondary" class="text-base bg-background">
        BlueVoid &copy; {{ year }} &middot; Mateusz Kifner
      </Badge>
      <div class="flex items-center gap-2">
        <NuxtLink to="/korki/Flappy_Fish">
        <Badge variant="secondary" class="text-base bg-background">Korki</Badge>
        </NuxtLink>
        <NuxtLink to="/test">
          <Badge variant="secondary" class="text-base bg-background">Tests</Badge>
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
