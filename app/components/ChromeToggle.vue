<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { IconLayoutNavbarCollapse, IconLayoutNavbarFilled } from '@tabler/icons-vue'
import { useChromeVisibility } from '~/composables/useChromeVisibility'
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'

const { hideChrome, toggleChrome } = useChromeVisibility()
const route = useRoute()

const isTfwrPage = computed(() => {
  const path = route.path
  return path === '/tfwr' || path === '/tfwr3D' || path.startsWith('/tfwr/')
})

// Ensure chrome is always visible on non-tfwr pages
watch(isTfwrPage, (isTfwr) => {
  if (!isTfwr) {
    hideChrome.value = false
  }
}, { immediate: true })
</script>

<template>
  <Button
    v-if="isTfwrPage"
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
