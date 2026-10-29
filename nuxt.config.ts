import tailwindcss from '@tailwindcss/vite'
import { T } from 'vue-router/dist/index-u4XkZVDG.js';
// https://nuxt.com/docs/api/configuration/nuxt-config

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;


export default defineNuxtConfig({
  modules: ['@nuxt/content', 'shadcn-nuxt'],
  devtools: { enabled: true },
  compatibilityDate: '2026-06-01',
  css: [
    '~/assets/css/main.css'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],

  },
  nitro: {
        externals: {
        traceOptions: { base: process.cwd() }
      }
  },
  app: {
    head: {
      script: [
        {
          key: 'theme-init',
          innerHTML: THEME_INIT_SCRIPT,
          tagPriority: 'critical'
        }
      ],
    },
    layoutTransition: { name: 'page', mode: 'out-in' }
  },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 5,
          searchDepth: 5,
        },
        highlight: {
          theme: 'github-dark',
          langs: ['sql', 'cpp', 'javascript', 'typescript'],
        },
      },
    },
  },
})
