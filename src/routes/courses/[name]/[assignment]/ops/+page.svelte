<script lang="ts">
	import Convert from 'ansi-to-html';
	import { subscribeRunOp, type LogLine } from '$lib/opSubscription';
	import type { PlanOpMutation } from '$lib/gql/graphql';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Plan = PlanOpMutation['planOp'];
	type OpValue = 'SETACCESS' | 'PROTECT' | 'ARCHIVE' | 'DELETE' | 'GENERATE';

	const OPS: { value: OpValue; label: string; desc: string }[] = [
		{
			value: 'GENERATE',
			label: 'Generate',
			desc: 'Repos anlegen, Startercode pushen, Studierende/Gruppen einladen'
		},
		{ value: 'SETACCESS', label: 'Set Access', desc: 'Zugriffsstufe der Repos setzen' },
		{ value: 'PROTECT', label: 'Protect', desc: 'Branch in den Repos schützen' },
		{ value: 'ARCHIVE', label: 'Archive', desc: 'Repos archivieren' },
		{ value: 'DELETE', label: 'Delete', desc: 'Repos endgültig löschen' }
	];

	let selectedOp = $state<OpValue>('SETACCESS');
	let accessLevel = $state('');
	let branch = $state('');
	let unarchive = $state(false);

	let plan = $state<Plan | null>(null);
	let planning = $state(false);
	let planError = $state('');

	let confirmPhrase = $state('');

	let log = $state<LogLine[]>([]);
	let running = $state(false);
	let done = $state(false);
	let runError = $state('');
	let stopRun: (() => void) | null = null;

	// Terminieren statt jetzt ausführen: nutzt denselben Plan-Token.
	let runAt = $state('');
	let graceMinutes = $state(60);
	let scheduling = $state(false);
	let scheduleError = $state('');
	let scheduled = $state<{ id: string } | null>(null);

	let courseHref = $derived(`/courses/${encodeURIComponent(data.course)}`);
	let assignmentHref = $derived(`${courseHref}/${encodeURIComponent(data.assignment)}`);
	let canRun = $derived(
		!!plan && !running && (!plan.destructive || confirmPhrase === plan.confirmPhrase)
	);
	let canSchedule = $derived(
		!!plan && !!runAt && !scheduling && (!plan.destructive || confirmPhrase === plan.confirmPhrase)
	);

	let resolvedHtml = $derived.by(() => {
		if (!plan?.resolved) return '';
		const convert = new Convert({
			fg: 'inherit',
			bg: 'transparent',
			escapeXML: true,
			newline: false
		});
		return convert.toHtml(plan.resolved);
	});

	// Keep the live log scrolled to the newest line.
	let logEl: HTMLUListElement | undefined = $state();
	$effect(() => {
		void log.length;
		if (logEl) logEl.scrollTop = logEl.scrollHeight;
	});

	function buildParams() {
		if (selectedOp === 'SETACCESS') return accessLevel ? { accessLevel } : {};
		if (selectedOp === 'PROTECT') return branch ? { branch } : {};
		if (selectedOp === 'ARCHIVE') return { unarchive };
		return {};
	}

	async function doPlan() {
		if (planning) return;
		planning = true;
		planError = '';
		plan = null;
		log = [];
		done = false;
		runError = '';
		confirmPhrase = '';
		try {
			const res = await fetch('/api/op/plan', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					op: selectedOp,
					course: data.course,
					assignment: data.assignment,
					params: buildParams()
				})
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				planError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			plan = d.planOp;
		} catch (e) {
			planError = e instanceof Error ? e.message : String(e);
		} finally {
			planning = false;
		}
	}

	function doRun() {
		if (!plan || !canRun) return;
		log = [];
		done = false;
		runError = '';
		running = true;
		stopRun = subscribeRunOp(plan.token, plan.destructive ? confirmPhrase : null, {
			next: (line) => {
				log = [...log, line];
				if (line.level === 'DONE') {
					running = false;
					done = true;
				}
			},
			error: (msg) => {
				runError = msg;
				running = false;
				done = true;
			}
		});
	}

	async function doSchedule() {
		if (!plan || !canSchedule) return;
		scheduling = true;
		scheduleError = '';
		scheduled = null;
		try {
			// datetime-local is a local wall-clock string; toISOString sends the
			// absolute instant (the backend stores UTC, shows local).
			const iso = new Date(runAt).toISOString();
			const res = await fetch('/api/op/schedule', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					token: plan.token,
					runAt: iso,
					graceMinutes,
					confirmPhrase: plan.destructive ? confirmPhrase : null
				})
			});
			const d = await res.json().catch(() => ({}));
			if (!res.ok || d?.error) {
				scheduleError = d?.error || `Fehler (HTTP ${res.status})`;
				return;
			}
			scheduled = d.scheduleOp;
		} catch (e) {
			scheduleError = e instanceof Error ? e.message : String(e);
		} finally {
			scheduling = false;
		}
	}

	function levelClass(level: LogLine['level']): string {
		switch (level) {
			case 'ERROR':
				return 'text-error';
			case 'WARN':
				return 'text-warning';
			case 'RESULT':
			case 'DONE':
				return 'text-success';
			case 'PROGRESS':
				return 'text-base-content/80';
			default:
				return 'text-base-content/60';
		}
	}

	$effect(() => {
		return () => stopRun?.();
	});
</script>

<svelte:head><title>Operationen · {data.assignment} · glabs</title></svelte:head>

<main class="mx-auto max-w-4xl py-8">
	<a href={assignmentHref} class="text-sm text-base-content/60 hover:underline">
		← {data.assignment}
	</a>
	<h1 class="mt-2 text-2xl font-bold">Operationen: {data.assignment}</h1>
	<p class="mt-1 text-xs text-base-content/50">
		Mutierende GitLab-Ops mit Plan/Bestätigen: erst planen (Vorschau ohne GitLab-Zugriff), dann
		ausführen. Braucht einen hinterlegten <a class="link" href="/token">GitLab-Token</a>.
	</p>

	<!-- Op-Auswahl + Parameter -->
	<section class="mt-6 rounded-2xl border border-base-200 p-4">
		<div class="flex flex-wrap gap-2">
			{#each OPS as o (o.value)}
				<button
					class="btn btn-sm {selectedOp === o.value ? 'btn-primary' : 'btn-outline'}"
					onclick={() => {
						selectedOp = o.value;
						plan = null;
					}}
					title={o.desc}
				>
					{o.label}
				</button>
			{/each}
		</div>

		<div class="mt-3 flex flex-wrap items-end gap-3">
			{#if selectedOp === 'SETACCESS'}
				<label class="flex flex-col gap-1">
					<span class="text-xs font-medium text-base-content/60"
						>accesslevel (sonst aus Config)</span
					>
					<select class="select select-bordered select-sm" bind:value={accessLevel}>
						<option value="">— aus Config —</option>
						<option value="guest">guest</option>
						<option value="reporter">reporter</option>
						<option value="developer">developer</option>
						<option value="maintainer">maintainer</option>
					</select>
				</label>
			{:else if selectedOp === 'PROTECT'}
				<label class="flex flex-col gap-1">
					<span class="text-xs font-medium text-base-content/60">branch (sonst aus Config)</span>
					<input
						type="text"
						class="input input-bordered input-sm font-mono"
						placeholder="z. B. main"
						bind:value={branch}
					/>
				</label>
			{:else if selectedOp === 'ARCHIVE'}
				<label class="flex cursor-pointer items-center gap-2 text-sm">
					<input type="checkbox" class="toggle toggle-sm" bind:checked={unarchive} />
					Entarchivieren statt archivieren
				</label>
			{:else if selectedOp === 'GENERATE'}
				<p class="text-xs text-base-content/60">
					Legt fehlende Repos an, pusht den Startercode und lädt Studierende/Gruppen ein. Bestehende
					Repos werden übersprungen. Der Plan zeigt die betroffenen Repos vorab.
				</p>
			{/if}
			<button class="btn btn-primary btn-sm" disabled={planning} onclick={doPlan}>
				{planning ? 'plant …' : 'Planen'}
			</button>
		</div>

		{#if planError}
			<div class="mt-3 alert alert-error">
				<span class="font-mono text-sm break-words whitespace-pre-wrap">{planError}</span>
			</div>
		{/if}
	</section>

	<!-- Plan-Vorschau -->
	{#if plan}
		<section class="mt-4 rounded-2xl border border-base-200 p-4">
			<h2 class="text-sm font-semibold text-base-content/70">
				Plan: {plan.op} · {plan.targets.length} Repositor{plan.targets.length === 1 ? 'y' : 'ies'}
			</h2>

			{#each plan.warnings as w (w)}
				<div class="mt-2 alert alert-warning">
					<span class="text-sm">{w}</span>
				</div>
			{/each}

			{#if plan.targets.length > 0}
				<ul class="mt-3 max-h-52 overflow-auto text-sm">
					{#each plan.targets as t (t.url)}
						<li class="flex flex-wrap items-baseline justify-between gap-x-3 py-0.5">
							<span class="font-mono text-base-content/70">{t.for}</span>
							<a
								class="link link-hover font-mono break-all text-primary"
								href={t.url}
								target="_blank"
								rel="noopener">{t.repo}</a
							>
						</li>
					{/each}
				</ul>
			{/if}

			{#if plan.resolved}
				<details class="mt-3">
					<summary class="cursor-pointer text-xs text-base-content/60"
						>Aufgelöste Konfiguration</summary
					>
					<pre
						class="mt-2 max-h-72 overflow-auto rounded-xl border border-base-200 bg-base-200 p-3 text-xs leading-relaxed text-base-content">{@html resolvedHtml}</pre>
				</details>
			{/if}

			{#if plan.destructive}
				<div class="mt-4">
					<label class="flex flex-col gap-1">
						<span class="text-sm text-error">
							Destruktiv — tippe <span class="font-mono font-semibold">{plan.confirmPhrase}</span> zum
							Bestätigen:
						</span>
						<input
							type="text"
							class="input input-bordered input-sm font-mono"
							placeholder={plan.confirmPhrase}
							bind:value={confirmPhrase}
						/>
					</label>
				</div>
			{/if}

			<button class="btn btn-primary btn-sm mt-4" disabled={!canRun} onclick={doRun}>
				{running ? 'läuft …' : '▶ Ausführen'}
			</button>
			<p class="mt-1 text-xs text-base-content/50">
				Läuft serverseitig weiter, auch wenn du den Tab schließt.
			</p>

			<div class="divider text-xs text-base-content/40">oder terminieren</div>
			<div class="flex flex-wrap items-end gap-3">
				<label class="flex flex-col gap-1">
					<span class="text-xs font-medium text-base-content/60">Zeitpunkt (lokal)</span>
					<input type="datetime-local" class="input input-bordered input-sm" bind:value={runAt} />
				</label>
				<label class="flex flex-col gap-1">
					<span class="text-xs font-medium text-base-content/60">Kulanz (min)</span>
					<input
						type="number"
						min="0"
						class="input input-bordered input-sm w-24"
						bind:value={graceMinutes}
					/>
				</label>
				<button class="btn btn-outline btn-sm" disabled={!canSchedule} onclick={doSchedule}>
					{scheduling ? 'plant …' : '🕒 Terminieren'}
				</button>
			</div>
			<p class="mt-1 text-xs text-base-content/50">
				Du bekommst eine E-Mail bei der Bestätigung und nach der Ausführung. Erfordert einen
				hinterlegten GitLab-Token.
			</p>
			{#if scheduleError}
				<div class="mt-2 alert alert-error">
					<span class="font-mono text-sm break-words whitespace-pre-wrap">{scheduleError}</span>
				</div>
			{/if}
			{#if scheduled}
				<div class="mt-2 alert alert-success">
					<span class="text-sm">
						Geplant. <a class="link" href="/jobs">Zu den geplanten Jobs →</a>
					</span>
				</div>
			{/if}
		</section>
	{/if}

	<!-- Live-Log -->
	{#if log.length > 0 || running || runError}
		<section class="mt-4 rounded-2xl border border-base-200 p-4">
			<div class="flex items-center gap-2 text-sm font-medium">
				{#if running}
					<span class="loading loading-spinner loading-sm"></span> läuft …
				{:else if done}
					<span class="text-success">✓ fertig</span>
				{/if}
			</div>
			{#if runError}
				<div class="mt-2 alert alert-error">
					<span class="font-mono text-sm break-words whitespace-pre-wrap">{runError}</span>
				</div>
			{/if}
			{#if log.length > 0}
				<ul bind:this={logEl} class="mt-2 max-h-96 overflow-auto font-mono text-xs leading-relaxed">
					{#each log as line, i (i)}
						<li class={levelClass(line.level)}>{line.text}</li>
					{/each}
				</ul>
			{/if}
		</section>
	{/if}
</main>
