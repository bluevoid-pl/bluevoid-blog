import { defineNuxtPlugin } from '#app'
import { watch } from 'vue'
import { applyChromeVisibility, useChromeVisibility } from '~/composables/useChromeVisibility'

export default defineNuxtPlugin({
  name: 'chrome-visibility',
  setup() {
    const { hideChrome } = useChromeVisibility()

    // Applied before the first render so a reload never flashes the header back in,
    // and kept in sync for every other writer of the stored state.
    watch(hideChrome, applyChromeVisibility, { immediate: true })
  }
})
