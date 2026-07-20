<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let students = $derived(data.students ?? []);
	let foundCount = $derived(students.filter((s) => s.found).length);

	function fullName(s: { firstName?: string | null; lastName?: string | null }): string {
		return [s.firstName, s.lastName].filter(Boolean).join(' ');
	}
</script>

<svelte:head><title>Studierende · {data.course} · glabs</title></svelte:head>

<main class="mx-auto max-w-4xl py-8">
	<a
		href="/courses/{encodeURIComponent(data.course)}"
		class="text-sm text-base-content/60 hover:underline">← {data.course}</a
	>
	<h1 class="mt-2 text-2xl font-bold">Studierende: {data.course}</h1>
	<p class="mt-1 text-xs text-base-content/50">
		Kurs-Roster, angereichert über ZPA ({foundCount}/{students.length} in ZPA gefunden). „—" heißt, ZPA
		hatte keinen eindeutigen Treffer für die E-Mail.
	</p>

	{#if students.length === 0}
		<p class="mt-6 text-sm text-base-content/50">
			Noch keine Studierenden im Kurs. Lege sie im Kurs unter „Studierende &amp; Gruppen" an.
		</p>
	{:else}
		<div class="mt-6 overflow-x-auto">
			<table class="table-sm table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Geschl.</th>
						<th>Gruppe</th>
						<th>E-Mail</th>
					</tr>
				</thead>
				<tbody>
					{#each students as s (s.email)}
						<tr class={s.found ? '' : 'opacity-60'}>
							<td class="font-medium">{fullName(s) || '—'}</td>
							<td>{s.gender || '—'}</td>
							<td>{s.group || '—'}</td>
							<td class="font-mono text-xs break-all">{s.email}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</main>
