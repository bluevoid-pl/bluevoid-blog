<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer data-site-chrome="footer">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
      <p class="text-sm text-muted-foreground">
        BlueVoid &copy; {{ year }} &middot; Mateusz Kifner
      </p>
      <NuxtLink to="/test" class="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline">
        Tests
      </NuxtLink>
    </div>
  </footer>
</template>
