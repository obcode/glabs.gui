<script lang="ts">
	import { onMount } from 'svelte';
	import { subscribeCourseCheck, type CheckProgress } from '$lib/checkSubscription';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Result = NonNullable<CheckProgress['result']>;
	type StudentCheck = Result['students'][number];

	let messages = $state<string[]>([]);
	let result = $state<Result | null>(null);
	let errorMsg = $state('');
	let done = $state(false);

	let tokenMissing = $derived(!!errorMsg && /token/i.test(errorMsg));
	let courseHref = $derived(`/courses/${encodeURIComponent(data.course)}`);

	// Keep the live log scrolled to the newest line (the box only fits ~10 lines).
	let logEl: HTMLUListElement | undefined = $state();
	$effect(() => {
		void messages.length;
		if (logEl) logEl.scrollTop = logEl.scrollHeight;
	});

	onMount(() => {
		return subscribeCourseCheck(data.course, {
			next: (p) => {
				if (p.message) messages = [...messages, p.message];
				if (p.done) {
					if (p.error) errorMsg = p.error;
					else result = p.result ?? null;
					done = true;
				}
			},
			error: (msg) => {
				errorMsg = msg;
				done = true;
			}
		});
	});

	function badgeClass(status: StudentCheck['status']): string {
		switch (status) {
			case 'OK':
				return 'badge-success';
			case 'INVITE':
				return 'badge-info';
			case 'DEPRECATED':
				return 'badge-warning';
			default:
				return 'badge-error';
		}
	}
	function statusLabel(status: StudentCheck['status']): string {
		switch (status) {
			case 'OK':
				return 'ok';
			case 'INVITE':
				return 'Einladung';
			case 'DEPRECATED':
				return 'Username';
			default:
				return 'Fehler';
		}
	}
</script>

<svelte:head><title>Check · {data.course} · glabs</title></svelte:head>

<main class="mx-auto max-w-4xl py-8">
	<a href={courseHref} class="text-sm text-base-content/60 hover:underline">← {data.course}</a>

	<div class="mt-2 flex flex-wrap items-center gap-2">
		<h1 class="text-2xl font-bold">Check: {data.course}</h1>
		{#if result}
			{#if result.ok}
				<span class="badge badge-success">✓ alles ok</span>
			{:else}
				<span class="badge badge-error"
					>{result.errors} Problem{result.errors === 1 ? '' : 'e'}</span
				>
			{/if}
		{/if}
	</div>
	<p class="mt-1 text-xs text-base-content/50">
		Prüft jede Roster-Kennung gegen GitLab (per ID/Username/E-Mail) und meldet Duplikate über
		Gruppen.
	</p>

	{#if !done}
		<div class="mt-6 rounded-2xl border border-base-200 p-4">
			<div class="flex items-center gap-2 text-sm font-medium">
				<span class="loading loading-spinner loading-sm"></span>
				Prüfung läuft … bei vielen Kennungen dauert das einen Moment.
			</div>
			{#if messages.length > 0}
				<ul
					bind:this={logEl}
					class="mt-3 max-h-56 overflow-auto font-mono text-xs leading-relaxed text-base-content/60"
				>
					{#each messages as m, i (i)}
						<li>{m}</li>
					{/each}
				</ul>
			{/if}
		</div>
	{:else if errorMsg}
		<div class="mt-6 alert alert-error">
			<div class="text-sm">
				<div class="font-mono break-words whitespace-pre-wrap">{errorMsg}</div>
				{#if tokenMissing}
					<div class="mt-2">
						Hinterlege einen GitLab-Token unter
						<a class="link link-primary" href="/token">GitLab-Token</a>, dann lade neu.
					</div>
				{/if}
			</div>
		</div>
	{:else if !result}
		<div class="mt-10 rounded-2xl border border-dashed border-base-300 p-10 text-center">
			<div class="text-4xl">🔍</div>
			<p class="mt-3 font-medium">Kein Ergebnis</p>
		</div>
	{:else}
		{#if result.duplicates.length > 0}
			<div class="mt-6 alert alert-warning">
				<div class="text-sm">
					<div class="font-medium">In mehr als einer Gruppe:</div>
					<ul class="mt-1 list-disc pl-5">
						{#each result.duplicates as d (d.student)}
							<li><span class="font-mono">{d.student}</span> — {d.groups.join(', ')}</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}

		{#snippet studentRow(s: StudentCheck)}
			<li class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 py-1">
				<span class="badge {badgeClass(s.status)} badge-sm">{statusLabel(s.status)}</span>
				<span class="font-mono text-sm break-all">{s.input}</span>
				<span class="text-xs text-base-content/60">{s.message}</span>
			</li>
		{/snippet}

		{#if result.students.length > 0}
			<section class="mt-6">
				<h2 class="text-sm font-semibold text-base-content/70">
					Studierende ({result.students.length})
				</h2>
				<ul class="mt-2 flex flex-col divide-y divide-base-200">
					{#each result.students as s (s.input)}
						{@render studentRow(s)}
					{/each}
				</ul>
			</section>
		{/if}

		{#if result.groups.length > 0}
			<section class="mt-6">
				<h2 class="text-sm font-semibold text-base-content/70">Gruppen ({result.groups.length})</h2>
				<div class="mt-2 flex flex-col gap-3">
					{#each result.groups as g (g.name)}
						<div class="rounded-lg border border-base-200 p-2">
							<div class="text-sm font-medium">
								{g.name} <span class="text-base-content/50">({g.members.length})</span>
							</div>
							<ul class="mt-1 flex flex-col divide-y divide-base-200">
								{#each g.members as m (m.input)}
									{@render studentRow(m)}
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if result.students.length === 0 && result.groups.length === 0}
			<div class="mt-10 rounded-2xl border border-dashed border-base-300 p-10 text-center">
				<div class="text-4xl">📭</div>
				<p class="mt-3 font-medium">Kein Roster</p>
				<p class="mt-1 text-sm text-base-content/60">
					Dieser Kurs hat keine kurs-weiten Studierenden oder Gruppen.
				</p>
			</div>
		{/if}
	{/if}
</main>
