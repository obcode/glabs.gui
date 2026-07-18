<script>
	import { invalidateAll, goto } from '$app/navigation';
	import { formatDateTime } from '$lib/format';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let courses = $derived(data.courses ?? []);

	let importing = $state(false);
	let importError = $state('');
	/** @type {HTMLInputElement | undefined} */
	let fileInput;

	/** @param {Event} e */
	async function onFile(e) {
		const input = /** @type {HTMLInputElement} */ (e.currentTarget);
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
			<button
				class="btn btn-primary btn-sm"
				disabled={importing}
				onclick={() => fileInput?.click()}
			>
				{#if importing}
					<span class="loading loading-spinner loading-xs"></span> importiert …
				{:else}
					⬆️ YAML importieren
				{/if}
			</button>
			<input
				bind:this={fileInput}
				type="file"
				accept=".yaml,.yml,text/yaml,application/x-yaml"
				class="hidden"
				onchange={onFile}
			/>
			<span class="text-xs text-base-content/50"
				>Ein vorhandener Kurs gleichen Namens wird ersetzt.</span
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
