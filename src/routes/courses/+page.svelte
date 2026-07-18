<script lang="ts">
	import { invalidateAll, goto } from '$app/navigation';
	import { formatDateTime } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let courses = $derived(data.courses ?? []);

	let importing = $state(false);
	let importError = $state('');
	let fileInput: HTMLInputElement | undefined = $state();

	// Neuen Kurs from scratch anlegen.
	let newOpen = $state(false);
	let creating = $state(false);
	let createError = $state('');
	let nc = $state({
		name: '',
		coursePath: '',
		semesterPath: '',
		useCoursenameAsPrefix: true,
		useEmailDomainAsSuffix: false
	});
	let ncNameValid = $derived(/^[A-Za-z0-9._-]+$/.test(nc.name.trim()));

	function openNew() {
		nc = {
			name: '',
			coursePath: '',
			semesterPath: '',
			useCoursenameAsPrefix: true,
			useEmailDomainAsSuffix: false
		};
		createError = '';
		newOpen = true;
	}

	async function createCourse() {
		if (!ncNameValid || creating) return;
		creating = true;
		createError = '';
		try {
			const res = await fetch('/api/courses/create', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ ...nc, name: nc.name.trim() })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				createError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			newOpen = false;
			await invalidateAll();
			await goto(`/courses/${encodeURIComponent(nc.name.trim())}`);
		} catch (e) {
			createError = e instanceof Error ? e.message : String(e);
		} finally {
			creating = false;
		}
	}

	async function onFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		importing = true;
		importError = '';
		try {
			const yaml = await file.text();
			const res = await fetch('/api/courses/import', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ yaml })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				importError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			await invalidateAll();
			const name = d?.importCourseYAML?.name;
			if (name) await goto(`/courses/${encodeURIComponent(name)}`);
		} catch (err) {
			importError = err instanceof Error ? err.message : String(err);
		} finally {
			importing = false;
			if (fileInput) fileInput.value = '';
		}
	}
</script>

<svelte:head><title>Kurse · glabs</title></svelte:head>

<main class="mx-auto max-w-5xl py-8">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<div>
			<h1 class="text-2xl font-bold">Kurse</h1>
			<p class="mt-1 text-sm text-base-content/60">
				Nur deine eigenen Kurse — jede Kennung sieht ausschließlich die ihren.
			</p>
		</div>
		<div class="flex flex-col items-end gap-1">
			<div class="flex gap-2">
				<button class="btn btn-primary btn-sm" onclick={openNew}>➕ Neuer Kurs</button>
				<button
					class="btn btn-outline btn-sm"
					disabled={importing}
					onclick={() => fileInput?.click()}
				>
					{#if importing}
						<span class="loading loading-spinner loading-xs"></span> importiert …
					{:else}
						⬆️ YAML importieren
					{/if}
				</button>
			</div>
			<input
				bind:this={fileInput}
				type="file"
				accept=".yaml,.yml,text/yaml,application/x-yaml"
				class="hidden"
				onchange={onFile}
			/>
			<span class="text-xs text-base-content/50"
				>Neu anlegen oder eine YAML importieren (ersetzt einen gleichnamigen Kurs).</span
			>
		</div>
	</div>

	{#if importError}
		<div class="mt-4 alert alert-error">
			<span class="font-mono text-sm break-words whitespace-pre-wrap">{importError}</span>
			<button class="btn btn-ghost btn-xs" onclick={() => (importError = '')}>schließen</button>
		</div>
	{/if}

	{#if data.error}
		<div class="mt-4 alert alert-warning">
			<span class="text-sm">Kurse konnten nicht geladen werden: {data.error}</span>
		</div>
	{/if}

	{#if courses.length === 0}
		<div class="mt-10 rounded-2xl border border-dashed border-base-300 p-10 text-center">
			<div class="text-4xl">📂</div>
			<p class="mt-3 font-medium">Noch keine Kurse</p>
			<p class="mt-1 text-sm text-base-content/60">
				Importiere eine <code>.yaml</code>-Kurskonfiguration, um zu beginnen.
			</p>
		</div>
	{:else}
		<div class="mt-6 grid gap-3 sm:grid-cols-2">
			{#each courses as c (c.name)}
				<a
					href="/courses/{encodeURIComponent(c.name)}"
					class="card border border-base-200 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
				>
					<div class="card-body gap-2">
						<div class="flex items-center justify-between">
							<h2 class="card-title">{c.name}</h2>
							<span class="text-xs text-base-content/50">{formatDateTime(c.updatedAt)}</span>
						</div>
						<div class="flex flex-wrap gap-1.5 text-xs">
							<span class="badge badge-ghost">{c.assignmentNames.length} Assignments</span>
							<span class="badge badge-ghost">{c.studentCount} Studierende</span>
							<span class="badge badge-ghost">{c.groupCount} Gruppen</span>
						</div>
						{#if c.coursePath}
							<p class="truncate font-mono text-xs text-base-content/50" title={c.coursePath}>
								{c.coursePath}
							</p>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</main>

{#if newOpen}
	<div class="modal modal-open">
		<div class="modal-box">
			<h2 class="text-lg font-semibold">Neuen Kurs anlegen</h2>
			<p class="mt-1 text-sm text-base-content/60">
				Legt einen leeren Kurs an. Assignments fügst du danach im Kurs hinzu.
			</p>
			<form
				class="mt-3 flex flex-col gap-3"
				onsubmit={(e) => {
					e.preventDefault();
					createCourse();
				}}
			>
				<label class="flex flex-col gap-1">
					<span class="text-xs font-medium text-base-content/60">Name *</span>
					<input
						type="text"
						class="input input-bordered input-sm font-mono"
						bind:value={nc.name}
						placeholder="z. B. mpd"
					/>
					{#if nc.name.trim() && !ncNameValid}
						<span class="text-xs text-error">Erlaubt: Buchstaben, Ziffern, „.", „-", „_".</span>
					{/if}
				</label>
				<div class="grid grid-cols-2 gap-3">
					<label class="flex flex-col gap-1">
						<span class="text-xs font-medium text-base-content/60">coursePath</span>
						<input
							type="text"
							class="input input-bordered input-sm font-mono"
							bind:value={nc.coursePath}
							placeholder="mpd/semester"
						/>
					</label>
					<label class="flex flex-col gap-1">
						<span class="text-xs font-medium text-base-content/60">semesterPath</span>
						<input
							type="text"
							class="input input-bordered input-sm font-mono"
							bind:value={nc.semesterPath}
							placeholder="ob-26ss"
						/>
					</label>
				</div>
				<label class="flex cursor-pointer items-center gap-2 text-sm">
					<input type="checkbox" class="toggle toggle-sm" bind:checked={nc.useCoursenameAsPrefix} />
					Kursname als Präfix
				</label>
				<label class="flex cursor-pointer items-center gap-2 text-sm">
					<input
						type="checkbox"
						class="toggle toggle-sm"
						bind:checked={nc.useEmailDomainAsSuffix}
					/>
					E-Mail-Domain als Suffix
				</label>

				{#if createError}
					<div class="alert alert-error">
						<span class="font-mono text-sm break-words whitespace-pre-wrap">{createError}</span>
					</div>
				{/if}

				<div class="modal-action">
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => (newOpen = false)}>
						Abbrechen
					</button>
					<button type="submit" class="btn btn-primary btn-sm" disabled={!ncNameValid || creating}>
						{creating ? 'legt an …' : 'Anlegen'}
					</button>
				</div>
			</form>
		</div>
		<button class="modal-backdrop" aria-label="schließen" onclick={() => (newOpen = false)}
		></button>
	</div>
{/if}
