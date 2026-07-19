<script lang="ts">
	import Convert from 'ansi-to-html';
	import { untrack } from 'svelte';
	import { invalidateAll, goto } from '$app/navigation';
	import type { PageData } from './$types';

	// Strukturtypen für die schema-getriebenen Felder (decken die Query-Formen von
	// assignmentSchema/approvalSettingsSchema mit Optionen und branchRuleSchema/
	// approvalRuleSchema ohne Optionen ab).
	type FieldOption = { value: string; label: string; description: string };
	type FieldMeta = {
		key: string;
		label: string;
		description: string;
		kind: string;
		required: boolean;
		group?: string;
		deprecated?: boolean;
		example?: string | null;
		options: FieldOption[];
	};
	type RuleField = {
		key: string;
		label: string;
		description: string;
		kind: string;
		required: boolean;
		example?: string | null;
	};
	type FieldValue = { key: string; value: string };
	type Draft = FieldValue[];
	// Dynamisches, schema-getriebenes Formular: Werte sind pro Feld String (Text/
	// Enum) oder Boolean (Toggle) — als Record mit `any`-Werten gehalten, damit
	// `bind:value`/`bind:checked` generisch über beliebige Feld-Keys binden können.
	type FormRow = Record<string, any>;
	type ValidationResult = {
		ok: boolean;
		errors: string[];
		resolved?: string | null;
		resolveError?: string | null;
	};

	let { data }: { data: PageData } = $props();

	let a = $derived(data.assignment);
	// Gültige `extends`-Ziele: die Geschwister-Assignments des Kurses (server-
	// autoritativ; für ein neues Assignment alle existierenden Namen). Speist das
	// Vererbungs-Dropdown statt eines Freitextfelds.
	let extendsOptions = $derived(a.extendsOptions ?? []);
	let schema = $derived(data.schema ?? []);
	let branchSchema = $derived(data.branchSchema ?? []);
	let settingsSchema = $derived(data.settingsSchema ?? []);
	let ruleSchema = $derived(data.ruleSchema ?? []);
	// „Neu"-Modus: das Assignment existiert noch nicht, Speichern legt es an.
	let isNew = $derived(data.isNew ?? false);
	// Repository-URLs (aus der aufgelösten Config; null bei neu/abstrakt/nicht
	// auflösbar). Spiegelt den gespeicherten Stand, nicht den ungespeicherten Entwurf.
	let urls = $derived(data.urls ?? null);

	// Felder nach ihrer Sektion (`group`) bündeln, Reihenfolge wie im Schema.
	// Leere Gruppe ("") ist der Top-Level-Abschnitt ohne Überschrift.
	let groups = $derived.by(() => {
		const out: { group: string; fields: FieldMeta[] }[] = [];
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
	 */
	function build(sch: FieldMeta[], ssch: FieldMeta[], own: FieldValue[]): FormRow {
		const ownMap = Object.fromEntries((own ?? []).map((o) => [o.key, o.value]));
		const f: FormRow = {};
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
	 */
	function buildRows(rsch: RuleField[], own: FieldValue[], prefix: string): FormRow[] {
		const map = Object.fromEntries((own ?? []).map((o) => [o.key, o.value]));
		const count = parseInt(map[`${prefix}.count`] ?? '0', 10) || 0;
		const rows: FormRow[] = [];
		for (let i = 0; i < count; i++) {
			const row: FormRow = {};
			for (const f of rsch ?? []) {
				const v = map[`${prefix}.${i}.${f.key}`] ?? '';
				row[f.key] = f.kind === 'BOOL' ? v === 'true' : v;
			}
			rows.push(row);
		}
		return rows;
	}

	function emptyRow(rsch: RuleField[]): FormRow {
		const row: FormRow = {};
		for (const f of rsch ?? []) row[f.key] = f.kind === 'BOOL' ? false : '';
		return row;
	}

	/**
	 * Repeat-Group-Zeilen → Draft-Keys (count-Sentinel + indizierte Keys).
	 */
	function rowsToDraft(rows: FormRow[], rsch: RuleField[], prefix: string): Draft {
		const out: Draft = [{ key: `${prefix}.count`, value: String(rows.length) }];
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
	function toDraft(): Draft {
		const draft: Draft = schema.map((field) => ({
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
	let form = $state<FormRow>(
		untrack(() => build(data.schema, data.settingsSchema, data.assignment.own))
	);
	let original = $state<FormRow>(
		untrack(() => build(data.schema, data.settingsSchema, data.assignment.own))
	);
	let branchRows = $state<FormRow[]>(
		untrack(() => buildRows(data.branchSchema, data.assignment.own, 'branches'))
	);
	let originalBranches = $state<FormRow[]>(
		untrack(() => buildRows(data.branchSchema, data.assignment.own, 'branches'))
	);
	let approvalRows = $state<FormRow[]>(
		untrack(() => buildRows(data.ruleSchema, data.assignment.own, 'approvals.rules'))
	);
	let originalApprovals = $state<FormRow[]>(
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
	function removeBranch(i: number) {
		branchRows = branchRows.filter((_, idx) => idx !== i);
		scheduleValidate();
	}
	function addApprovalRule() {
		approvalRows = [...approvalRows, emptyRow(ruleSchema)];
		scheduleValidate();
	}
	function removeApprovalRule(i: number) {
		approvalRows = approvalRows.filter((_, idx) => idx !== i);
		scheduleValidate();
	}

	// Server-Validierung (debounced) für Live-Vorschau + Fehler.
	let serverResult = $state<ValidationResult | null>(null);
	let validating = $state(false);
	let saving = $state(false);
	let saveError = $state('');
	let saveOk = $state(false);

	let debounce: ReturnType<typeof setTimeout> | undefined;
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

	// Kopieren: nur der Name muss eindeutig sein, der Server prüft das verbindlich.
	let showCopy = $state(false);
	let copyName = $state('');
	let copying = $state(false);
	let copyError = $state('');

	async function doCopy() {
		const newName = copyName.trim();
		if (!newName) return;
		copying = true;
		copyError = '';
		try {
			const res = await fetch('/api/assignment/copy', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ course: a.course, from: a.name, newName })
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				copyError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			showCopy = false;
			await goto(`/courses/${encodeURIComponent(a.course)}/${encodeURIComponent(newName)}`);
		} catch (e) {
			copyError = e instanceof Error ? e.message : String(e);
		} finally {
			copying = false;
		}
	}

	// Client-seitige Pflichtprüfung (nur Vorab-Hinweis; verbindlich prüft der Server).
	let clientErrors = $derived.by(() => {
		const e: Record<string, string> = {};
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
		// fg:'inherit' so uncolored/reset text follows the theme's text color; the
		// ANSI accent colors (cyan/yellow/green/red) ride on top and stay readable on
		// the themed surface (see the <pre> bg-base-200/text-base-content below).
		const convert = new Convert({
			fg: 'inherit',
			bg: 'transparent',
			escapeXML: true,
			newline: false
		});
		return convert.toHtml(preview);
	});

	function optionDescription(field: FieldMeta, val: string) {
		const o = (field.options ?? []).find((x) => x.value === val);
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
			<a
				class="btn btn-outline btn-xs"
				href={`/courses/${encodeURIComponent(a.course)}/${encodeURIComponent(a.name)}/ops`}
				title="Mutierende GitLab-Ops (setaccess/protect/archive/delete) mit Plan/Bestätigen"
			>
				⚙️ Operationen
			</a>
			<a
				class="btn btn-outline btn-xs"
				href={`/courses/${encodeURIComponent(a.course)}/${encodeURIComponent(a.name)}/report`}
				title="Live-Report der Repositories (GitLab-Token nötig)"
			>
				📊 Report
			</a>
			<button
				class="btn btn-outline btn-xs"
				onclick={() => {
					copyName = `${a.name}-kopie`;
					copyError = '';
					showCopy = true;
				}}
				title="Assignment unter neuem Namen kopieren"
			>
				📋 Kopieren
			</button>
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
				{#snippet fieldControl(field: FieldMeta)}
					<div class="flex flex-col gap-1">
						<label class="flex items-center gap-2 text-sm font-medium" for="f-{field.key}">
							{field.label}
							{#if field.required}<span class="text-error" title="erforderlich">*</span>{/if}
							{#if field.deprecated}<span class="badge badge-warning badge-xs">deprecated</span
								>{/if}
							<span class="font-mono text-xs font-normal text-base-content/40">{field.key}</span>
						</label>
						<p class="text-xs text-base-content/60">{field.description}</p>

						{#if field.key === 'extends'}
							<!-- `extends` ist kurs-intern → Dropdown der Geschwister statt Freitext -->
							<select
								id="f-{field.key}"
								class="select select-bordered select-sm"
								bind:value={form[field.key]}
							>
								<option value="">— keine Vererbung —</option>
								{#each extendsOptions as name (name)}
									<option value={name}>{name}</option>
								{/each}
								{#if form[field.key] && !extendsOptions.includes(form[field.key])}
									<option value={form[field.key]}>{form[field.key]} (unbekannt)</option>
								{/if}
							</select>
						{:else if field.kind === 'ENUM'}
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
					class="mt-3 max-h-[70vh] overflow-auto rounded-xl border border-base-200 bg-base-200 p-4 text-xs leading-relaxed text-base-content">{@html resolvedHtml}</pre>
			{/if}
		</section>
	</div>

	{#if urls}
		<section class="mt-8">
			<h2 class="text-sm font-semibold text-base-content/70">
				Repository-URLs ({urls.repos.length}
				{urls.per === 'group' ? 'Gruppen' : 'Studierende'})
			</h2>
			<p class="mt-1 text-xs text-base-content/50">
				Aus der aufgelösten Konfiguration abgeleitet (kein GitLab-Zugriff) — spiegelt den
				<span class="font-medium">gespeicherten</span> Stand.
			</p>

			<div class="mt-2 flex items-center gap-2 text-sm">
				<span class="shrink-0 text-base-content/50">Gruppe</span>
				<a
					class="link link-primary font-mono break-all"
					href={urls.groupUrl}
					target="_blank"
					rel="noopener">{urls.groupUrl}</a
				>
			</div>

			{#if urls.repos.length > 0}
				<ul class="mt-3 flex flex-col divide-y divide-base-200 text-sm">
					{#each urls.repos as r (r.url)}
						<li class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-1">
							<span class="font-mono break-all text-base-content/70">{r.for}</span>
							<a
								class="link link-hover font-mono break-all text-primary"
								href={r.url}
								target="_blank"
								rel="noopener">{r.url}</a
							>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="mt-2 text-sm text-base-content/50">
					Noch keine {urls.per === 'group' ? 'Gruppen' : 'Studierenden'} im Kurs — lege sie im Kurs unter
					„Studierende &amp; Gruppen" an.
				</p>
			{/if}
		</section>
	{/if}
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

{#if showCopy}
	<div class="modal modal-open">
		<div class="modal-box">
			<h2 class="text-lg font-semibold">Assignment kopieren</h2>
			<p class="mt-2 text-sm">
				Kopiert <span class="font-mono font-semibold">{a.name}</span> unter einem neuen Namen. Nur der
				Name muss eindeutig sein — sonst ist die Kopie identisch.
			</p>
			<label class="mt-4 flex flex-col gap-1">
				<span class="text-sm font-medium">Neuer Name</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input
					type="text"
					class="input input-bordered input-sm"
					bind:value={copyName}
					autofocus
					onkeydown={(e) => e.key === 'Enter' && doCopy()}
				/>
			</label>
			{#if copyError}<p class="mt-2 text-sm text-error">{copyError}</p>{/if}
			<div class="modal-action">
				<button class="btn btn-ghost btn-sm" onclick={() => (showCopy = false)}>Abbrechen</button>
				<button
					class="btn btn-primary btn-sm"
					disabled={copying || !copyName.trim()}
					onclick={doCopy}
				>
					{copying ? 'kopiert …' : 'Kopieren'}
				</button>
			</div>
		</div>
		<button class="modal-backdrop" aria-label="schließen" onclick={() => (showCopy = false)}
		></button>
	</div>
{/if}
