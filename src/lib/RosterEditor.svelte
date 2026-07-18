<script>
	import { untrack } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { extractEmails, extractGroups, mergeEmails, mergeGroups } from '$lib/roster';

	/** @type {{ course: { name: string, students?: string[], groups?: { name: string, members: string[] }[] } }} */
	let { course } = $props();

	/** @type {string[]} */
	let students = $state(untrack(() => [...(course.students ?? [])]));
	/** @type {{ name: string, members: string[] }[]} */
	let groups = $state(
		untrack(() => (course.groups ?? []).map((g) => ({ name: g.name, members: [...g.members] })))
	);

	// Nach dem Speichern (invalidateAll ändert die course-Prop) neu aus dem
	// geladenen Stand aufbauen.
	$effect(() => {
		const key = JSON.stringify([course.students, course.groups]);
		untrack(() => {
			void key;
			students = [...(course.students ?? [])];
			groups = (course.groups ?? []).map((g) => ({ name: g.name, members: [...g.members] }));
		});
	});

	let studentsDirty = $derived(JSON.stringify(students) !== JSON.stringify(course.students ?? []));
	let groupsDirty = $derived(
		JSON.stringify(groups) !==
			JSON.stringify((course.groups ?? []).map((g) => ({ name: g.name, members: g.members })))
	);

	// Sortierte Anzeige (die gespeicherte Reihenfolge bleibt unverändert):
	// Studierende alphabetisch, Gruppen nach Name (Zahlen natürlich sortiert),
	// Mitglieder innerhalb einer Gruppe alphabetisch.
	const collator = new Intl.Collator('de', { numeric: true, sensitivity: 'base' });
	let sortedStudents = $derived([...students].sort((x, y) => collator.compare(x, y)));
	let sortedGroups = $derived(
		[...groups]
			.map((g) => ({
				name: g.name,
				members: [...g.members].sort((x, y) => collator.compare(x, y))
			}))
			.sort((x, y) => collator.compare(x.name, y.name))
	);

	let pasteText = $state('');
	let savingStudents = $state(false);
	let savingGroups = $state(false);
	let error = $state('');

	function addPasted() {
		students = mergeEmails(students, extractEmails(pasteText));
		pasteText = '';
	}

	// CSV/TSV als Text; xlsx wird lazy entpackt und in TSV gewandelt (der Parser
	// wird nur geladen, wenn wirklich eine xlsx hochgeladen wird).
	/** @param {File} file */
	async function fileToText(file) {
		if (/\.xlsx$/i.test(file.name)) {
			const { xlsxToTsv } = await import('$lib/xlsx');
			return xlsxToTsv(await file.arrayBuffer());
		}
		return file.text();
	}

	/** @param {Event} e */
	async function onStudentsFile(e) {
		const input = /** @type {HTMLInputElement} */ (e.currentTarget);
		const file = input.files?.[0];
		if (file) students = mergeEmails(students, extractEmails(await fileToText(file)));
		input.value = '';
	}

	/** @param {Event} e */
	async function onGroupsFile(e) {
		const input = /** @type {HTMLInputElement} */ (e.currentTarget);
		const file = input.files?.[0];
		if (file) groups = mergeGroups(groups, extractGroups(await fileToText(file)));
		input.value = '';
	}

	/** @param {string} email */
	function removeStudent(email) {
		students = students.filter((s) => s !== email);
	}
	/** @param {string} name */
	function removeGroup(name) {
		groups = groups.filter((g) => g.name !== name);
	}
	/** @param {string} name @param {string} email */
	function removeMember(name, email) {
		groups = groups
			.map((g) => (g.name === name ? { name, members: g.members.filter((m) => m !== email) } : g))
			.filter((g) => g.members.length > 0);
	}

	async function saveStudents() {
		savingStudents = true;
		error = '';
		try {
			const res = await fetch('/api/courses/students', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name: course.name, students })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				error = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			await invalidateAll();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			savingStudents = false;
		}
	}

	async function saveGroups() {
		savingGroups = true;
		error = '';
		try {
			const res = await fetch('/api/courses/groups', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name: course.name,
					groups: groups.map((g) => ({ name: g.name, members: g.members }))
				})
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				error = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			await invalidateAll();
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			savingGroups = false;
		}
	}
</script>

{#if error}
	<div class="mt-3 alert alert-error">
		<span class="font-mono text-sm break-words whitespace-pre-wrap">{error}</span>
		<button class="btn btn-ghost btn-xs" onclick={() => (error = '')}>schließen</button>
	</div>
{/if}

<div class="mt-3 grid gap-4 lg:grid-cols-2">
	<!-- Studierende -->
	<div class="rounded-2xl border border-base-200 p-4">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-semibold text-base-content/70">Studierende ({students.length})</h3>
			<button
				class="btn btn-primary btn-xs"
				disabled={!studentsDirty || savingStudents}
				onclick={saveStudents}
			>
				{savingStudents ? 'speichert …' : 'Speichern'}
			</button>
		</div>

		{#if students.length > 0}
			<div class="mt-3 flex flex-wrap gap-1">
				{#each sortedStudents as s (s)}
					<span class="badge badge-ghost gap-1">
						{s}
						<button class="text-error" title="entfernen" onclick={() => removeStudent(s)}>×</button>
					</span>
				{/each}
			</div>
		{:else}
			<p class="mt-2 text-sm text-base-content/50">Noch keine Studierenden.</p>
		{/if}

		<div class="mt-3 flex flex-col gap-2">
			<textarea
				class="textarea textarea-bordered textarea-sm font-mono"
				rows="3"
				placeholder="Eine E-Mail pro Zeile einfügen …"
				bind:value={pasteText}></textarea>
			<div class="flex flex-wrap gap-2">
				<button class="btn btn-outline btn-sm" disabled={!pasteText.trim()} onclick={addPasted}>
					+ aus Text
				</button>
				<label class="btn btn-outline btn-sm">
					📄 CSV/Excel importieren
					<input
						type="file"
						accept=".csv,.txt,.tsv,.xlsx"
						class="hidden"
						onchange={onStudentsFile}
					/>
				</label>
			</div>
			<p class="text-xs text-base-content/50">
				Additiv: Import/Paste ergänzt die Liste (dedupliziert). CSV/Excel nutzt die
				<span class="font-mono">E-Mail-Adresse</span>-Spalte.
			</p>
		</div>
	</div>

	<!-- Gruppen -->
	<div class="rounded-2xl border border-base-200 p-4">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-semibold text-base-content/70">Gruppen ({groups.length})</h3>
			<button
				class="btn btn-primary btn-xs"
				disabled={!groupsDirty || savingGroups}
				onclick={saveGroups}
			>
				{savingGroups ? 'speichert …' : 'Speichern'}
			</button>
		</div>

		{#if groups.length > 0}
			<div class="mt-3 flex flex-col gap-2">
				{#each sortedGroups as g (g.name)}
					<div class="rounded-lg border border-base-200 p-2">
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium"
								>{g.name} <span class="text-base-content/50">({g.members.length})</span></span
							>
							<button
								class="text-xs text-error"
								title="Gruppe entfernen"
								onclick={() => removeGroup(g.name)}>Gruppe entfernen</button
							>
						</div>
						<div class="mt-1 flex flex-wrap gap-1">
							{#each g.members as m (m)}
								<span class="badge badge-ghost badge-sm gap-1">
									{m}
									<button
										class="text-error"
										title="entfernen"
										onclick={() => removeMember(g.name, m)}>×</button
									>
								</span>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="mt-2 text-sm text-base-content/50">Noch keine Gruppen.</p>
		{/if}

		<div class="mt-3 flex flex-col gap-2">
			<label class="btn btn-outline btn-sm w-fit">
				📄 Moodle-Datei importieren
				<input type="file" accept=".csv,.txt,.tsv,.xlsx" class="hidden" onchange={onGroupsFile} />
			</label>
			<p class="text-xs text-base-content/50">
				Additiv: erwartet die Moodle-Spalten <span class="font-mono">Gruppe</span> +
				<span class="font-mono">E-Mail-Adresse</span> (CSV, Tab-getrennt oder Excel).
			</p>
		</div>
	</div>
</div>
