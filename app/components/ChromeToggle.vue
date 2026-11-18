<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { IconLayoutNavbarCollapse, IconLayoutNavbarFilled } from '@tabler/icons-vue'
import { useChromeVisibility } from '~/composables/useChromeVisibility'

const { hideChrome, toggleChrome } = useChromeVisibility()
</script>

<template>
  <Button
    type="button"
    size="icon-sm"
    variant="outline"
    class="fixed top-2 left-2 z-50"
    :aria-label="hideChrome ? 'Show header and footer' : 'Hide header and footer'"
    :aria-pressed="hideChrome"
    @click="toggleChrome"
  >
    <IconLayoutNavbarFilled v-if="hideChrome" />
    <IconLayoutNavbarCollapse v-else />
  </Button>
</template>
