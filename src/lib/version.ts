// Kleine Helfer rund um die im Footer angezeigte Version. Ausgelagert aus
// Footer.svelte, damit die Logik ohne Komponenten-Rendering testbar ist.

/**
 * Eine Version einheitlich als „v1.2.3" darstellen — egal ob die Quelle das
 * „v" schon mitbringt (Server, Git-Tag) oder nicht (package.json-Platzhalter).
 */
export function displayVersion(raw: string | null | undefined): string | null {
	if (!raw) return null;
	return raw.startsWith('v') ? raw : `v${raw}`;
}

/**
 * Den zugrunde liegenden semantic-release-Tag extrahieren. `git describe` hängt
 * bei dev-Builds `-<n>-g<sha>` bzw. `-dirty` an (v1.2.3-4-gabc123) — das
 * führende v1.2.3 ist trotzdem ein real existierendes Release.
 * Liefert z. B. „v1.2.3" oder null, wenn kein Tag erkennbar.
 */
export function baseReleaseTag(raw: string | null | undefined): string | null {
	const m = raw?.match(/^v?(\d+\.\d+\.\d+)/);
	return m ? `v${m[1]}` : null;
}

/**
 * Ist die Version ein exakter Tag (kein `git describe`-Suffix)? Dann verweist
 * der Link auf genau dieses Release, sonst „basiert auf" (dev-Build).
 */
export function isExactTag(raw: string | null | undefined): boolean {
	return !!raw && /^v?\d+\.\d+\.\d+$/.test(raw);
}
