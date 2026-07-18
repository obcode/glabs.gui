<script>
	import { displayVersion as display, baseReleaseTag, isExactTag } from '$lib/version.js';

	/**
	 * @typedef {Object} ServerInfo
	 * @property {string} [version]  glabs-web-Version: „vX.Y.Z" (Release) oder „dev-<rev>…" (dev-Build)
	 * @property {string} [commit]   Git-Commit des Backends
	 * @property {string} [date]     Release-/Build-Zeitpunkt (RFC3339 UTC); „unknown" bei dev-Build
	 *
	 * @typedef {Object} Props
	 * @property {string} [guiVersion]           eigene GUI-Version (Buildzeit, aus semantic-release-Tag)
	 * @property {string} [buildTime]            Build-Zeitpunkt (ISO-8601), aus Vite-`define`
	 * @property {ServerInfo|null} [serverInfo]  Server-Infos von glabs-web
	 */

	/** @type {Props} */
	let { guiVersion, buildTime, serverInfo = null } = $props();

	/**
	 * Build-/Release-Zeitpunkt fürs Footer formatieren — immer Datum + Uhrzeit.
	 * Feste Zeitzone/Locale, damit SSR und Client identisch rendern.
	 * @param {string|null|undefined} iso
	 */
	function formatBuildTime(iso) {
		if (!iso) return null;
		const d = new Date(iso);
		if (isNaN(d.getTime())) return null;
		return new Intl.DateTimeFormat('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Europe/Berlin'
		}).format(d);
	}

	const guiDisplay = $derived(display(guiVersion));
	const guiExact = $derived(isExactTag(guiVersion));
	const buildDisplay = $derived(formatBuildTime(buildTime));
	// Immer aufs zugehörige GitHub-Release verlinken: bei sauberem Tag auf genau
	// dieses, bei dev-Builds auf das zugrunde liegende Release; ist gar kein Tag
	// erkennbar, auf die Releases-Übersicht.
	const guiReleaseTag = $derived(baseReleaseTag(guiVersion));
	const guiReleaseURL = $derived(
		guiReleaseTag
			? `https://github.com/obcode/glabs.gui/releases/tag/${guiReleaseTag}`
			: 'https://github.com/obcode/glabs.gui/releases'
	);

	// glabs-web meldet entweder einen echten Release-Tag oder „dev-<rev>…".
	const serverIsDev = $derived(!!serverInfo?.version?.startsWith('dev'));
	// dev-Version roh anzeigen (kein erzwungenes „v"); echten Tag normalisieren.
	const serverDisplay = $derived(serverIsDev ? serverInfo?.version : display(serverInfo?.version));
	// Bei echtem Release aufs glabs-Release verlinken (serverInfo trägt keine URL).
	const serverReleaseTag = $derived(serverIsDev ? null : baseReleaseTag(serverInfo?.version));
	const serverReleaseURL = $derived(
		serverReleaseTag ? `https://github.com/obcode/glabs/releases/tag/${serverReleaseTag}` : null
	);
	// Release-/Build-Zeitpunkt des Backends; „unknown" = dev-Build → nichts anzeigen.
	const serverDateDisplay = $derived(
		serverInfo?.date && serverInfo.date !== 'unknown' ? formatBuildTime(serverInfo.date) : null
	);
</script>

<footer
	class="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-base-300 pt-3 text-xs text-base-content/60"
>
	<!-- Eigene GUI-Version: immer als Link aufs (zugehörige) GitHub-Release -->
	{#if guiDisplay}
		<span>
			glabs.gui
			<a class="link link-hover" href={guiReleaseURL} target="_blank" rel="noopener">
				{guiDisplay}
			</a>
			{#if !guiExact}
				<span class="opacity-70">(dev)</span>
			{/if}
			{#if buildDisplay}
				<span class="opacity-70">— {buildDisplay}</span>
			{/if}
		</span>
	{/if}

	{#if serverDisplay}
		<span aria-hidden="true">·</span>
		<!-- glabs-web-Version: als Link, wenn ein Release existiert, sonst dev-Build -->
		<span>
			glabs-web
			{#if serverReleaseURL}
				<a class="link link-hover" href={serverReleaseURL} target="_blank" rel="noopener">
					{serverDisplay}
				</a>
			{:else}
				<span title={serverInfo?.commit ?? undefined}>{serverDisplay}</span>
			{/if}
			{#if serverDateDisplay}
				<span class="opacity-70">— {serverDateDisplay}</span>
			{/if}
		</span>
	{/if}
</footer>
