<script>
	import Convert from 'ansi-to-html';
	import { untrack } from 'svelte';

	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	let a = $derived(data.assignment);
	let schema = $derived(data.schema ?? []);

	/**
	 * @param {any[]} sch
	 * @param {{key: string, value: string}[]} own
	 */
	function build(sch, own) {
		const ownMap = Object.fromEntries((own ?? []).map((o) => [o.key, o.value]));
		/** @type {Record<string, any>} */
		const f = {};
		for (const field of sch ?? []) {
			const v = ownMap[field.key] ?? '';
			f[field.key] = field.kind === 'BOOL' ? v === 'true' : v;
		}
		return f;
	}

	/**
	 * Lokaler Formular-Zustand, vorbefüllt aus den eigenen (Source-)Werten. Der
	 * Editor ist in diesem Schritt eine Vorschau: die Bedienelemente sind schon
	 * interaktiv (Dropdowns, Validierung), aber Speichern + Server-Validierung
	 * folgen im nächsten Schritt. `untrack`: der Initialwert wird bewusst einmal
	 * erfasst — das Zurücksetzen bei Navigation übernimmt der $effect unten.
	 * @type {Record<string, any>}
	 */
	let form = $state(untrack(() => build(data.schema, data.assignment.own)));

	// Gleiche Route für alle Assignments → SvelteKit verwendet die Komponente
	// wieder, der $state-Initializer läuft nicht erneut. Beim Wechsel auf ein
	// anderes Assignment den Formular-Zustand neu aufbauen.
	$effect(() => {
		const id = a.course + '/' + a.name;
		untrack(() => {
			void id;
			form = build(data.schema, data.assignment.own);
		});
	});

	// Live-Client-Validierung: Pflichtfelder eines konkreten (nicht abstrakten)
	// Assignments. Die verbindliche Prüfung macht später der Server-Resolver.
	let errors = $derived.by(() => {
		/** @type {Record<string, string>} */
		const e = {};
		if (a.abstract) return e;
		for (const field of schema) {
			if (field.required && (form[field.key] === '' || form[field.key] == null)) {
				e[field.key] = `„${field.label}" ist erforderlich.`;
			}
		}
		return e;
	});

	// Aufgelöste Vorschau (Show()-Ausgabe mit ANSI) → HTML. Terminal-Farben auf
	// dunklem Grund; escapeXML schützt vor HTML in Config-Werten.
	let resolvedHtml = $derived.by(() => {
		if (!a.resolved) return '';
		const convert = new Convert({ fg: '#cdd6f4', bg: '#1e1e2e', escapeXML: true, newline: false });
		return convert.toHtml(a.resolved);
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
		{#if a.extends}
			<span class="badge badge-ghost gap-1" title="erbt von {a.extends}">erbt von {a.extends}</span>
		{/if}
		{#if a.abstract}
			<span class="badge badge-warning" title="abstrakte Basis">abstrakt</span>
		{/if}
	</div>

	<div class="mt-3 alert alert-info">
		<span class="text-sm">
			Vorschau des geführten Editors — die Felder sind bereits interaktiv (Dropdowns,
			Beschreibungen, Pflichtprüfung). <span class="font-medium"
				>Speichern und Server-Validierung folgen im nächsten Schritt.</span
			>
		</span>
	</div>

	<div class="mt-4 grid gap-6 lg:grid-cols-2">
		<!-- Schema-getriebenes Formular -->
		<section>
			<h2 class="text-sm font-semibold text-base-content/70">Konfiguration</h2>
			<div class="mt-3 flex flex-col gap-4">
				{#each schema as field (field.key)}
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

						{#if errors[field.key]}
							<p class="text-xs text-error">{errors[field.key]}</p>
						{/if}
					</div>
				{/each}
			</div>

			<div class="mt-5 flex items-center gap-3">
				<button class="btn btn-primary btn-sm" disabled title="Speichern folgt im nächsten Schritt">
					Speichern (folgt)
				</button>
				{#if Object.keys(errors).length > 0}
					<span class="text-xs text-error">{Object.keys(errors).length} Pflichtfeld(er) offen</span>
				{/if}
			</div>
		</section>

		<!-- Aufgelöste Vorschau -->
		<section>
			<h2 class="text-sm font-semibold text-base-content/70">Aufgelöste Konfiguration</h2>
			<p class="mt-1 text-xs text-base-content/50">
				Was aus <code>extends</code> und den Eingaben tatsächlich wird — wie
				<code>glabs show</code>.
			</p>
			{#if a.resolveError}
				<div class="mt-3 alert alert-warning">
					<span class="text-sm">{a.resolveError}</span>
				</div>
			{:else}
				<pre
					class="mt-3 max-h-[70vh] overflow-auto rounded-xl p-4 text-xs leading-relaxed"
					style="background:#1e1e2e;color:#cdd6f4;">{@html resolvedHtml}</pre>
			{/if}
		</section>
	</div>
</main>
