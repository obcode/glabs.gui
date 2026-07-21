<script lang="ts">
	import { formatDateTime } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let summary = $derived(data.summary);
	let events = $derived(data.events ?? []);

	// Versand-Status des „Jetzt senden"-Buttons.
	let sending = $state(false);
	let sendResult = $state<{ ok: boolean; msg: string } | null>(null);

	async function sendSummaryNow() {
		sending = true;
		sendResult = null;
		try {
			const res = await fetch('/api/admin/send-summary', { method: 'POST' });
			const body = await res.json();
			if (res.ok && body?.sendSummaryNow) {
				sendResult = {
					ok: true,
					msg: 'Zusammenfassung versendet (an die konfigurierten Empfänger).'
				};
			} else {
				sendResult = { ok: false, msg: body?.error ?? 'Versand fehlgeschlagen.' };
			}
		} catch (e) {
			sendResult = { ok: false, msg: e instanceof Error ? e.message : 'Netzwerkfehler.' };
		} finally {
			sending = false;
		}
	}

	const severityBadge: Record<string, string> = {
		error: 'badge-error',
		warning: 'badge-warning',
		info: 'badge-ghost'
	};

	// Kurze, lesbare Labels für die Event-Typen.
	const typeLabel: Record<string, string> = {
		login: 'Login',
		'login-rejected': 'Login abgelehnt',
		'job-scheduled': 'Job geplant',
		'job-done': 'Job ok',
		'job-failed': 'Job fehlgeschlagen',
		'job-expired': 'Job abgelaufen',
		'job-cancelled': 'Job abgebrochen',
		'op-done': 'Operation ok',
		'op-failed': 'Operation fehlgeschlagen',
		'course-created': 'Kurs angelegt',
		'course-deleted': 'Kurs gelöscht',
		'token-saved': 'Token gespeichert',
		'token-deleted': 'Token gelöscht'
	};

	function courseRef(course?: string | null, assignment?: string | null): string {
		if (!course) return '';
		return assignment ? `${course}/${assignment}` : course;
	}
</script>

<svelte:head><title>Admin · glabs</title></svelte:head>

<main class="mx-auto max-w-6xl py-8">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold">Admin · Monitoring</h1>
			<p class="mt-1 text-xs text-base-content/50">
				Plattformweite Übersicht über alle Nutzer — dieselbe Aufbereitung wie die nächtliche
				Zusammenfassungs-Mail, plus der aktuelle Event-Feed.
			</p>
		</div>
		<button class="btn btn-primary btn-sm" onclick={sendSummaryNow} disabled={sending}>
			{#if sending}<span class="loading loading-spinner loading-xs"></span>{/if}
			Zusammenfassung jetzt senden
		</button>
	</div>

	{#if sendResult}
		<div class="mt-4 alert {sendResult.ok ? 'alert-success' : 'alert-error'} py-2 text-sm">
			<span>{sendResult.msg}</span>
		</div>
	{/if}

	{#if !summary}
		<p class="mt-6 text-sm text-base-content/50">Keine Zusammenfassung verfügbar.</p>
	{:else}
		<p class="mt-4 text-xs text-base-content/50">
			Zeitraum: {formatDateTime(summary.from)} – {formatDateTime(summary.until)} · {summary.totalEvents}
			Ereignisse
		</p>

		<!-- Kennzahlen -->
		<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			<div class="stat rounded-box bg-base-200 py-3">
				<div class="stat-title text-xs">Aktive Nutzer</div>
				<div class="stat-value text-2xl">{summary.activeUsers.length}</div>
			</div>
			<div class="stat rounded-box bg-base-200 py-3">
				<div class="stat-title text-xs">Abgel. Logins</div>
				<div class="stat-value text-2xl {summary.rejectedLogins.length ? 'text-warning' : ''}">
					{summary.rejectedLogins.reduce((n, r) => n + r.count, 0)}
				</div>
			</div>
			<div class="stat rounded-box bg-base-200 py-3">
				<div class="stat-title text-xs">Jobs gelaufen</div>
				<div class="stat-value text-2xl">{summary.jobsRun}</div>
				<div class="stat-desc text-xs">✓ {summary.jobDone} · ✗ {summary.jobFailed}</div>
			</div>
			<div class="stat rounded-box bg-base-200 py-3">
				<div class="stat-title text-xs">Operationen</div>
				<div class="stat-value text-2xl">{summary.opDone + summary.opFailed}</div>
				<div class="stat-desc text-xs">✓ {summary.opDone} · ✗ {summary.opFailed}</div>
			</div>
			<div class="stat rounded-box bg-base-200 py-3">
				<div class="stat-title text-xs">Warnungen/Fehler</div>
				<div class="stat-value text-2xl {summary.problems.length ? 'text-error' : ''}">
					{summary.problems.length}
				</div>
			</div>
		</div>

		<div class="mt-6 grid gap-6 lg:grid-cols-2">
			<!-- Aktive Nutzer -->
			<section>
				<h2 class="text-sm font-semibold text-base-content/70">Aktive Nutzer</h2>
				{#if summary.activeUsers.length === 0}
					<p class="mt-2 text-xs text-base-content/50">Niemand aktiv.</p>
				{:else}
					<div class="mt-2 overflow-x-auto">
						<table class="table-sm table">
							<thead><tr><th>Nutzer</th><th>FK</th><th class="text-right">Logins</th></tr></thead>
							<tbody>
								{#each summary.activeUsers as u (u.email)}
									<tr>
										<td>{u.name || u.email}</td>
										<td class="text-xs">{u.department || '—'}</td>
										<td class="text-right font-mono text-xs">{u.logins}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</section>

			<!-- Abgelehnte Logins -->
			{#if summary.rejectedLogins.length > 0}
				<section>
					<h2 class="text-sm font-semibold text-warning">⚠️ Abgelehnte Logins</h2>
					<div class="mt-2 overflow-x-auto">
						<table class="table-sm table">
							<thead><tr><th>E-Mail</th><th>FK</th><th class="text-right">Versuche</th></tr></thead>
							<tbody>
								{#each summary.rejectedLogins as r (r.email)}
									<tr>
										<td>{r.email}</td>
										<td class="text-xs">{r.department || '—'}</td>
										<td class="text-right font-mono text-xs">{r.count}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</section>
			{/if}
		</div>

		<!-- Jobs & Operationen -->
		<div class="mt-6 grid gap-6 lg:grid-cols-2">
			<section>
				<h2 class="text-sm font-semibold text-base-content/70">Jobs</h2>
				<p class="mt-1 text-xs text-base-content/60">
					Geplant: {summary.scheduledJobs.length} · Gelaufen: {summary.jobsRun}
					(✓ {summary.jobDone} · ✗ {summary.jobFailed} · abgelaufen {summary.jobExpired} · abgebrochen
					{summary.jobCancelled})
				</p>
				{#if summary.jobFailures.length > 0}
					<ul class="mt-2 space-y-1 text-xs">
						{#each summary.jobFailures as f (f.at + f.op + f.course)}
							<li class="text-error">
								<span class="font-mono">{f.op}</span>
								{courseRef(f.course, f.assignment)} — {f.detail}
							</li>
						{/each}
					</ul>
				{/if}
			</section>

			<section>
				<h2 class="text-sm font-semibold text-base-content/70">Interaktive Operationen</h2>
				<p class="mt-1 text-xs text-base-content/60">
					Erfolgreich: {summary.opDone} · Fehlgeschlagen: {summary.opFailed}
				</p>
				{#if summary.opsByType.length > 0}
					<div class="mt-2 flex flex-wrap gap-1">
						{#each summary.opsByType as o (o.label)}
							<span class="badge badge-ghost badge-sm font-mono">{o.label}: {o.count}</span>
						{/each}
					</div>
				{/if}
				{#if summary.opFailures.length > 0}
					<ul class="mt-2 space-y-1 text-xs">
						{#each summary.opFailures as f (f.at + f.op + f.course)}
							<li class="text-error">
								<span class="font-mono">{f.op}</span>
								{courseRef(f.course, f.assignment)} — {f.detail}
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		</div>

		<!-- Sonstiges -->
		{#if summary.courseCreated || summary.courseDeleted || summary.tokenSaved || summary.tokenDeleted}
			<section class="mt-6">
				<h2 class="text-sm font-semibold text-base-content/70">Sonstiges</h2>
				<div class="mt-2 flex flex-wrap gap-1 text-xs">
					{#if summary.courseCreated}<span class="badge badge-ghost badge-sm"
							>Kurse angelegt: {summary.courseCreated}</span
						>{/if}
					{#if summary.courseDeleted}<span class="badge badge-ghost badge-sm"
							>Kurse gelöscht: {summary.courseDeleted}</span
						>{/if}
					{#if summary.tokenSaved}<span class="badge badge-ghost badge-sm"
							>Token gespeichert: {summary.tokenSaved}</span
						>{/if}
					{#if summary.tokenDeleted}<span class="badge badge-ghost badge-sm"
							>Token gelöscht: {summary.tokenDeleted}</span
						>{/if}
				</div>
			</section>
		{/if}
	{/if}

	<!-- Event-Feed -->
	<section class="mt-8">
		<h2 class="text-sm font-semibold text-base-content/70">Event-Feed (letzte 48h)</h2>
		{#if events.length === 0}
			<p class="mt-2 text-xs text-base-content/50">Keine Ereignisse im Zeitraum.</p>
		{:else}
			<div class="mt-2 overflow-x-auto">
				<table class="table-sm table">
					<thead>
						<tr><th>Zeit</th><th>Typ</th><th>Akteur</th><th>Kurs</th><th>Detail</th></tr>
					</thead>
					<tbody>
						{#each events as e (e.at + e.type + e.actor + e.detail)}
							<tr
								class={e.severity === 'error'
									? 'text-error'
									: e.severity === 'warning'
										? 'text-warning'
										: ''}
							>
								<td class="whitespace-nowrap text-xs">{formatDateTime(e.at)}</td>
								<td>
									<span class="badge {severityBadge[e.severity] ?? 'badge-ghost'} badge-sm">
										{typeLabel[e.type] ?? e.type}
									</span>
								</td>
								<td class="text-xs">
									{e.actorName || e.actor || '—'}{#if e.department}<span
											class="text-base-content/40"
										>
											· FK {e.department}</span
										>{/if}
								</td>
								<td class="text-xs">{courseRef(e.course, e.assignment) || '—'}</td>
								<td class="text-xs break-all text-base-content/70">{e.detail || '—'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</main>
