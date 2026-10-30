<script setup lang="ts">
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Message, MessageAvatar, MessageContent, MessageHeader } from "@/components/ui/message";
</script>

<template>
  <MessageScrollerProvider>
  <MessageScroller class="h-[400px]">
    <MessageScrollerViewport>
      <MessageScrollerContent>
        <MessageScrollerItem v-for="i in 20" :key="i">
          <Message :align="i % 2 === 0 ? 'start' : 'end'">
            <MessageAvatar v-if="i % 2 === 0">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {{ i }}
              </div>
            </MessageAvatar>
            <MessageContent>
              <MessageHeader>{{ i % 2 === 0 ? 'User' : 'You' }}</MessageHeader>
              <div class="rounded-lg bg-muted p-3">
                This is message {{ i + 1 }} in the scroller. It demonstrates the message scroller component with auto-scroll behavior.
              </div>
            </MessageContent>
          </Message>
        </MessageScrollerItem>
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
  </MessageScrollerProvider>
</template>
