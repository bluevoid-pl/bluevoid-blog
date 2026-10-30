<script setup lang="ts">
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '@/components/ui/bubble';
import { Card } from '@/components/ui/card';
import { lorem } from './lorem';
</script>

<template>
  <Card class="w-full p-2">
    <BubbleGroup>
      <Bubble variant="default" align="start">
        <BubbleContent>{{ lorem }}</BubbleContent>
      </Bubble>
      <Bubble variant="secondary" align="end">
        <BubbleContent>Reply to message</BubbleContent>
      </Bubble>
      <Bubble variant="muted" align="start">
        <BubbleContent>{{ lorem }}</BubbleContent>
        <BubbleReactions>
          <span>Like</span>
        </BubbleReactions>
      </Bubble>
    </BubbleGroup>
  </Card>
</template>
