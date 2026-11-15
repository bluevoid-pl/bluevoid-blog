import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// https://nuxt.com/docs/api/configuration/nuxt-config

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

const PYODIDE_EXCLUDE = [
  "!**/*.{md,html}",
  "!**/*.d.ts",
  "!**/*.whl",
  "!**/pyodide/node_modules",
];

/**
 * MicroLighter loads its language grammars with a relative dynamic import
 * (`./grammars/<language>.js`) from the chunk that calls `highlightAll()`, so
 * the grammar files have to exist next to that chunk in the client bundle.
 */
function viteStaticCopyGrammars() {
  const microlighterDir = dirname(fileURLToPath(import.meta.resolve("microlighter")));
  return viteStaticCopy({
    targets: [
      {
        src: join(microlighterDir, "grammars", "*.js").replace(/\\/g, "/"),
        dest: "_nuxt/grammars",
        // The grammars sit deep inside node_modules; strip that path so each
        // grammar lands at _nuxt/grammars/<language>.js.
        rename: { stripBase: true },
      },
    ],
  });
}

function viteStaticCopyPyodide() {
  const pyodideDir = dirname(fileURLToPath(import.meta.resolve("pyodide")));
  console.log("pyodideDir",pyodideDir)
  return viteStaticCopy({
    targets: [
      {
        src: [join(pyodideDir, "*").replace(/\\/g, "/")].concat(PYODIDE_EXCLUDE),
        dest: "assets",
      },
    ],
  });
}

export default defineNuxtConfig({
	modules: ["@nuxt/content", "shadcn-nuxt", "@nuxtjs/color-mode"],
	devtools: { enabled: true },
	compatibilityDate: "2026-06-01",
	css: ["~/assets/css/main.css"],
	vite: {
		// MicroLighter loads its grammars with a relative dynamic import. Vite's
		// dep pre-bundler rewrites it into the .vite/deps folder, where the grammar
		// files are not copied, so it has to be served as-is.
		optimizeDeps: { exclude: ["pyodide", "microlighter"] },
		plugins: [tailwindcss(), viteStaticCopyPyodide(), viteStaticCopyGrammars()],
  },
	devServer: { host: '0.0.0.0' },
	nitro: {
		externals: {
			traceOptions: { base: process.cwd() },
		},
	},
	app: {
		head: {
			title: 'BlueVoid.pl',
			titleTemplate: '%s - BlueVoid',
			htmlAttrs: {
				// Activates the token rules of the bundled MicroLighter theme.
				"data-syntax-theme": "github",
			},
			script: [
				{
					key: "theme-init",
					innerHTML: THEME_INIT_SCRIPT,
					tagPriority: "critical",

				}
			],
		},
		layoutTransition: { name: "page", mode: "out-in" },
	},
	debug: process.env.NODE_ENV === "development",
	content: {
		build: {
			markdown: {
				toc: {
					depth: 5,
					searchDepth: 5,
				},
				highlight: false,
			},
		},
	},
});
