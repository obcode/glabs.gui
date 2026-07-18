import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

// Eigene GUI-Version für den Footer, zur Buildzeit eingebacken.
// Quelle in dieser Reihenfolge:
//   1. APP_VERSION (im Docker-Release via build-arg aus dem semantic-release-Tag)
//   2. `git describe` (lokale Builds; im Docker-Image nicht verfügbar, .git ist
//      per .dockerignore ausgeschlossen)
//   3. package.json (letzter Fallback; im Repo bewusst ein Platzhalter, da
//      semantic-release den Bump nicht zurückcommittet)
const pkg = JSON.parse(
	readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf-8')
);

function gitDescribe() {
	try {
		return execSync('git describe --tags --always --dirty', {
			stdio: ['ignore', 'pipe', 'ignore']
		})
			.toString()
			.trim();
	} catch {
		return null;
	}
}

const appVersion = process.env.APP_VERSION?.trim() || gitDescribe() || pkg.version;

// Zeitpunkt des Builds für den Footer, ISO-8601. Im Docker-Release ist der
// Build-Zeitpunkt praktisch der Release-Zeitpunkt (das Image wird direkt nach
// dem semantic-release-Tag gebaut). Über BUILD_TIME überschreibbar, falls ein
// reproduzierbarer/exakter Zeitstempel gewünscht ist.
const buildTime = process.env.BUILD_TIME?.trim() || new Date().toISOString();

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__APP_VERSION__: JSON.stringify(appVersion),
		__BUILD_TIME__: JSON.stringify(buildTime)
	},
	// Unit-Tests (vitest) leben in src/.
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
