<script>
	import Convert from 'ansi-to-html';
	import { untrack } from 'svelte';
	import { invalidateAll, goto } from '$app/navigation';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let a = $derived(data.assignment);
	let schema = $derived(data.schema ?? []);
	let branchSchema = $derived(data.branchSchema ?? []);
	let settingsSchema = $derived(data.settingsSchema ?? []);
	let ruleSchema = $derived(data.ruleSchema ?? []);
	// „Neu"-Modus: das Assignment existiert noch nicht, Speichern legt es an.
	let isNew = $derived(data.isNew ?? false);

	// Felder nach ihrer Sektion (`group`) bündeln, Reihenfolge wie im Schema.
	// Leere Gruppe ("") ist der Top-Level-Abschnitt ohne Überschrift.
	let groups = $derived.by(() => {
		/** @type {{group: string, fields: any[]}[]} */
		const out = [];
		for (const f of schema) {
			const g = f.group ?? '';
			let bucket = out.find((b) => b.group === g);
			if (!bucket) {
				bucket = { group: g, fields: [] };
				out.push(bucket);
			}
			bucket.fields.push(f);
		}
		return out;
	});

	/**
	 * Flaches Formular: Skalarfelder (aus `sch`) plus die Approval-Settings, die
	 * unter approvals.settings.<key> abgelegt sind (alle ENUM → String).
	 * @param {any[]} sch @param {any[]} ssch @param {{key: string, value: string}[]} own
	 */
	function build(sch, ssch, own) {
		const ownMap = Object.fromEntries((own ?? []).map((o) => [o.key, o.value]));
		/** @type {Record<string, any>} */
		const f = {};
		for (const field of sch ?? []) {
			const v = ownMap[field.key] ?? '';
			f[field.key] = field.kind === 'BOOL' ? v === 'true' : v;
		}
		for (const field of ssch ?? []) {
			f['approvals.settings.' + field.key] = ownMap['approvals.settings.' + field.key] ?? '';
		}
		return f;
	}

	/**
	 * Repeat-Group-Zeilen aus indizierten own-Keys (`<prefix>.<i>.<feld>`).
	 * @param {any[]} rsch @param {{key: string, value: string}[]} own @param {string} prefix
	 */
	function buildRows(rsch, own, prefix) {
		const map = Object.fromEntries((own ?? []).map((o) => [o.key, o.value]));
		const count = parseInt(map[`${prefix}.count`] ?? '0', 10) || 0;
		/** @type {Record<string, any>[]} */
		const rows = [];
		for (let i = 0; i < count; i++) {
			/** @type {Record<string, any>} */
			const row = {};
			for (const f of rsch ?? []) {
				const v = map[`${prefix}.${i}.${f.key}`] ?? '';
				row[f.key] = f.kind === 'BOOL' ? v === 'true' : v;
			}
			rows.push(row);
		}
		return rows;
	}

	/** @param {any[]} rsch */
	function emptyRow(rsch) {
		/** @type {Record<string, any>} */
		const row = {};
		for (const f of rsch ?? []) row[f.key] = f.kind === 'BOOL' ? false : '';
		return row;
	}

	/**
	 * Repeat-Group-Zeilen → Draft-Keys (count-Sentinel + indizierte Keys).
	 * @param {Record<string, any>[]} rows @param {any[]} rsch @param {string} prefix
	 */
	function rowsToDraft(rows, rsch, prefix) {
		const out = [{ key: `${prefix}.count`, value: String(rows.length) }];
		rows.forEach((row, i) => {
			for (const f of rsch) {
				out.push({
					key: `${prefix}.${i}.${f.key}`,
					value: f.kind === 'BOOL' ? String(!!row[f.key]) : String(row[f.key] ?? '')
				});
			}
		});
		return out;
	}

	/** Formular-Entwurf → GraphQL-Draft (alle Werte als String; Booleans true/false). */
	function toDraft() {
		const draft = schema.map((/** @type {any} */ field) => ({
			key: field.key,
			value: field.kind === 'BOOL' ? String(!!form[field.key]) : String(form[field.key] ?? '')
		}));
		// Approval-Settings (flach, in form unter approvals.settings.*)
		for (const f of settingsSchema) {
			const k = 'approvals.settings.' + f.key;
			draft.push({ key: k, value: String(form[k] ?? '') });
		}
		draft.push(...rowsToDraft(branchRows, branchSchema, 'branches'));
		draft.push(...rowsToDraft(approvalRows, ruleSchema, 'approvals.rules'));
		return draft;
	}

	// Bearbeitbarer Zustand + Vergleichsbasis für „geändert?". untrack: Initialwert
	// bewusst einmal; das Zurücksetzen übernimmt der $effect unten.
	/** @type {Record<string, any>} */
	let form = $state(untrack(() => build(data.schema, data.settingsSchema, data.assignment.own)));
	/** @type {Record<string, any>} */
	let original = $state(
		untrack(() => build(data.schema, data.settingsSchema, data.assignment.own))
	);
	/** @type {Record<string, any>[]} */
	let branchRows = $state(
		untrack(() => buildRows(data.branchSchema, data.assignment.own, 'branches'))
	);
	/** @type {Record<string, any>[]} */
	let originalBranches = $state(
		untrack(() => buildRows(data.branchSchema, data.assignment.own, 'branches'))
	);
	/** @type {Record<string, any>[]} */
	let approvalRows = $state(
		untrack(() => buildRows(data.ruleSchema, data.assignment.own, 'approvals.rules'))
	);
	/** @type {Record<string, any>[]} */
	let originalApprovals = $state(
		untrack(() => buildRows(data.ruleSchema, data.assignment.own, 'approvals.rules'))
	);

	// Neu aufbauen bei Wechsel auf ein anderes Assignment (gleiche Route → Komponente
	// wiederverwendet) und nach dem Speichern (own ändert sich via invalidateAll).
	$effect(() => {
		const id = a.course + '/' + a.name;
		const ownKey = JSON.stringify(a.own);
		untrack(() => {
			void id;
			void ownKey;
			form = build(data.schema, data.settingsSchema, data.assignment.own);
			original = build(data.schema, data.settingsSchema, data.assignment.own);
			branchRows = buildRows(data.branchSchema, data.assignment.own, 'branches');
			originalBranches = buildRows(data.branchSchema, data.assignment.own, 'branches');
			approvalRows = buildRows(data.ruleSchema, data.assignment.own, 'approvals.rules');
			originalApprovals = buildRows(data.ruleSchema, data.assignment.own, 'approvals.rules');
			serverResult = null;
			saveError = '';
			saveOk = false;
		});
	});

	let dirty = $derived(
		JSON.stringify(form) !== JSON.stringify(original) ||
			JSON.stringify(branchRows) !== JSON.stringify(originalBranches) ||
			JSON.stringify(approvalRows) !== JSON.stringify(originalApprovals)
	);

	function addBranch() {
		branchRows = [...branchRows, emptyRow(branchSchema)];
		scheduleValidate();
	}
	/** @param {number} i */
	function removeBranch(i) {
		branchRows = branchRows.filter((_, idx) => idx !== i);
		scheduleValidate();
	}
	function addApprovalRule() {
		approvalRows = [...approvalRows, emptyRow(ruleSchema)];
		scheduleValidate();
	}
	/** @param {number} i */
	function removeApprovalRule(i) {
		approvalRows = approvalRows.filter((_, idx) => idx !== i);
		scheduleValidate();
	}

	// Server-Validierung (debounced) für Live-Vorschau + Fehler.
	/** @typedef {{ok:boolean, errors:string[], resolved?:string|null, resolveError?:string|null}} ValidationResult */
	let serverResult = $state(/** @type {ValidationResult|null} */ (null));
	let validating = $state(false);
	let saving = $state(false);
	let saveError = $state('');
	let saveOk = $state(false);

	/** @type {ReturnType<typeof setTimeout>|undefined} */
	let debounce;
	let validateSeq = 0;

	function scheduleValidate() {
		saveOk = false;
		clearTimeout(debounce);
		debounce = setTimeout(runValidate, 400);
	}

	async function runValidate() {
		const seq = ++validateSeq;
		validating = true;
		try {
			const res = await fetch('/api/assignment/validate', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ course: a.course, name: a.name, draft: toDraft() })
			});
			const d = await res.json().catch(() => ({}));
			if (seq !== validateSeq) return; // eine neuere Prüfung hat gewonnen
			if (!res.ok || d?.error) {
				serverResult = { ok: false, errors: [d?.error || `Fehler (HTTP ${res.status})`] };
			} else {
				serverResult = d.validateAssignmentDraft ?? null;
			}
		} catch (e) {
			if (seq === validateSeq)
				serverResult = { ok: false, errors: [e instanceof Error ? e.message : String(e)] };
		} finally {
			if (seq === validateSeq) validating = false;
		}
	}

	async function save() {
		saving = true;
		saveError = '';
		saveOk = false;
		try {
			const res = await fetch('/api/assignment/set', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ course: a.course, name: a.name, draft: toDraft() })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				saveError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			await invalidateAll(); // lädt own + resolved neu → $effect setzt das Formular zurück
			saveOk = true;
		} catch (e) {
			saveError = e instanceof Error ? e.message : String(e);
		} finally {
			saving = false;
		}
	}

	let confirmDelete = $state(false);
	let deleting = $state(false);

	async function doDelete() {
		deleting = true;
		saveError = '';
		try {
			const res = await fetch('/api/assignment/delete', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ course: a.course, name: a.name })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				saveError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			await goto(`/courses/${encodeURIComponent(a.course)}`);
		} catch (e) {
			saveError = e instanceof Error ? e.message : String(e);
		} finally {
			deleting = false;
			confirmDelete = false;
		}
	}

	// Client-seitige Pflichtprüfung (nur Vorab-Hinweis; verbindlich prüft der Server).
	let clientErrors = $derived.by(() => {
		/** @type {Record<string, string>} */
		const e = {};
		if (form.abstract === true) return e;
		for (const field of schema) {
			if (field.required && (form[field.key] === '' || form[field.key] == null)) {
				e[field.key] = `„${field.label}" ist erforderlich.`;
			}
		}
		return e;
	});

	// Vorschau + Fehler: aus dem letzten Server-Ergebnis, sonst aus dem geladenen Stand.
	let preview = $derived(serverResult ? serverResult.resolved : a.resolved);
	let previewError = $derived(serverResult ? serverResult.resolveError : a.resolveError);
	let serverErrors = $derived(serverResult?.errors ?? []);
	// Speichern erlauben, solange die letzte Prüfung nicht explizit fehlschlug.
	let canSave = $derived(dirty && !saving && serverResult?.ok !== false);

	let resolvedHtml = $derived.by(() => {
		if (!preview) return '';
		const convert = new Convert({ fg: '#cdd6f4', bg: '#1e1e2e', escapeXML: true, newline: false });
		return convert.toHtml(preview);
	});

	/** @param {any} field @param {string} val */
	function optionDescription(field, val) {
		const o = (field.options ?? []).find((/** @type {any} */ x) => x.value === val);
		return o?.description ?? '';
	}
</script>

<svelte:head><title>{a.name} · {a.course} · glabs</title></svelte:head>

<main class="mx-auto max-w-5xl py-8">
	<a
		href="/courses/{encodeURIComponent(a.course)}"
		class="text-sm text-base-content/60 hover:underline">← {a.course}</a
	>

	<div class="mt-2 flex flex-wrap items-center gap-2">
		<h1 class="text-2xl font-bold">{a.name}</h1>
		{#if isNew}
			<span class="badge badge-info" title="wird beim Speichern angelegt">neu</span>
		{/if}
		{#if a.extends}
			<span class="badge badge-ghost gap-1" title="erbt von {a.extends}">erbt von {a.extends}</span>
		{/if}
		{#if form.abstract}
			<span class="badge badge-warning" title="abstrakte Basis">abstrakt</span>
		{/if}
		<div class="flex-1"></div>
		{#if !isNew}
			<button
				class="btn btn-error btn-outline btn-xs"
				onclick={() => (confirmDelete = true)}
				title="Assignment löschen"
			>
				🗑️ Löschen
			</button>
		{/if}
	</div>

	{#if isNew}
		<div class="mt-3 alert alert-info">
			<span class="text-sm">
				Neues Assignment <span class="font-mono font-semibold">{a.name}</span> — fülle die Felder
				aus. <span class="font-medium">Anlegen</span> speichert es, sobald es valide ist.
			</span>
		</div>
	{/if}

	<div class="mt-4 grid gap-6 lg:grid-cols-2">
		<!-- Schema-getriebenes Formular -->
		<section>
			<h2 class="text-sm font-semibold text-base-content/70">Konfiguration</h2>
			<!-- oninput bubbelt von allen Feldern → eine Stelle löst die Server-Prüfung aus -->
			<div class="mt-3 flex flex-col gap-6" oninput={scheduleValidate}>
				{#snippet fieldControl(/** @type {any} */ field)}
					<div class="flex flex-col gap-1">
						<label class="flex items-center gap-2 text-sm font-medium" for="f-{field.key}">
							{field.label}
							{#if field.required}<span class="text-error" title="erforderlich">*</span>{/if}
							{#if field.deprecated}<span class="badge badge-warning badge-xs">deprecated</span
								>{/if}
							<span class="font-mono text-xs font-normal text-base-content/40">{field.key}</span>
						</label>
						<p class="text-xs text-base-content/60">{field.description}</p>

						{#if field.kind === 'ENUM'}
							<select
								id="f-{field.key}"
								class="select select-bordered select-sm"
								bind:value={form[field.key]}
							>
								<option value="">— nicht gesetzt{a.extends ? ' (geerbt)' : ''} —</option>
								{#each field.options as opt (opt.value)}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
							{#if optionDescription(field, form[field.key])}
								<p class="text-xs text-base-content/50">
									{optionDescription(field, form[field.key])}
								</p>
							{/if}
						{:else if field.kind === 'BOOL'}
							<label class="flex w-fit cursor-pointer items-center gap-2">
								<input
									id="f-{field.key}"
									type="checkbox"
									class="toggle toggle-sm"
									bind:checked={form[field.key]}
								/>
								<span class="text-sm">{form[field.key] ? 'an' : 'aus'}</span>
							</label>
						{:else}
							<input
								id="f-{field.key}"
								type="text"
								class="input input-bordered input-sm"
								placeholder={field.example ? `z. B. ${field.example}` : ''}
								bind:value={form[field.key]}
							/>
						{/if}

						{#if clientErrors[field.key]}
							<p class="text-xs text-error">{clientErrors[field.key]}</p>
						{/if}
					</div>
				{/snippet}

				{#each groups as grp (grp.group)}
					<div class="flex flex-col gap-4">
						{#if grp.group}
							<div
								class="border-b border-base-200 pb-1 text-xs font-semibold tracking-wide text-base-content/50 uppercase"
							>
								{grp.group}
							</div>
						{/if}
						{#each grp.fields as field (field.key)}
							{@render fieldControl(field)}
						{/each}
					</div>
				{/each}

				<!-- Branches (Repeat-Group / Liste von Regeln) -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center justify-between border-b border-base-200 pb-1">
						<span class="text-xs font-semibold tracking-wide text-base-content/50 uppercase">
							Branches ({branchRows.length})
						</span>
						<button type="button" class="btn btn-ghost btn-xs" onclick={addBranch}>+ Branch</button>
					</div>
					{#if branchRows.length === 0}
						<p class="text-xs text-base-content/50">
							Keine eigenen Branch-Regeln (werden ggf. von der Basis geerbt).
						</p>
					{/if}
					{#each branchRows as row, i (i)}
						<div class="rounded-lg border border-base-200 p-2">
							<div class="flex items-center justify-between">
								<span class="text-xs font-medium text-base-content/60">Branch #{i + 1}</span>
								<button type="button" class="text-xs text-error" onclick={() => removeBranch(i)}>
									entfernen
								</button>
							</div>
							<div class="mt-2 flex flex-col gap-2">
								{#each branchSchema as f (f.key)}
									{#if f.kind === 'BOOL'}
										<label class="flex cursor-pointer items-center gap-2 text-sm">
											<input type="checkbox" class="toggle toggle-sm" bind:checked={row[f.key]} />
											<span>{f.label}</span>
											<span class="text-xs text-base-content/50">— {f.description}</span>
										</label>
									{:else}
										<label class="flex flex-col gap-1">
											<span class="text-sm font-medium">
												{f.label}{#if f.required}<span class="text-error"> *</span>{/if}
											</span>
											<input
												type="text"
												class="input input-bordered input-sm"
												placeholder={f.example ? `z. B. ${f.example}` : ''}
												bind:value={row[f.key]}
											/>
										</label>
									{/if}
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<!-- Approvals: Settings (Tri-State) + Rules-Repeat-Group (Teil des Merge-Request) -->
				<div class="flex flex-col gap-3">
					<div
						class="border-b border-base-200 pb-1 text-xs font-semibold tracking-wide text-base-content/50 uppercase"
					>
						Approvals
					</div>
					{#each settingsSchema as f (f.key)}
						<div class="flex flex-col gap-1">
							<label class="text-sm font-medium" for="s-{f.key}">{f.label}</label>
							<p class="text-xs text-base-content/60">{f.description}</p>
							<select
								id="s-{f.key}"
								class="select select-bordered select-sm"
								bind:value={form['approvals.settings.' + f.key]}
							>
								<option value="">— nicht gesetzt —</option>
								{#each f.options as opt (opt.value)}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
						</div>
					{/each}

					<div class="flex items-center justify-between">
						<span class="text-xs font-medium text-base-content/60">
							Regeln ({approvalRows.length})
						</span>
						<button type="button" class="btn btn-ghost btn-xs" onclick={addApprovalRule}>
							+ Regel
						</button>
					</div>
					{#each approvalRows as row, i (i)}
						<div class="rounded-lg border border-base-200 p-2">
							<div class="flex items-center justify-between">
								<span class="text-xs font-medium text-base-content/60">Regel #{i + 1}</span>
								<button
									type="button"
									class="text-xs text-error"
									onclick={() => removeApprovalRule(i)}
								>
									entfernen
								</button>
							</div>
							<div class="mt-2 flex flex-col gap-2">
								{#each ruleSchema as f (f.key)}
									{#if f.kind === 'BOOL'}
										<label class="flex cursor-pointer items-center gap-2 text-sm">
											<input type="checkbox" class="toggle toggle-sm" bind:checked={row[f.key]} />
											<span>{f.label}</span>
											<span class="text-xs text-base-content/50">— {f.description}</span>
										</label>
									{:else}
										<label class="flex flex-col gap-1">
											<span class="text-sm font-medium">
												{f.label}{#if f.required}<span class="text-error"> *</span>{/if}
											</span>
											<input
												type="text"
												class="input input-bordered input-sm"
												placeholder={f.example ? `z. B. ${f.example}` : ''}
												bind:value={row[f.key]}
											/>
										</label>
									{/if}
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>

			{#if serverErrors.length > 0}
				<div class="mt-4 alert alert-error">
					<div class="text-sm">
						<div class="font-medium">Nicht speicherbar:</div>
						<ul class="mt-1 list-disc pl-5">
							{#each serverErrors as err (err)}
								<li class="font-mono break-words">{err}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}

			{#if saveError}
				<div class="mt-4 alert alert-error">
					<span class="font-mono text-sm break-words whitespace-pre-wrap">{saveError}</span>
				</div>
			{/if}

			<div class="mt-5 flex items-center gap-3">
				<button class="btn btn-primary btn-sm" disabled={!canSave} onclick={save}>
					{#if saving}
						{isNew ? 'legt an …' : 'speichert …'}
					{:else}
						{isNew ? 'Anlegen' : 'Speichern'}
					{/if}
				</button>
				{#if validating}
					<span class="flex items-center gap-1 text-xs text-base-content/50">
						<span class="loading loading-spinner loading-xs"></span> prüft …
					</span>
				{:else if saveOk && !dirty}
					<span class="text-xs text-success">✓ {isNew ? 'angelegt' : 'gespeichert'}</span>
				{:else if dirty}
					<span class="text-xs text-base-content/50">ungespeicherte Änderungen</span>
				{/if}
			</div>
		</section>

		<!-- Aufgelöste Vorschau (live) -->
		<section>
			<h2 class="text-sm font-semibold text-base-content/70">Aufgelöste Konfiguration</h2>
			<p class="mt-1 text-xs text-base-content/50">
				Was aus <code>extends</code> und den Eingaben tatsächlich wird — live geprüft vom Server,
				wie
				<code>glabs show</code>.
			</p>
			{#if previewError}
				<div class="mt-3 alert alert-warning">
					<span class="text-sm">{previewError}</span>
				</div>
			{:else}
				<pre
					class="mt-3 max-h-[70vh] overflow-auto rounded-xl p-4 text-xs leading-relaxed"
					style="background:#1e1e2e;color:#cdd6f4;">{@html resolvedHtml}</pre>
			{/if}
		</section>
	</div>
</main>

{#if confirmDelete}
	<div class="modal modal-open">
		<div class="modal-box">
			<h2 class="text-lg font-semibold">Assignment löschen?</h2>
			<p class="mt-2 text-sm">
				Das Assignment <span class="font-mono font-semibold">{a.name}</span> wird aus dem Kurs entfernt.
				Der YAML-Download spiegelt das danach.
			</p>
			<div class="modal-action">
				<button class="btn btn-ghost btn-sm" onclick={() => (confirmDelete = false)}
					>Abbrechen</button
				>
				<button class="btn btn-error btn-sm" disabled={deleting} onclick={doDelete}>
					{deleting ? 'löscht …' : 'Endgültig löschen'}
				</button>
			</div>
		</div>
		<button class="modal-backdrop" aria-label="schließen" onclick={() => (confirmDelete = false)}
		></button>
	</div>
{/if}
