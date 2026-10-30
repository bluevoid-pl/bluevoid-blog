<script setup lang="ts">
import { IconAlertCircle } from '@tabler/icons-vue';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
</script>

<template>
  <div class="flex flex-col gap-2 rounded bg-white p-2 dark:bg-stone-950">
    <h3>Avatar</h3>
    <Avatar>
      <AvatarImage
        src="https://mateusz-kifner.github.io/assets/mk_bwm_small.jpg"
        alt="@mateuszkifner"
      />
      <AvatarFallback>MK</AvatarFallback>
    </Avatar>
  </div>
  <div class="flex flex-col gap-2 rounded bg-white p-2 dark:bg-stone-950">
    <h3>Avatar Fallback text</h3>
    <Avatar>
      <AvatarImage src="" alt="@mateuszkifner" />
      <AvatarFallback>MK</AvatarFallback>
    </Avatar>
  </div>
  <div class="flex flex-col gap-2 rounded bg-white p-2 dark:bg-stone-950">
    <h3>Avatar Fallback Icon</h3>
    <Avatar>
      <AvatarImage src="" alt="@mateuszkifner" />
      <AvatarFallback>
        <IconAlertCircle />
      </AvatarFallback>
    </Avatar>
  </div>
</template>
