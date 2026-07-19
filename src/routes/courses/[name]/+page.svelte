<script lang="ts">
	import { invalidateAll, goto } from '$app/navigation';
	import { formatDateTime } from '$lib/format';
	import RosterEditor from '$lib/RosterEditor.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

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

	// Assignment aus YAML importieren (Upsert; der Server validiert über den echten
	// Resolver). Der oberste Schlüssel der YAML ist der Assignment-Name.
	let importOpen = $state(false);
	let importText = $state('');
	let importing = $state(false);
	let importError = $state('');
	const importPlaceholder =
		'blatt3:\n  per: student\n  accesslevel: developer\n  startercode:\n    url: git@gitlab.lrz.de:…\n    fromBranch: main';
	function openImport() {
		importText = '';
		importError = '';
		importOpen = true;
	}
	async function onImportFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (file) importText = await file.text();
		input.value = '';
	}
	async function importAssignment() {
		if (!importText.trim() || importing) return;
		importing = true;
		importError = '';
		try {
			const res = await fetch('/api/assignment/import', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ course: course.name, yaml: importText })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				importError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			importOpen = false;
			await invalidateAll();
			const name = d?.importAssignmentYAML?.name;
			if (name)
				await goto(`/courses/${encodeURIComponent(course.name)}/${encodeURIComponent(name)}`);
		} catch (e) {
			importError = e instanceof Error ? e.message : String(e);
		} finally {
			importing = false;
		}
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

	// Umbenennen: der Kursname ist der YAML-Top-Level-Key; der Server prüft die
	// Eindeutigkeit verbindlich.
	let renameOpen = $state(false);
	let renameName = $state('');
	let renaming = $state(false);
	let renameError = $state('');
	function openRename() {
		renameName = course.name;
		renameError = '';
		renameOpen = true;
	}
	async function doRename() {
		const newName = renameName.trim();
		if (!newName || newName === course.name) {
			renameOpen = false;
			return;
		}
		renaming = true;
		renameError = '';
		try {
			const res = await fetch('/api/courses/rename', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ oldName: course.name, newName })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				renameError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			renameOpen = false;
			await goto(`/courses/${encodeURIComponent(newName)}`);
		} catch (err) {
			renameError = err instanceof Error ? err.message : String(err);
		} finally {
			renaming = false;
		}
	}

	function sevBadge(sev: string) {
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
			<a
				class="btn btn-outline btn-sm"
				href="/courses/{encodeURIComponent(course.name)}/check"
				title="Roster gegen GitLab prüfen (GitLab-Token nötig)"
			>
				🔍 Prüfen
			</a>
			<button class="btn btn-outline btn-sm" onclick={openEdit}>✏️ Bearbeiten</button>
			<button class="btn btn-outline btn-sm" onclick={openRename} title="Kurs umbenennen">
				🏷️ Umbenennen
			</button>
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
			<button type="button" class="btn btn-outline btn-sm" onclick={openImport}>
				⬆️ Assignment aus YAML
			</button>
		</form>
	</section>

	<section class="mt-6">
		<h2 class="text-sm font-semibold text-base-content/70">Studierende & Gruppen</h2>
		<RosterEditor {course} />
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

{#if importOpen}
	<div class="modal modal-open">
		<div class="modal-box">
			<h2 class="text-lg font-semibold">Assignment aus YAML importieren</h2>
			<p class="mt-1 text-sm text-base-content/60">
				Ein einzelner Assignment-Block, wie er in einer Kurs-YAML steht — der oberste Schlüssel ist
				der Assignment-Name. Ein gleichnamiges Assignment wird ersetzt (Upsert); der Server prüft es
				über den echten Resolver.
			</p>
			<form
				class="mt-3 flex flex-col gap-2"
				onsubmit={(e) => {
					e.preventDefault();
					importAssignment();
				}}
			>
				<label class="btn btn-outline btn-sm w-fit">
					📄 YAML-Datei laden
					<input type="file" accept=".yaml,.yml,text/yaml" class="hidden" onchange={onImportFile} />
				</label>
				<textarea
					class="textarea textarea-bordered textarea-sm font-mono"
					rows="10"
					placeholder={importPlaceholder}
					bind:value={importText}></textarea>

				{#if importError}
					<div class="alert alert-error">
						<span class="font-mono text-sm break-words whitespace-pre-wrap">{importError}</span>
					</div>
				{/if}

				<div class="modal-action">
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => (importOpen = false)}>
						Abbrechen
					</button>
					<button
						type="submit"
						class="btn btn-primary btn-sm"
						disabled={!importText.trim() || importing}
					>
						{importing ? 'importiert …' : 'Importieren'}
					</button>
				</div>
			</form>
		</div>
		<button class="modal-backdrop" aria-label="schließen" onclick={() => (importOpen = false)}
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

{#if renameOpen}
	<div class="modal modal-open">
		<div class="modal-box">
			<h2 class="text-lg font-semibold">Kurs umbenennen</h2>
			<p class="mt-2 text-sm">
				Benennt <span class="font-mono font-semibold">{course.name}</span> um. Der Name ist der Top-Level-Schlüssel
				der YAML — der Download spiegelt das danach.
			</p>
			<label class="mt-4 flex flex-col gap-1">
				<span class="text-sm font-medium">Neuer Name</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input
					type="text"
					class="input input-bordered input-sm"
					bind:value={renameName}
					autofocus
					onkeydown={(e) => e.key === 'Enter' && doRename()}
				/>
			</label>
			{#if renameError}<p class="mt-2 text-sm text-error">{renameError}</p>{/if}
			<div class="modal-action">
				<button class="btn btn-ghost btn-sm" onclick={() => (renameOpen = false)}>Abbrechen</button>
				<button
					class="btn btn-primary btn-sm"
					disabled={renaming || !renameName.trim() || renameName.trim() === course.name}
					onclick={doRename}
				>
					{renaming ? 'benennt um …' : 'Umbenennen'}
				</button>
			</div>
		</div>
		<button class="modal-backdrop" aria-label="schließen" onclick={() => (renameOpen = false)}
		></button>
	</div>
{/if}
