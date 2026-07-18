<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { formatDateTime } from '$lib/format';
	import RosterEditor from '$lib/RosterEditor.svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let course = $derived(data.course);
	let lint = $derived(data.lint ?? []);

	let deleting = $state(false);
	let confirmOpen = $state(false);
	let actionError = $state('');

	// Neues Assignment: Name eingeben → in den geführten Editor (Neu-Modus).
	let newAssignment = $state('');
	let newAssignmentValid = $derived(/^[A-Za-z0-9._-]+$/.test(newAssignment.trim()));
	function goToNewAssignment() {
		if (!newAssignmentValid) return;
		goto(`/courses/${encodeURIComponent(course.name)}/${encodeURIComponent(newAssignment.trim())}`);
	}

	// Kurs-Einstellungen bearbeiten.
	let editOpen = $state(false);
	let savingCourse = $state(false);
	let editError = $state('');
	let ec = $state({
		coursePath: '',
		semesterPath: '',
		useCoursenameAsPrefix: true,
		useEmailDomainAsSuffix: true
	});
	function openEdit() {
		ec = {
			coursePath: course.coursePath ?? '',
			semesterPath: course.semesterPath ?? '',
			useCoursenameAsPrefix: !!course.useCoursenameAsPrefix,
			useEmailDomainAsSuffix: !!course.useEmailDomainAsSuffix
		};
		editError = '';
		editOpen = true;
	}
	async function saveCourse() {
		if (savingCourse) return;
		savingCourse = true;
		editError = '';
		try {
			const res = await fetch('/api/courses/set', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name: course.name, ...ec })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				editError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			editOpen = false;
			await invalidateAll();
		} catch (e) {
			editError = e instanceof Error ? e.message : String(e);
		} finally {
			savingCourse = false;
		}
	}

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
			<button class="btn btn-outline btn-sm" onclick={openEdit}>✏️ Bearbeiten</button>
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
		<h2 class="text-sm font-semibold text-base-content/70">Studierende & Gruppen</h2>
		<RosterEditor {course} />
	</section>

	<section class="mt-6">
		<h2 class="text-sm font-semibold text-base-content/70">
			Assignments ({course.assignmentNames.length})
		</h2>
		{#if course.assignmentNames.length === 0}
			<p class="mt-2 text-sm text-base-content/50">Noch keine Assignments in diesem Kurs.</p>
		{:else}
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each course.assignmentNames as a (a)}
					<a
						class="badge badge-outline hover:badge-primary"
						href="/courses/{encodeURIComponent(course.name)}/{encodeURIComponent(a)}"
					>
						{a}
					</a>
				{/each}
			</div>
		{/if}

		<form
			class="mt-3 flex flex-wrap items-start gap-2"
			onsubmit={(e) => {
				e.preventDefault();
				goToNewAssignment();
			}}
		>
			<div class="flex flex-col gap-1">
				<input
					type="text"
					class="input input-bordered input-sm font-mono"
					bind:value={newAssignment}
					placeholder="neues-assignment"
				/>
				{#if newAssignment.trim() && !newAssignmentValid}
					<span class="text-xs text-error">Erlaubt: Buchstaben, Ziffern, „.", „-", „_".</span>
				{/if}
			</div>
			<button type="submit" class="btn btn-primary btn-sm" disabled={!newAssignmentValid}>
				➕ Neues Assignment
			</button>
		</form>
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

{#if editOpen}
	<div class="modal modal-open">
		<div class="modal-box">
			<h2 class="text-lg font-semibold">Kurs bearbeiten</h2>
			<p class="mt-1 text-sm text-base-content/60">
				Assignments, Studierende und Gruppen bleiben unverändert.
			</p>
			<form
				class="mt-3 flex flex-col gap-3"
				onsubmit={(e) => {
					e.preventDefault();
					saveCourse();
				}}
			>
				<div class="grid grid-cols-2 gap-3">
					<label class="flex flex-col gap-1">
						<span class="text-xs font-medium text-base-content/60">coursePath</span>
						<input
							type="text"
							class="input input-bordered input-sm font-mono"
							bind:value={ec.coursePath}
						/>
					</label>
					<label class="flex flex-col gap-1">
						<span class="text-xs font-medium text-base-content/60">semesterPath</span>
						<input
							type="text"
							class="input input-bordered input-sm font-mono"
							bind:value={ec.semesterPath}
						/>
					</label>
				</div>
				<label class="flex cursor-pointer items-center gap-2 text-sm">
					<input type="checkbox" class="toggle toggle-sm" bind:checked={ec.useCoursenameAsPrefix} />
					Kursname als Präfix
				</label>
				<label class="flex cursor-pointer items-center gap-2 text-sm">
					<input
						type="checkbox"
						class="toggle toggle-sm"
						bind:checked={ec.useEmailDomainAsSuffix}
					/>
					E-Mail-Domain als Suffix
				</label>

				{#if editError}
					<div class="alert alert-error">
						<span class="font-mono text-sm break-words whitespace-pre-wrap">{editError}</span>
					</div>
				{/if}

				<div class="modal-action">
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => (editOpen = false)}>
						Abbrechen
					</button>
					<button type="submit" class="btn btn-primary btn-sm" disabled={savingCourse}>
						{savingCourse ? 'speichert …' : 'Speichern'}
					</button>
				</div>
			</form>
		</div>
		<button class="modal-backdrop" aria-label="schließen" onclick={() => (editOpen = false)}
		></button>
	</div>
{/if}

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
