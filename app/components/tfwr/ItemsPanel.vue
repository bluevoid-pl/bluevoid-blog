<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '~/components/ui/badge'
import type { PrefillResult } from '~/utils/tfwr-prefill'

const props = defineProps<{
  inventory: Record<string, number>
  prefill: PrefillResult
}>()

const items = computed(() =>
  Object.entries(props.inventory)
    .filter(([, amount]) => amount > 0)
    .sort(([a], [b]) => a.localeCompare(b)),
)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xl font-semibold">Items</h2>
      <span v-if="prefill.status === 'ok'" class="text-xs text-muted-foreground">
        Prefilled from first comment
      </span>
    </div>
    <div v-if="prefill.status === 'error'" class="mb-2 text-sm text-destructive">
      Prefill comment: {{ prefill.message }}
    </div>
    <div v-if="items.length" class="flex flex-wrap gap-1.5">
      <Badge v-for="[item, amount] in items" :key="item" variant="secondary" class="font-mono">
        {{ item }}: {{ amount.toLocaleString() }}
      </Badge>
    </div>
    <p v-else class="text-sm text-muted-foreground">
      No items. Harvest entities or prefill with a comment like <code class="font-mono text-xs"># {"wood": 1000}</code>.
    </p>
  </div>
</template>
