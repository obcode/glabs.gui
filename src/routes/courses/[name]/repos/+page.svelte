<script lang="ts">
	import { subscribeRepoOverview, type RepoOverviewEvent } from '$lib/reposSubscription';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Assignment = NonNullable<RepoOverviewEvent['assignment']>;

	let assignments = $state<Assignment[]>([]);
	let total = $state(0);
	let checked = $state(0);
	let done = $state(false);
	let error = $state<string | null>(null);

	let needsToken = $derived(!!error && /token/i.test(error));
	let sorted = $derived([...assignments].sort((a, b) => a.name.localeCompare(b.name)));

	$effect(() => {
		const course = data.course;
		// Reset for this course, then stream assignment by assignment.
		assignments = [];
		total = 0;
		checked = 0;
		done = false;
		error = null;
		return subscribeRepoOverview(course, {
			next: (e) => {
				if (e.total) total = e.total;
				if (e.error) {
					error = e.error;
					done = true;
					return;
				}
				if (e.assignment) {
					assignments = [...assignments, e.assignment];
					checked += 1;
				}
				if (e.done) done = true;
			},
			error: (msg) => {
				error = msg;
				done = true;
			}
		});
	});

	function missing(a: Assignment) {
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

	<div class="mt-4 flex items-center gap-3 text-sm">
		{#if !done}
			<span class="loading loading-spinner loading-sm"></span>
			<span>prüfe GitLab … {checked}{total ? `/${total}` : ''} Assignments</span>
		{:else if !error}
			<span class="text-success">✓ fertig ({checked} Assignments)</span>
		{/if}
	</div>

	{#if total > 0 && !done}
		<progress class="progress progress-primary mt-2 w-full" value={checked} max={total}></progress>
	{/if}

	{#if error}
		<div class="mt-4 alert alert-error">
			<span class="font-mono text-sm break-words whitespace-pre-wrap">{error}</span>
		</div>
		{#if needsToken}
			<p class="mt-2 text-sm">
				<a class="link link-primary" href="/token">GitLab-Token hinterlegen →</a>
			</p>
		{/if}
	{/if}

	{#if sorted.length > 0}
		<div class="mt-6 flex flex-col gap-2">
			{#each sorted as a (a.name)}
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
							<span class="badge badge-ghost badge-sm">—</span>
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
