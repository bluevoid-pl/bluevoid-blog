<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '~/components/ui/badge'
import type { PrefillResult } from '~/utils/tfwr-prefill'

const props = defineProps<{
  /** Every item the game has, so items held in zero amount still show up. */
  items: Record<string, number>
  prefill: PrefillResult
}>()

const entries = computed(() =>
  Object.entries(props.items).sort(([a], [b]) => a.localeCompare(b)),
)
</script>

<template>
  <div v-if="entries.length || prefill.status === 'error'" data-testid="items-panel">
    <div v-if="prefill.status === 'ok'" class="mb-2 text-right text-xs text-muted-foreground">
      Prefilled from the first comment
    </div>
    <div v-if="prefill.status === 'error'" class="mb-2 text-sm text-destructive">
      Prefill comment: {{ prefill.message }}
    </div>
    <div class="flex flex-wrap gap-1.5">
      <Badge
        v-for="[item, amount] in entries"
        :key="item"
        variant="secondary"
        class="font-mono"
        :class="{ 'opacity-50': amount === 0 }"
      >
        {{ item }}: {{ amount.toLocaleString() }}
      </Badge>
    </div>
  </div>
</template>
