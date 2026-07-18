import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Endschalter: das gesamte eigene Projekt läuft im Runes-Modus (Legacy-Syntax
	// wie `export let` / `$:` / `on:` wäre ab hier ein Compile-Fehler).
	compilerOptions: {
		runes: true
	},
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter()
	},
	vitePlugin: {
		// Fremd-Bibliotheken, die ihre .svelte-Quellen ausliefern, nutzen teils
		// noch Legacy-Syntax. Der globale runes:true-Zwang würde sie brechen —
		// daher node_modules explizit im (auto-erkannten) Legacy-Modus kompilieren.
		dynamicCompileOptions({ filename }) {
			if (filename.includes('node_modules')) return { runes: false };
		}
	}
};

export default config;
