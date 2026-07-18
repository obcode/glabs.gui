<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { formatDateTime } from '$lib/format';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let course = $derived(data.course);
	let lint = $derived(data.lint ?? []);

	let deleting = $state(false);
	let confirmOpen = $state(false);
	let actionError = $state('');

	async function doDelete() {
		deleting = true;
		actionError = '';
		try {
			const res = await fetch('/api/courses/delete', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name: course.name })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				actionError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			await invalidateAll();
			await goto('/courses');
		} catch (err) {
			actionError = err instanceof Error ? err.message : String(err);
		} finally {
			deleting = false;
			confirmOpen = false;
		}
	}

	/** @param {string} sev */
	function sevBadge(sev) {
		return sev === 'PROBLEM' ? 'badge-error' : 'badge-warning';
	}
</script>

<svelte:head><title>{course.name} · Kurse · glabs</title></svelte:head>

<main class="mx-auto max-w-4xl py-8">
	<a href="/courses" class="text-sm text-base-content/60 hover:underline">← Alle Kurse</a>

	<div class="mt-2 flex flex-wrap items-start justify-between gap-3">
		<div>
			<h1 class="text-2xl font-bold">{course.name}</h1>
			<p class="mt-1 text-xs text-base-content/50">
				Importiert {formatDateTime(course.importedAt)} · zuletzt geändert {formatDateTime(
					course.updatedAt
				)}
			</p>
		</div>
		<div class="flex gap-2">
			<a class="btn btn-primary btn-sm" href="/download/course/{encodeURIComponent(course.name)}">
				⬇️ YAML herunterladen
			</a>
			<button class="btn btn-error btn-outline btn-sm" onclick={() => (confirmOpen = true)}>
				🗑️ Löschen
			</button>
		</div>
	</div>

	{#if actionError}
		<div class="mt-4 alert alert-error">
			<span class="font-mono text-sm break-words whitespace-pre-wrap">{actionError}</span>
		</div>
	{/if}

	<div class="mt-6 grid gap-4 sm:grid-cols-3">
		<div class="stat rounded-2xl border border-base-200">
			<div class="stat-title">Assignments</div>
			<div class="stat-value text-2xl">{course.assignmentNames.length}</div>
		</div>
		<div class="stat rounded-2xl border border-base-200">
			<div class="stat-title">Studierende</div>
			<div class="stat-value text-2xl">{course.studentCount}</div>
		</div>
		<div class="stat rounded-2xl border border-base-200">
			<div class="stat-title">Gruppen</div>
			<div class="stat-value text-2xl">{course.groupCount}</div>
		</div>
	</div>

	<section class="mt-6">
		<h2 class="text-sm font-semibold text-base-content/70">Pfade</h2>
		<dl class="mt-2 grid gap-1 text-sm">
			<div class="flex gap-2">
				<dt class="w-28 shrink-0 text-base-content/50">coursePath</dt>
				<dd class="font-mono break-all">{course.coursePath || '—'}</dd>
			</div>
			<div class="flex gap-2">
				<dt class="w-28 shrink-0 text-base-content/50">semesterPath</dt>
				<dd class="font-mono break-all">{course.semesterPath || '—'}</dd>
			</div>
		</dl>
	</section>

	<section class="mt-6">
		<h2 class="text-sm font-semibold text-base-content/70">
			Assignments ({course.assignmentNames.length})
		</h2>
		{#if course.assignmentNames.length === 0}
			<p class="mt-2 text-sm text-base-content/50">Keine Assignments in diesem Kurs.</p>
		{:else}
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each course.assignmentNames as a (a)}
					<span class="badge badge-outline">{a}</span>
				{/each}
			</div>
		{/if}
	</section>

	<section class="mt-6">
		<h2 class="text-sm font-semibold text-base-content/70">Lint ({lint.length})</h2>
		{#if lint.length === 0}
			<p class="mt-2 text-sm text-success">✓ Keine Befunde.</p>
		{:else}
			<ul class="mt-2 space-y-1.5">
				{#each lint as f (f.path + f.message)}
					<li class="flex items-start gap-2 rounded-lg border border-base-200 p-2 text-sm">
						<span class="badge {sevBadge(f.severity)} badge-sm mt-0.5">{f.severity}</span>
						<span>
							<span class="font-mono text-xs text-base-content/60">{f.path}</span><br />
							{f.message}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</main>

{#if confirmOpen}
	<div class="modal modal-open">
		<div class="modal-box">
			<h2 class="text-lg font-semibold">Kurs löschen?</h2>
			<p class="mt-2 text-sm">
				Der Kurs <span class="font-mono font-semibold">{course.name}</span> wird endgültig aus deiner
				glabs-web-Datenbank entfernt. Lade vorher das YAML herunter, wenn du es behalten möchtest.
			</p>
			<div class="modal-action">
				<button class="btn btn-ghost btn-sm" onclick={() => (confirmOpen = false)}>Abbrechen</button
				>
				<button class="btn btn-error btn-sm" disabled={deleting} onclick={doDelete}>
					{deleting ? 'löscht …' : 'Endgültig löschen'}
				</button>
			</div>
		</div>
		<button class="modal-backdrop" aria-label="schließen" onclick={() => (confirmOpen = false)}
		></button>
	</div>
{/if}
