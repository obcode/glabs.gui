<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { formatDateTime } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let jobs = $derived(data.jobs ?? []);

	let cancelling = $state<Record<string, boolean>>({});
	let actionError = $state('');

	const statusBadge: Record<string, string> = {
		PENDING: 'badge-info',
		RUNNING: 'badge-warning',
		DONE: 'badge-success',
		FAILED: 'badge-error',
		EXPIRED: 'badge-error',
		CANCELLED: 'badge-ghost'
	};

	async function cancel(id: string) {
		cancelling = { ...cancelling, [id]: true };
		actionError = '';
		try {
			const res = await fetch('/api/jobs/cancel', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				actionError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			await invalidateAll();
		} catch (e) {
			actionError = e instanceof Error ? e.message : String(e);
		} finally {
			cancelling = { ...cancelling, [id]: false };
		}
	}

	function paramsText(params: { key: string; value: string }[]): string {
		return params.map((p) => `${p.key}=${p.value}`).join(', ');
	}
</script>

<svelte:head><title>Geplante Jobs · glabs</title></svelte:head>

<main class="mx-auto max-w-4xl py-8">
	<h1 class="text-2xl font-bold">Geplante Jobs</h1>
	<p class="mt-1 text-xs text-base-content/50">
		Terminierte GitLab-Operationen. Du bekommst bei jedem Endzustand eine E-Mail. Ausstehende Jobs
		kannst du abbrechen.
	</p>

	{#if actionError}
		<div class="mt-4 alert alert-error">
			<span class="font-mono text-sm break-words whitespace-pre-wrap">{actionError}</span>
		</div>
	{/if}

	{#if jobs.length === 0}
		<p class="mt-6 text-sm text-base-content/50">
			Noch keine geplanten Jobs. Plane eine Operation auf der Ops-Seite eines Assignments.
		</p>
	{:else}
		<div class="mt-6 flex flex-col gap-2">
			{#each jobs as job (job.id)}
				<div class="rounded-2xl border border-base-200 p-4">
					<div class="flex flex-wrap items-center gap-2">
						<span class="badge {statusBadge[job.status] ?? 'badge-ghost'} badge-sm"
							>{job.status}</span
						>
						<span class="font-mono font-medium">{job.op}</span>
						<a
							class="link link-hover font-mono text-sm text-base-content/70"
							href="/courses/{encodeURIComponent(job.course)}/{encodeURIComponent(job.assignment)}"
						>
							{job.course}/{job.assignment}
						</a>
						<div class="flex-1"></div>
						{#if job.status === 'PENDING'}
							<button
								class="btn btn-error btn-outline btn-xs"
								disabled={cancelling[job.id]}
								onclick={() => cancel(job.id)}
							>
								{cancelling[job.id] ? 'bricht ab …' : 'Abbrechen'}
							</button>
						{/if}
					</div>

					<dl class="mt-2 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
						<div class="flex gap-2">
							<dt class="w-24 shrink-0 text-base-content/50">Läuft am</dt>
							<dd>{formatDateTime(job.runAt)}</dd>
						</div>
						<div class="flex gap-2">
							<dt class="w-24 shrink-0 text-base-content/50">Kulanz</dt>
							<dd>{job.graceMinutes} min</dd>
						</div>
						{#if job.params.length > 0}
							<div class="flex gap-2">
								<dt class="w-24 shrink-0 text-base-content/50">Parameter</dt>
								<dd class="font-mono text-xs">{paramsText(job.params)}</dd>
							</div>
						{/if}
						{#if job.finishedAt}
							<div class="flex gap-2">
								<dt class="w-24 shrink-0 text-base-content/50">Beendet</dt>
								<dd>{formatDateTime(job.finishedAt)}</dd>
							</div>
						{/if}
					</dl>

					{#if job.err}
						<div class="mt-2 alert alert-error">
							<span class="font-mono text-xs break-words whitespace-pre-wrap">{job.err}</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</main>
