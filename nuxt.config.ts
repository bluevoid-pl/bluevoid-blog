import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/content', 'shadcn-nuxt'],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  css: [
    '~/assets/css/main.css'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],

  },
  nitro: {
  noExternals:true
  },
  app: {
    layoutTransition: { name: 'page', mode: 'out-in' }
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
          langs: ['sql', 'cpp', 'javascript', 'typescript'],
        },
      },
    },
  },
})
