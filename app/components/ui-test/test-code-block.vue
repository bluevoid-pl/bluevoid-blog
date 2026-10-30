<script setup lang="ts">
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
  useHighlightedCode,
} from "@/components/ui/code-block";
import { Card } from "@/components/ui/card";

const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: "You are a helpful assistant. Answer in one short paragraph.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`;

const lines = useHighlightedCode(code, "ts");
</script>

<template>
  <Card class="w-full p-2">
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton :value="code" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent :line-numbers="true">
        <CodeBlockLine v-for="(line, index) in lines" :key="index">{{ line }}</CodeBlockLine>
      </CodeBlockContent>
    </CodeBlock>
  </Card>
</template>
