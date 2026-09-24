<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { formatDateTime } from '$lib/format';
	import type { AccessStatus } from '$lib/gql/graphql';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let entries = $derived(data.entries);
	let pending = $derived(entries.filter((e) => e.status === 'PENDING'));
	let decided = $derived(entries.filter((e) => e.status !== 'PENDING'));

	type Action = 'approve' | 'reject' | 'revoke' | 'reset';

	// Welche Zeile gerade eine Aktion ausführt, und das letzte Ergebnis.
	let busy = $state<string | null>(null);
	let result = $state<{ ok: boolean; msg: string } | null>(null);

	const done: Record<Action, string> = {
		approve: 'freigeschaltet (E-Mail verschickt)',
		reject: 'abgelehnt (E-Mail verschickt)',
		revoke: 'Zugang entzogen',
		reset: 'zurückgesetzt — kann neu anfragen'
	};

	async function act(action: Action, email: string) {
		if (action === 'revoke' && !confirm(`Zugang von ${email} wirklich entziehen?`)) return;
		busy = email;
		result = null;
		try {
			const res = await fetch(`/api/admin/access/${action}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const body = await res.json();
			if (!res.ok || body?.error) {
				result = { ok: false, msg: body?.error ?? 'Aktion fehlgeschlagen.' };
			} else {
				result = { ok: true, msg: `${email}: ${done[action]}` };
				await invalidateAll();
			}
		} catch (e) {
			result = { ok: false, msg: e instanceof Error ? e.message : 'Netzwerkfehler.' };
		} finally {
			busy = null;
		}
	}

	// Vorschau-Modus: den eigenen Anfrage-Ablauf mit der eigenen Kennung durchspielen.
	let startingPreview = $state(false);
	async function startPreview() {
		startingPreview = true;
		try {
			await fetch('/api/access/preview', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ on: true })
			});
			await goto('/zugang', { invalidateAll: true });
		} finally {
			startingPreview = false;
		}
	}

	const statusBadge: Record<AccessStatus, string> = {
		NONE: 'badge-ghost',
		PENDING: 'badge-warning',
		APPROVED: 'badge-success',
		REJECTED: 'badge-error',
		REVOKED: 'badge-neutral'
	};
	const statusLabel: Record<AccessStatus, string> = {
		NONE: '—',
		PENDING: 'offen',
		APPROVED: 'freigeschaltet',
		REJECTED: 'abgelehnt',
		REVOKED: 'entzogen'
	};

	// Aus der Admin-Mail kommend: die angefragte Zeile ins Bild holen.
	onMount(() => {
		if (data.highlight) {
			document.getElementById(`user-${data.highlight}`)?.scrollIntoView({ block: 'center' });
		}
	});
</script>

<svelte:head><title>Freischaltungen · glabs</title></svelte:head>

<main class="mx-auto max-w-6xl py-8">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">Admin · Freischaltungen</h1>
			<p class="mt-1 text-xs text-base-content/50">
				Nur die Administratoren und freigeschaltete Personen können glabs nutzen. Alle anderen sehen
				eine Seite, auf der sie die Freischaltung anfragen können.
			</p>
		</div>
		<button
			class="btn btn-outline btn-sm"
			title="glabs mit deiner Kennung so ansehen, als wärst du nicht freigeschaltet — zum Ausprobieren des Anfrage-Ablaufs"
			onclick={startPreview}
			disabled={startingPreview}>Als nicht freigeschaltet ansehen</button
		>
	</div>

	{#if result}
		<div class="mt-4 alert {result.ok ? 'alert-success' : 'alert-error'} py-2 text-sm">
			<span>{result.msg}</span>
		</div>
	{/if}

	<section class="mt-6">
		<h2 class="text-sm font-semibold text-base-content/70">Offene Anfragen ({pending.length})</h2>
		{#if pending.length === 0}
			<p class="mt-2 text-xs text-base-content/50">Keine offenen Anfragen.</p>
		{:else}
			<div class="mt-2 grid gap-3">
				{#each pending as e (e.email)}
					<div
						id="user-{e.email}"
						class="card border bg-base-100 shadow-sm {data.highlight === e.email
							? 'border-primary ring-2 ring-primary/40'
							: 'border-base-200'}"
					>
						<div class="card-body gap-2 p-4">
							<div class="flex flex-wrap items-baseline justify-between gap-2">
								<div>
									<span class="font-semibold">{e.name || e.email}</span>
									{#if e.name}<span class="ml-1 font-mono text-xs">{e.email}</span>{/if}
									{#if e.department}<span class="ml-2 text-xs text-base-content/60"
											>FK {e.department}</span
										>{/if}
								</div>
								<span class="text-xs text-base-content/60"
									>angefragt {formatDateTime(e.requestedAt)}</span
								>
							</div>
							{#if e.reason}
								<p class="rounded-box bg-base-200 px-3 py-2 text-sm whitespace-pre-line">
									{e.reason}
								</p>
							{/if}
							<div class="card-actions justify-end">
								<button
									class="btn btn-ghost btn-sm"
									onclick={() => act('reject', e.email)}
									disabled={busy === e.email}>Ablehnen</button
								>
								<button
									class="btn btn-primary btn-sm"
									onclick={() => act('approve', e.email)}
									disabled={busy === e.email}
								>
									{#if busy === e.email}<span class="loading loading-spinner loading-xs"
										></span>{/if}
									Freischalten
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<section class="mt-8">
		<h2 class="text-sm font-semibold text-base-content/70">Entschieden ({decided.length})</h2>
		{#if decided.length === 0}
			<p class="mt-2 text-xs text-base-content/50">Noch keine Entscheidungen.</p>
		{:else}
			<div class="mt-2 overflow-x-auto">
				<table class="table-sm table">
					<thead>
						<tr>
							<th>Person</th>
							<th>FK</th>
							<th>Status</th>
							<th>Entschieden</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each decided as e (e.email)}
							<tr id="user-{e.email}" class={data.highlight === e.email ? 'bg-primary/10' : ''}>
								<td>
									<div>{e.name || e.email}</div>
									{#if e.name}<div class="font-mono text-xs text-base-content/60">
											{e.email}
										</div>{/if}
								</td>
								<td class="text-xs">{e.department || '—'}</td>
								<td
									><span class="badge badge-sm {statusBadge[e.status]}"
										>{statusLabel[e.status]}</span
									></td
								>
								<td class="text-xs">
									{formatDateTime(e.decidedAt)}
									{#if e.decidedBy}<div class="text-base-content/60">{e.decidedBy}</div>{/if}
								</td>
								<td class="text-right whitespace-nowrap">
									{#if e.status === 'APPROVED'}
										<button
											class="btn btn-ghost btn-xs text-error"
											onclick={() => act('revoke', e.email)}
											disabled={busy === e.email}>Entziehen</button
										>
									{:else}
										<button
											class="btn btn-ghost btn-xs"
											onclick={() => act('approve', e.email)}
											disabled={busy === e.email}>Freischalten</button
										>
									{/if}
									<button
										class="btn btn-ghost btn-xs"
										title="Anfrage vergessen; die Person kann neu anfragen"
										onclick={() => act('reset', e.email)}
										disabled={busy === e.email}>Zurücksetzen</button
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</main>
