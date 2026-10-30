<script setup lang="ts">
import { IconSearch, IconFilePencil, IconTerminal } from '@tabler/icons-vue';
import { Card } from '@/components/ui/card';
import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
} from '@/components/ui/trace';
</script>

<template>
  <Card class="p-4">
    <div class="flex flex-col gap-4">
      <div>
        <h4 class="mb-2 text-sm font-medium">Static</h4>
        <Trace class="max-w-sm">
          <TraceLine>
            <TraceIcon>
              <IconSearch />
            </TraceIcon>
            <TraceTitle>Searched for minimumReleaseAge</TraceTitle>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <IconFilePencil />
            </TraceIcon>
            <TraceTitle>Read pnpm-workspace.yaml</TraceTitle>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <IconTerminal />
            </TraceIcon>
            <TraceTitle>Ran pnpm install</TraceTitle>
          </TraceLine>
        </Trace>
      </div>
      <div>
        <h4 class="mb-2 text-sm font-medium">With description</h4>
        <Trace class="max-w-sm">
          <TraceLine>
            <TraceIcon>
              <IconFilePencil />
            </TraceIcon>
            <TraceTitle>Edited components/settings/form.tsx</TraceTitle>
            <TraceDescription class="font-mono">+48 -12</TraceDescription>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <IconTerminal />
            </TraceIcon>
            <TraceTitle>Ran pnpm test</TraceTitle>
            <TraceDescription>14s</TraceDescription>
          </TraceLine>
        </Trace>
      </div>
      <div>
        <h4 class="mb-2 text-sm font-medium">Collapsible</h4>
        <Trace class="max-w-sm">
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon>
                  <IconTerminal />
                </TraceIcon>
                <TraceTitle>Ran node --version</TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
              <pre class="mt-2 rounded bg-muted p-2 font-mono text-xs">v24.18.0</pre>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
      </div>
    </div>
  </Card>
</template>
