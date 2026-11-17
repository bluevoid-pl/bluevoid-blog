import { defineNuxtPlugin, useNuxtApp } from '#app'
import { highlightAll } from 'microlighter'

/**
 * Code blocks are normally `pre > code`, but line-numbered CodeBlocks render one
 * text node per line, so each line is highlighted on its own.
 * Exclude numbered blocks from `pre > code` to avoid highlighting the container
 * which contains pseudo-element line numbers.
 */
const CODE_SELECTOR = 'pre:not([data-numbered]) > code, [data-slot="code-block-line-content"]'

export default defineNuxtPlugin({
  name: 'microlighter',
  setup() {
    // The CSS Custom Highlight API is not supported everywhere (e.g. Firefox).
    if (typeof Highlight === 'undefined' || typeof Range === 'undefined') return

    const nuxt = useNuxtApp()
    document.documentElement.dataset.syntaxTheme = 'github'

    // highlightAll() replaces every highlight category it knows about, so only one
    // scan may run at a time. Extra requests are queued and re-run after the current one.
    let running = false
    let queued = false

    const highlight = () => {
      if (running) {
        queued = true
        return
      }

      running = true
      // Delay slightly to allow Vue to finish rendering and avoid
      // highlights being invalidated by DOM changes during hydration.
      setTimeout(() => {
        highlightAll({ selector: CODE_SELECTOR })
          .catch(() => {})
          .finally(() => {
            running = false
            if (queued) {
              queued = false
              highlight()
            }
          })
      }, 0)
    }

    highlight()

    nuxt.hook('page:finished', highlight)

    // Components dispatch this after they add or edit code.
    document.addEventListener('syntax-highlight', highlight)
  }
})
