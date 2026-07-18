<script>
	import { invalidateAll } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { formatDateTime } from '$lib/format';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	// GitLab-Host für die Anleitung/Links. Über PUBLIC_GITLAB_HOST konfigurierbar,
	// Default ist die vom LRZ gehostete Instanz.
	const gitlabHost = (env.PUBLIC_GITLAB_HOST || 'https://gitlab.lrz.de').replace(/\/+$/, '');
	const tokensUrl = `${gitlabHost}/-/user_settings/personal_access_tokens`;

	let status = $derived(data.status ?? { set: false, updatedAt: null });

	let token = $state('');
	let saving = $state(false);
	let removing = $state(false);
	let actionError = $state('');
	let confirmRemove = $state(false);

	async function save() {
		if (!token.trim()) return;
		saving = true;
		actionError = '';
		try {
			const res = await fetch('/api/token/set', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ token: token.trim() })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				actionError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			token = '';
			await invalidateAll();
		} catch (err) {
			actionError = err instanceof Error ? err.message : String(err);
		} finally {
			saving = false;
		}
	}

	async function remove() {
		removing = true;
		actionError = '';
		try {
			const res = await fetch('/api/token/remove', { method: 'POST' });
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				actionError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			await invalidateAll();
		} catch (err) {
			actionError = err instanceof Error ? err.message : String(err);
		} finally {
			removing = false;
			confirmRemove = false;
		}
	}
</script>

<svelte:head><title>GitLab-Token · glabs</title></svelte:head>

<main class="mx-auto max-w-2xl py-8">
	<h1 class="text-2xl font-bold">GitLab-Token</h1>
	<p class="mt-1 text-sm text-base-content/60">
		Dein persönlicher Access Token wird verschlüsselt (AES-256-GCM) gespeichert und nie wieder
		angezeigt. Ohne Token bleibt glabs ein reiner Config-Editor; GitLab-Operationen brauchen ihn.
	</p>

	{#if data.error}
		<div class="mt-4 alert alert-warning">
			<span class="text-sm">Status nicht abrufbar: {data.error}</span>
		</div>
	{/if}

	<div class="mt-6 flex items-center gap-3 rounded-2xl border border-base-200 p-4">
		{#if status.set}
			<span class="badge badge-success gap-1">✓ hinterlegt</span>
			<span class="text-sm text-base-content/70">
				zuletzt gesetzt am {formatDateTime(status.updatedAt)}
			</span>
		{:else}
			<span class="badge badge-ghost">kein Token</span>
			<span class="text-sm text-base-content/60">Es ist kein Token hinterlegt.</span>
		{/if}
	</div>

	{#if actionError}
		<div class="mt-4 alert alert-error">
			<span class="font-mono text-sm break-words whitespace-pre-wrap">{actionError}</span>
			<button class="btn btn-ghost btn-xs" onclick={() => (actionError = '')}>schließen</button>
		</div>
	{/if}

	<section class="mt-6">
		<h2 class="text-sm font-semibold text-base-content/70">So erstellst du einen Access Token</h2>
		<ol class="mt-2 list-decimal space-y-2 pl-5 text-sm text-base-content/80">
			<li>
				Öffne in GitLab die
				<a class="link link-primary" href={tokensUrl} target="_blank" rel="noopener">
					Access-Token-Einstellungen
				</a>
				(oben rechts aufs Profilbild → <span class="font-medium">Edit profile / Preferences</span> →
				linke Leiste <span class="font-medium">Access tokens</span>).
			</li>
			<li>
				<span class="font-medium">Add new token</span>: Name z. B. <code>glabs</code>.
			</li>
			<li>
				<span class="font-medium">Expiration</span>: ein Ablaufdatum ist Pflicht. Wähle es großzügig
				(z. B. bis zum Semesterende oder länger).
			</li>
			<li>
				<span class="font-medium">Scopes</span>: <code>api</code> und
				<code>write_repository</code> ankreuzen.
			</li>
			<li>
				<span class="font-medium">Create personal access token</span> → der Token (<code
					>glpat-…</code
				>) wird <span class="font-medium">nur einmal</span> angezeigt. Kopiere ihn und füge ihn unten
				ein.
			</li>
		</ol>
	</section>

	<section class="mt-6">
		<h2 class="text-sm font-semibold text-base-content/70">
			{status.set ? 'Token ersetzen' : 'Token hinterlegen'}
		</h2>
		<form
			class="mt-2 flex flex-col gap-2 sm:flex-row"
			onsubmit={(e) => {
				e.preventDefault();
				save();
			}}
		>
			<input
				type="password"
				class="input input-bordered flex-1 font-mono"
				placeholder="glpat-…"
				autocomplete="off"
				bind:value={token}
			/>
			<button type="submit" class="btn btn-primary" disabled={saving || !token.trim()}>
				{saving ? 'speichert …' : 'Speichern'}
			</button>
		</form>
		<p class="mt-2 text-xs text-base-content/50">
			Der Token wird verschlüsselt gespeichert und nie wieder angezeigt. Benötigte Scopes:
			<code>api</code> und <code>write_repository</code>.
		</p>
	</section>

	{#if status.set}
		<section class="mt-6">
			<h2 class="text-sm font-semibold text-base-content/70">Token entfernen</h2>
			<button class="btn btn-error btn-outline btn-sm mt-2" onclick={() => (confirmRemove = true)}>
				🗑️ Token entfernen
			</button>
		</section>
	{/if}
</main>

{#if confirmRemove}
	<div class="modal modal-open">
		<div class="modal-box">
			<h2 class="text-lg font-semibold">Token entfernen?</h2>
			<p class="mt-2 text-sm">
				Der gespeicherte GitLab-Token wird gelöscht. GitLab-Operationen sind danach erst nach
				erneutem Hinterlegen wieder möglich.
			</p>
			<div class="modal-action">
				<button class="btn btn-ghost btn-sm" onclick={() => (confirmRemove = false)}
					>Abbrechen</button
				>
				<button class="btn btn-error btn-sm" disabled={removing} onclick={remove}>
					{removing ? 'entfernt …' : 'Entfernen'}
				</button>
			</div>
		</div>
		<button class="modal-backdrop" aria-label="schließen" onclick={() => (confirmRemove = false)}
		></button>
	</div>
{/if}
