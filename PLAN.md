# Migration Plan: WordPress -> Nuxt

## Overview
Source: `/old_wordpress/backup/` contains 10 HTML files exported from WordPress blog.
Target: Nuxt 4 with @nuxt/content.

## Steps

1. **Analyze source**
   - 10 HTML files in backup:
     - Matura 2025 zadanie 3.html
     - Mysql - constraints.html
     - Mysql dane.html
     - mysql -data types.html
     - MySQL - Operatory(Draft).html
     - MySQL - Tabele.html
     - Mysql workbench instalacja.html
     - Ostatnia chwila na matur?: C++.html
     - Ostatnia chwila na matur?: Teoria.html
     - Wprowadzenie do baz.html
   - Content is WordPress block markup, mostly Polish tutorials about MySQL and Matura.

2. **Landing page**
   - Create new `content/index.md` with overview and links to blog posts.
   - Use data from WordPress: list of topics, maybe extract first paragraphs.
   - New landing page will be different from old but uses data.

3. **Blog pages**
   - Convert each HTML to Markdown in `content/blog/`.
   - Use filename slugified.
   - Preserve headings and code blocks.
   - For missing metadata, invent title from filename.

4. **Routing**
   - Existing catch-all `[...slug].vue` serves content from `content/`.
   - Create blog index `content/blog/index.md` listing posts.
   - Ensure links work: use relative links in Markdown.

5. **Verification**
   - Run `npm run dev` and check pages.
   - Check links.

## Decisions
- No PHP, pure Nuxt Content.
- If HTML conversion is too complex, use simplified Markdown with summary and link to original HTML as reference.
