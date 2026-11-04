<script setup lang="ts">
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import { Card } from "@/components/ui/card";

const code = `// ...
// code here
// ...`;
</script>

<template>
  <div class="flex flex-col gap-2">
    <Card class="w-full p-2">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton :value="code" />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent :line-numbers="true">{{ code }}</CodeBlockContent>
      </CodeBlock>
    </Card>
  </div>
</template>
