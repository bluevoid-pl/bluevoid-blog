<script setup lang="ts">
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message";
</script>

<template>
  <MessageGroup>
    <Message>
      <MessageAvatar>
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          A
        </div>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>Alex</MessageHeader>
        <div class="rounded-lg bg-muted p-3">Hello! How are you today?</div>
        <MessageFooter>10:00 AM</MessageFooter>
      </MessageContent>
    </Message>

    <Message align="end">
      <MessageContent>
        <MessageHeader>You</MessageHeader>
        <div class="rounded-lg bg-primary text-primary-foreground p-3">
          I'm doing great, thanks! How about you?
        </div>
        <MessageFooter>10:01 AM</MessageFooter>
      </MessageContent>
    </Message>

    <Message>
      <MessageAvatar>
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          A
        </div>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>Alex</MessageHeader>
        <div class="rounded-lg bg-muted p-3">Pretty good. Want to grab coffee later?</div>
        <MessageFooter>10:02 AM</MessageFooter>
      </MessageContent>
    </Message>
  </MessageGroup>
</template>
