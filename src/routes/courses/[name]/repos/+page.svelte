<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let overview = $derived(data.overview ?? []);
	let error = $derived(data.error);
	let needsToken = $derived(!!error && /token/i.test(error));

	function missing(a: { repos: { for: string; url: string; exists: boolean }[] }) {
		return a.repos.filter((r) => !r.exists);
	}
</script>

<svelte:head><title>Repos · {data.course} · glabs</title></svelte:head>

<main class="mx-auto max-w-4xl py-8">
	<a
		href="/courses/{encodeURIComponent(data.course)}"
		class="text-sm text-base-content/60 hover:underline">← {data.course}</a
	>
	<h1 class="mt-2 text-2xl font-bold">Generierte Repos: {data.course}</h1>
	<p class="mt-1 text-xs text-base-content/50">
		Pro Assignment: wie viele der Ziel-Repos tatsächlich in GitLab existieren. Live aus GitLab
		(GitLab-Token nötig).
	</p>

	{#if error}
		<div class="mt-6 alert alert-error">
			<span class="font-mono text-sm break-words whitespace-pre-wrap">{error}</span>
		</div>
		{#if needsToken}
			<p class="mt-2 text-sm">
				<a class="link link-primary" href="/token">GitLab-Token hinterlegen →</a>
			</p>
		{/if}
	{:else if overview.length === 0}
		<p class="mt-6 text-sm text-base-content/50">Keine Assignments in diesem Kurs.</p>
	{:else}
		<div class="mt-6 flex flex-col gap-2">
			{#each overview as a (a.name)}
				{@const miss = missing(a)}
				<div class="rounded-2xl border border-base-200 p-4">
					<div class="flex flex-wrap items-center gap-2">
						<a
							class="link link-hover font-mono font-medium"
							href="/courses/{encodeURIComponent(data.course)}/{encodeURIComponent(a.name)}"
						>
							{a.name}
						</a>
						{#if a.note}
							<span class="badge badge-ghost badge-sm" title={a.note}>—</span>
							<span class="text-xs text-base-content/50">{a.note}</span>
						{:else}
							<span
								class="badge badge-sm {a.existing === a.targets
									? 'badge-success'
									: a.existing === 0
										? 'badge-error'
										: 'badge-warning'}"
							>
								{a.existing}/{a.targets} generiert
							</span>
							<span class="text-xs text-base-content/40">({a.per})</span>
						{/if}
					</div>

					{#if !a.note && miss.length > 0}
						<details class="mt-2">
							<summary class="cursor-pointer text-xs text-base-content/60">
								{miss.length} fehlend
							</summary>
							<ul class="mt-2 flex flex-col gap-0.5 text-sm">
								{#each miss as r (r.url)}
									<li class="font-mono text-xs break-all text-base-content/70">{r.for}</li>
								{/each}
							</ul>
						</details>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</main>
