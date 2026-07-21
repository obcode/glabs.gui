<script lang="ts">
	import { displayVersion as display, baseReleaseTag, isExactTag } from '$lib/version';

	// glabs-web-Version-Infos: version = „vX.Y.Z" (Release) oder „dev-<rev>…"
	// (dev-Build); commit = Git-Commit; date = Release-/Build-Zeitpunkt (RFC3339
	// UTC), „unknown" bei dev-Build.
	type ServerInfo = { version?: string; commit?: string; date?: string };

	interface Props {
		/** eigene GUI-Version (Buildzeit, aus semantic-release-Tag) */
		guiVersion?: string;
		/** Build-Zeitpunkt (ISO-8601), aus Vite-`define` */
		buildTime?: string;
		/** Server-Infos von glabs-web */
		serverInfo?: ServerInfo | null;
	}

	let { guiVersion, buildTime, serverInfo = null }: Props = $props();

	/**
	 * Build-/Release-Zeitpunkt fürs Footer formatieren — immer Datum + Uhrzeit.
	 * Feste Zeitzone/Locale, damit SSR und Client identisch rendern.
	 */
	function formatBuildTime(iso: string | null | undefined) {
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

	// Copyright-Jahr aus der Build-Zeit ableiten (SSR- und Client-deterministisch),
	// Fallback auf ein festes Jahr, falls keine gültige Build-Zeit vorliegt.
	function yearOf(iso: string | null | undefined) {
		if (!iso) return null;
		const d = new Date(iso);
		return isNaN(d.getTime()) ? null : d.getUTCFullYear();
	}
	const copyrightYear = $derived(yearOf(buildTime) ?? 2026);
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

	<!-- Copyright ans Ende, per ml-auto rechts abgesetzt -->
	<span class="ml-auto">
		© {copyrightYear}
		<a class="link link-hover" href="https://github.com/obcode" target="_blank" rel="noopener">
			Oliver Braun
		</a>
	</span>
</footer>
