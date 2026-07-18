<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { displayName } from '$lib/auth';

	// Kuratierte Themes (müssen zu app.css `@plugin "daisyui"` passen).
	const themes = ['nord', 'light', 'dark', 'corporate', 'business'];

	// Angemeldete Identität (SSR aus dem Layout-Load; kein Flackern).
	// null = kein Auth-Backend / lokal-Dev → kein Nutzer-Chip.
	let me = $derived(page.data?.me ?? null);
	let meName = $derived(displayName(me));

	// aktuell aktives Theme (von theme-change als data-theme am <html> gesetzt),
	// damit der Umschalter es anzeigen und im Dropdown markieren kann.
	let currentTheme = $state('');

	onMount(() => {
		const readTheme = () => {
			currentTheme = document.documentElement.getAttribute('data-theme') ?? '';
		};
		readTheme();
		const themeObserver = new MutationObserver(readTheme);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});
		return () => themeObserver.disconnect();
	});
</script>

<header
	class="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/80 backdrop-blur-md supports-[backdrop-filter]:bg-base-100/70"
>
	<div class="mx-auto flex h-16 items-center gap-2 px-2 sm:px-3">
		<!-- Brand -->
		<a href="/" class="group flex items-center gap-2 rounded-xl px-1 py-1">
			<span
				class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-lg font-black text-primary-content shadow-sm transition-transform group-hover:scale-105"
			>
				g
			</span>
			<span
				class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-xl font-bold tracking-tight text-transparent"
			>
				glabs
			</span>
		</a>

		<!-- Hauptnavigation -->
		<nav class="ml-2 flex items-center gap-0.5">
			<a
				href="/courses"
				class="btn btn-ghost btn-sm rounded-full font-medium {page.url.pathname.startsWith(
					'/courses'
				)
					? 'bg-primary/10 text-primary'
					: 'text-base-content/70'}"
			>
				Kurse
			</a>
		</nav>

		<div class="flex-1"></div>

		<!-- Theme-Auswahl -->
		<div class="dropdown dropdown-end">
			<div
				tabindex="0"
				role="button"
				class="btn btn-ghost btn-sm gap-1"
				title="Theme wählen — aktuell: {currentTheme}"
				aria-label="Theme wählen, aktuell {currentTheme}"
			>
				<svg
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.53 16.12a3 3 0 0 0-5.78 1.13 2.25 2.25 0 0 1-2.4 2.24 4.5 4.5 0 0 0 8.4-2.24c0-.4-.08-.78-.22-1.13Zm0 0a16 16 0 0 0 3.39-1.62m-5.04-.03a16 16 0 0 1 1.62-3.39m3.42 3.42a16 16 0 0 0 4.76-4.65l3.88-5.81a1.15 1.15 0 0 0-1.6-1.6l-5.81 3.88a16 16 0 0 0-4.65 4.76m3.42 3.42a6.78 6.78 0 0 0-3.42-3.42"
					/>
				</svg>
				<span class="hidden capitalize sm:inline">{currentTheme}</span>
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<ul
				tabindex="0"
				class="menu dropdown-content z-50 mt-3 w-44 gap-0.5 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
			>
				{#each themes as theme (theme)}
					<li>
						<button
							class="flex items-center justify-between rounded-lg capitalize {theme === currentTheme
								? 'bg-primary font-semibold text-primary-content'
								: ''}"
							data-set-theme={theme}
							onclick={() => (currentTheme = theme)}
						>
							<span>{theme}</span>
							{#if theme === currentTheme}<span aria-hidden="true">✓</span>{/if}
						</button>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Angemeldete Identität (nur wenn ein Auth-Backend eine Kennung liefert) -->
		{#if me}
			<div
				class="inline-flex items-center gap-1.5 rounded-full border border-base-300 px-2 py-1 text-sm font-medium text-base-content/80"
				title="Angemeldet als {meName}"
				aria-label="Angemeldet als {meName}"
			>
				<span
					class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary uppercase"
				>
					{(meName || '?').charAt(0)}
				</span>
				<span class="hidden max-w-40 truncate sm:inline">{meName}</span>
			</div>
		{/if}
	</div>
</header>
