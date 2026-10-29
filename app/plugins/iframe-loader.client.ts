import { defineNuxtPlugin } from '#app'
import IframeLoader from '~/components/IframeLoader.vue'

export default defineNuxtPlugin({
  name: 'iframe-loader',
  setup() {
    if (typeof window === 'undefined') return

    const observer = new MutationObserver(() => {
      document.querySelectorAll('.play_iframe').forEach(el => {
        if (el.dataset.iframeLoaded) return
        el.dataset.iframeLoaded = 'true'

        const src = el.getAttribute('data-src') || ''
        const img = el.getAttribute('data-img') || ''
        const message = el.getAttribute('data-message') || 'Kliknij aby za\u0142adowa\u0107'
        const style = el.getAttribute('style') || ''

        // Create a Vue app for the loader
        const container = document.createElement('div')
        el.parentNode?.insertBefore(container, el)
        el.style.display = 'none'

        // Use Vue to mount IframeLoader
        // This is a simplified approach; in practice we would use h() to mount
        // For now, we just inject minimal HTML to mimic component
        container.innerHTML = `
          <div class="iframe-loader" style="${style}">
            <div class="iframe-preview">
              <img src="${img}" alt="Preview" class="iframe-preview-img" />
              <div class="iframe-overlay">
                <span class="iframe-message">${message}</span>
              </div>
            </div>
          </div>
        `
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })
    // Initial run
    observer.takeRecords()
  }
})
