import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

// Flat-Config (ESLint 9/10). Prettier übernimmt die Formatierung; ESLint nur
// Code-Qualität. Reihenfolge: erst die Regelwerke, danach `prettier` /
// `flat/prettier`, um formatierungsnahe Regeln wieder abzuschalten.
export default ts.config(
	{
		// Build-Artefakte und Scaffolding nicht linten.
		ignores: ['build/', '.svelte-kit/', 'package/']
	},
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				// Vite-`define`-Konstanten (siehe vite.config.js / app.d.ts).
				__APP_VERSION__: 'readonly',
				__BUILD_TIME__: 'readonly'
			}
		}
	},
	{
		// Svelte-Dateien mit dem TS-Parser für <script lang="ts"> ausstatten.
		files: ['**/*.svelte', '**/*.svelte.js', '**/*.svelte.ts'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			// Backend-Daten sind vorerst untypisiert (`any`) — bei der
			// TS-Reifung schrittweise Typen einführen und wieder anschalten.
			'@typescript-eslint/no-explicit-any': 'off',
			// Interne Links brauchten sonst `resolve()` aus `$app/paths`. Ohne
			// base-path ist das hier unnötig; Kandidat zum späteren Aktivieren.
			'svelte/no-navigation-without-resolve': 'off',
			// {@html} rendert ausschließlich ansi-to-html-Ausgabe mit escapeXML:true
			// (HTML in Config-Werten wird escaped) — kein ungeprüfter User-Input.
			'svelte/no-at-html-tags': 'off',
			// Ungenutzte Bindings als Warnung sichtbar halten; `_`-Präfix erlaubt.
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	}
);
