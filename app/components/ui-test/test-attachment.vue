<script setup lang="ts">
import { IconFileCode, IconX } from '@tabler/icons-vue';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import { Card } from '@/components/ui/card';
import { lorem } from './lorem';
</script>

<template>
  <Card class="w-full p-2">
    <div class="mx-auto flex w-full max-w-sm flex-col gap-3">
      <AttachmentGroup>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <img src="/placeholder.png" alt="Workspace" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>workspace.png</AttachmentTitle>
            <AttachmentDescription>PNG · 820 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia>
            <IconFileCode />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
            <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove">
              <IconX />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </AttachmentGroup>
      <Attachment state="uploading" class="w-full">
        <AttachmentMedia>
          <span>{{ lorem }}</span>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
          <AttachmentDescription>Uploading · 64%</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Cancel upload">
            <IconX />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  </Card>
</template>
