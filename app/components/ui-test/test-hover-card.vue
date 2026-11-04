<script setup lang="ts">
import { IconAlertCircle } from "@tabler/icons-vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
</script>

<template>
  
  <div class="flex flex-col gap-2">
<HoverCard>
    <HoverCardTrigger as-child>
      <Button variant="link">@nextjs</Button>
    </HoverCardTrigger>
    <HoverCardContent class="w-80">
      <div class="flex justify-between space-x-4 gap-2">
        <Avatar>
          <AvatarImage src="/placeholder.png" />
          <AvatarFallback>VC</AvatarFallback>
        </Avatar>
        <div class="space-y-1">
          <h4 class="font-semibold text-sm">@nextjs</h4>
          <p class="text-sm">The React Framework – created and maintained by @vercel.</p>
          <div class="flex items-center pt-2 gap-2">
            <IconAlertCircle class="mr-2 h-4 w-4 opacity-70" />
            <span class="text-muted-foreground text-xs">Joined December 2021</span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
  </div>
</template>
