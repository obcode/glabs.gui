<script lang="ts">
	import { formatDateTime } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let entries = $derived(data.entries ?? []);

	const statusBadge: Record<string, string> = {
		done: 'badge-success',
		failed: 'badge-error'
	};
</script>

<svelte:head><title>Aktivität · glabs</title></svelte:head>

<main class="mx-auto max-w-5xl py-8">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">Aktivität</h1>
			<p class="mt-1 text-xs text-base-content/50">
				Vollständiger Verlauf aller Web-Vorgänge über alle Kurse, neueste zuerst. Das CLI schreibt
				bewusst nicht hierher.
			</p>
		</div>
		{#if entries.length > 0}
			<a href="/download/activity" class="btn btn-outline btn-sm" download>⬇️ JSON-Download</a>
		{/if}
	</div>

	{#if entries.length === 0}
		<p class="mt-6 text-sm text-base-content/50">
			Noch keine Web-Vorgänge protokolliert. Sobald du über die Oberfläche eine Operation
			(setaccess, generate, …) ausführst, erscheint sie hier.
		</p>
	{:else}
		<div class="mt-6 overflow-x-auto">
			<table class="table-sm table">
				<thead>
					<tr>
						<th>Zeit</th>
						<th>Kurs</th>
						<th>Assignment</th>
						<th>Operation</th>
						<th>Status</th>
						<th>Detail</th>
					</tr>
				</thead>
				<tbody>
					{#each entries as e (e.at + e.course + e.assignment + e.op)}
						<tr>
							<td class="whitespace-nowrap text-xs">{formatDateTime(e.at)}</td>
							<td class="font-medium">{e.course}</td>
							<td>{e.assignment}</td>
							<td class="font-mono text-xs">{e.op}</td>
							<td>
								<span class="badge {statusBadge[e.status] ?? 'badge-ghost'} badge-sm"
									>{e.status}</span
								>
							</td>
							<td class="text-xs break-all text-base-content/70">{e.detail || '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</main>
