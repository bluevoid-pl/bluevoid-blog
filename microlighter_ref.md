# Microlighter Reference

This document tracks all current uses of the Microlighter library and related code-block styling across the application. It is intended as a reference for future feature work.

## Overview

Microlighter provides syntax highlighting for code blocks via the CSS Custom Highlight API. The app loads the Microlighter plugin on the client, copies grammar files via Vite, and applies theme styles from `microlighter/themes/github.css`. The `microlighter` class is used in Vue components to style `<pre>` elements and related markup.

## Files Involved

### Package & Config

- **package.json** (line 25)
  ```json
  "microlighter": "^2.2.0"
  ```
  Microlighter is listed as a dependency.

- **nuxt.config.ts**
  - Lines 23-33: `viteStaticCopyGrammars()` copies grammar files from `microlighter` node_modules to `_nuxt/grammars` so that Microlighter's dynamic imports (`./grammars/<language>.js`) resolve correctly.
  - Line 59: `optimizeDeps.exclude` includes `"microlighter"` to prevent Vite's dep pre-bundler from rewriting the relative imports.

### Plugin

- **app/plugins/microlighter.client.ts**
  Imports `highlightAll` from `microlighter` and defines the selector `pre > code, [data-slot="code-block-line-content"]`. The plugin:
  - Sets `document.documentElement.dataset.syntaxTheme = 'github'`.
  - Runs `highlightAll` on page load and via the `syntax-highlight` custom event.
  - Re-runs highlighting on `page:finished` hook for Nuxt navigation.

### CSS

- **app/assets/css/main.css**
  - Imports `microlighter/themes/github.css` at line 6.
  - Re-defines Microlighter token variables to match the app's light/dark theme (lines 84-122). The `microlighter` theme uses `light-dark()` which follows browser preference; the app overrides tokens to respect `.light`/`.dark` classes.

### Vue Components

#### `app/components/ui/code-block/CodeBlockContent.vue`
- Uses the `microlighter` class on the `Primitive` `pre` element (line 62).
- The class list includes `microlighter` plus Tailwind utilities for layout and scrolling.

#### `app/components/content/ProsePre.vue`
- Applies `microlighter` to `<pre>` via `:class="cn('microlighter', props.class, languageClass)"` (line 2).
- Ensures the language class (`language-<lang>`) is added when missing.

#### `app/components/tfwr/Editor.vue`
- Uses `class="microlighter"` on a `<pre>` element (line 45) for an editable code sample.
- Scoped CSS defines `.microlighter` styles (lines 50-70) for font, line-height, and contenteditable behavior.

### Summary of Usage

| Location | Usage |
|----------|-------|
| `app/plugins/microlighter.client.ts` | Plugin that calls `highlightAll` from `microlighter` |
| `app/components/ui/code-block/CodeBlockContent.vue` | Renders code blocks with `microlighter` class |
| `app/components/content/ProsePre.vue` | Wraps prose `<pre>` elements with `microlighter` |
| `app/components/tfwr/Editor.vue` | Editable code editor with `microlighter` class and scoped styles |
| `app/assets/css/main.css` | Imports Microlighter theme and overrides token colors |

## Notes

- The `microlighter` class is used consistently across components to trigger syntax highlighting.
- `data-syntax-theme="github"` is set on `document.documentElement` in the plugin and on the `<html>` attribute in `nuxt.config.ts` (line 74) to ensure the theme is applied.
- Future changes to Microlighter configuration or CSS should be updated in `microlighter.client.ts`, `nuxt.config.ts`, and the CSS import in `app/assets/css/main.css`.
