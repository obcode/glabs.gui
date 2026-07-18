<script lang="ts">
	import { formatDateTime } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let report = $derived(data.report);
	let error = $derived(data.error);
	// „Kein Token hinterlegt" ist der häufigste Fehler → gezielt auf /token verweisen.
	let tokenMissing = $derived(!!error && /token/i.test(error));
	let assignmentHref = $derived(
		`/courses/${encodeURIComponent(data.course)}/${encodeURIComponent(data.assignment)}`
	);
</script>

<svelte:head><title>Report · {data.assignment} · {data.course} · glabs</title></svelte:head>

<main class="mx-auto max-w-6xl py-8">
	<a href={assignmentHref} class="text-sm text-base-content/60 hover:underline">
		← {data.assignment}
	</a>

	<div class="mt-2 flex flex-wrap items-start justify-between gap-3">
		<div>
			<h1 class="text-2xl font-bold">Report: {data.assignment}</h1>
			<p class="mt-1 text-xs text-base-content/50">
				{data.course}
				{#if report?.generated}· generiert {formatDateTime(report.generated)}{/if}
			</p>
			{#if report?.description}
				<p class="mt-1 text-sm text-base-content/70">{report.description}</p>
			{/if}
		</div>
		{#if report?.url}
			<a class="btn btn-outline btn-sm" href={report.url} target="_blank" rel="noopener">
				GitLab-Gruppe ↗
			</a>
		{/if}
	</div>

	{#if error}
		<div class="mt-6 alert alert-error">
			<div class="text-sm">
				<div class="font-mono break-words whitespace-pre-wrap">{error}</div>
				{#if tokenMissing}
					<div class="mt-2">
						Hinterlege einen GitLab-Token unter
						<a class="link link-primary" href="/token">GitLab-Token</a>, dann lade neu.
					</div>
				{/if}
			</div>
		</div>
	{:else if !report}
		<div class="mt-10 rounded-2xl border border-dashed border-base-300 p-10 text-center">
			<div class="text-4xl">📊</div>
			<p class="mt-3 font-medium">Kein Report verfügbar</p>
			<p class="mt-1 text-sm text-base-content/60">
				Das Assignment ist nicht auflösbar (z. B. eine abstrakte Basis) oder existiert nicht.
			</p>
		</div>
	{:else if report.projects.length === 0}
		<div class="mt-10 rounded-2xl border border-dashed border-base-300 p-10 text-center">
			<div class="text-4xl">📭</div>
			<p class="mt-3 font-medium">Noch keine Repositories</p>
			<p class="mt-1 text-sm text-base-content/60">
				In der GitLab-Gruppe dieses Assignments liegen noch keine Projekte.
			</p>
		</div>
	{:else}
		<div class="mt-6 overflow-x-auto">
			<table class="table-sm table">
				<thead>
					<tr>
						<th>Repository</th>
						<th>Mitglieder</th>
						<th class="text-right">Commits</th>
						<th>Letzter Commit</th>
						<th>Offen</th>
						{#if report.hasReleaseMergeRequest}<th>Release-MR</th>{/if}
						{#if report.hasReleaseDockerImages}<th>Docker</th>{/if}
					</tr>
				</thead>
				<tbody>
					{#each report.projects as p (p.name)}
						<tr class={p.active ? '' : 'opacity-50'}>
							<td>
								<a
									class="link link-hover font-medium text-primary"
									href={p.webUrl}
									target="_blank"
									rel="noopener"
								>
									{p.name}
								</a>
								{#if p.emptyRepo}
									<span class="badge badge-ghost badge-xs ml-1">leer</span>
								{:else if !p.active}
									<span class="badge badge-ghost badge-xs ml-1">inaktiv</span>
								{/if}
							</td>
							<td class="text-xs">
								{#if p.members.length === 0}
									<span class="text-base-content/40">—</span>
								{:else}
									{#each p.members as m, i (m.username)}<a
											class="link link-hover"
											href={m.webUrl}
											target="_blank"
											rel="noopener"
											title={m.username}>{m.name}</a
										>{#if i < p.members.length - 1},
										{/if}{/each}
								{/if}
							</td>
							<td class="text-right tabular-nums {p.commits === 0 ? 'text-base-content/40' : ''}">
								{p.commits}
							</td>
							<td class="text-xs">
								{#if p.lastCommit}
									<a
										class="link link-hover"
										href={p.lastCommit.webUrl}
										target="_blank"
										rel="noopener"
									>
										{p.lastCommit.title}
									</a>
									<div class="text-base-content/50">
										{p.lastCommit.committerName}{#if p.lastCommit.committedDate}
											· {formatDateTime(p.lastCommit.committedDate)}{/if}
									</div>
								{:else}
									<span class="text-base-content/40">—</span>
								{/if}
							</td>
							<td class="text-xs whitespace-nowrap">
								{#if p.openIssuesCount > 0}
									<a
										class="link link-hover"
										href="{p.webUrl}/-/issues"
										target="_blank"
										rel="noopener"
									>
										{p.openIssuesCount} Issue{p.openIssuesCount === 1 ? '' : 's'}
									</a><br />
								{/if}
								{#if p.openMergeRequestsCount > 0}
									<a
										class="link link-hover"
										href="{p.webUrl}/-/merge_requests"
										target="_blank"
										rel="noopener"
									>
										{p.openMergeRequestsCount} MR{p.openMergeRequestsCount === 1 ? '' : 's'}
									</a>
								{/if}
								{#if p.openIssuesCount === 0 && p.openMergeRequestsCount === 0}
									<span class="text-base-content/40">—</span>
								{/if}
							</td>
							{#if report.hasReleaseMergeRequest}
								<td class="text-xs">
									{#if p.release?.mergeRequest?.found}
										<a
											class="link link-hover"
											href={p.release.mergeRequest.webUrl}
											target="_blank"
											rel="noopener"
										>
											MR ({p.release.mergeRequest.pipelineStatus})
										</a>
									{:else}
										<span class="text-base-content/40">—</span>
									{/if}
								</td>
							{/if}
							{#if report.hasReleaseDockerImages}
								<td class="text-xs">
									{#if p.release?.dockerImages}
										<a
											class="link link-hover"
											href="{p.webUrl}/container_registry"
											target="_blank"
											rel="noopener">{p.release.dockerImages.status}</a
										>
									{:else}
										<span class="text-base-content/40">—</span>
									{/if}
								</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</main>
