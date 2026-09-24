<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let me = $derived(data.me);
	let access = $derived(me?.access ?? null);

	const MAX_REASON = 1000;
	let reason = $state('');
	let sending = $state(false);
	let errorMsg = $state<string | null>(null);

	async function requestAccess() {
		sending = true;
		errorMsg = null;
		try {
			const res = await fetch('/api/access/request', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ reason: reason.trim() })
			});
			const body = await res.json();
			if (!res.ok || body?.error) {
				errorMsg = body?.error ?? 'Anfrage fehlgeschlagen.';
				return;
			}
			await invalidateAll();
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Netzwerkfehler.';
		} finally {
			sending = false;
		}
	}
</script>

<svelte:head>
	<title>Freischaltung · glabs</title>
</svelte:head>

<main class="mx-auto max-w-xl py-12">
	<div class="card border border-base-200 bg-base-100 shadow-sm">
		<div class="card-body gap-4">
			{#if access === 'PENDING'}
				<div class="text-4xl">⏳</div>
				<h1 class="card-title text-2xl">Anfrage ist eingegangen</h1>
				<p>
					Ihre Anfrage auf Freischaltung für
					<span class="font-mono">{me?.email}</span> liegt den Administratoren vor. Sobald sie freigeschaltet
					ist, erhalten Sie eine E-Mail.
				</p>
			{:else if access === 'REJECTED' || access === 'REVOKED'}
				<div class="text-4xl">🚫</div>
				<h1 class="card-title text-2xl">Kein Zugang</h1>
				<p>
					{access === 'REJECTED'
						? 'Ihre Anfrage auf Freischaltung wurde nicht angenommen.'
						: 'Ihr Zugang zu glabs wurde entzogen.'}
					Sollte es sich um einen Irrtum handeln, wenden Sie sich bitte an die Administratoren von glabs.
				</p>
			{:else}
				<div class="text-4xl">🔐</div>
				<h1 class="card-title text-2xl">Freischaltung anfragen</h1>
				<p>
					Sie sind als <span class="font-mono">{me?.email ?? 'unbekannt'}</span> angemeldet, aber noch
					nicht für glabs freigeschaltet. Bitte fragen Sie die Freischaltung an — die Administratoren
					erhalten eine E-Mail, und Sie erhalten eine, sobald Sie freigeschaltet sind.
				</p>
				<label class="form-control w-full">
					<span class="label-text mb-1">
						Wofür möchten Sie glabs nutzen? <span class="text-base-content/60">(optional)</span>
					</span>
					<textarea
						class="textarea w-full"
						rows="3"
						maxlength={MAX_REASON}
						placeholder="z. B. Lehrveranstaltung, Semester"
						bind:value={reason}></textarea>
				</label>
				{#if errorMsg}
					<div role="alert" class="alert alert-error">{errorMsg}</div>
				{/if}
				<div class="card-actions justify-end">
					<button class="btn btn-primary" onclick={requestAccess} disabled={sending}>
						{#if sending}<span class="loading loading-spinner loading-sm"></span>{/if}
						Freischaltung anfragen
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>
