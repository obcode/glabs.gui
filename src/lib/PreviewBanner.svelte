<script lang="ts">
	import { goto } from '$app/navigation';

	// Hinweis, solange ein Admin glabs als nicht freigeschaltete Person ansieht —
	// mit dem Weg zurück, denn in der Vorschau ist /admin gesperrt.
	let ending = $state(false);

	async function endPreview() {
		ending = true;
		try {
			await fetch('/api/access/preview', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ on: false })
			});
			await goto('/admin/access', { invalidateAll: true });
		} finally {
			ending = false;
		}
	}
</script>

<div class="bg-warning px-3 py-2 text-sm text-warning-content sm:px-4 lg:px-8">
	<div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
		<span>
			<strong>Vorschau:</strong> Sie sehen glabs wie eine Person, die nicht freigeschaltet ist. Ihre Admin-Rechte
			ruhen so lange.
		</span>
		<button class="btn btn-sm" onclick={endPreview} disabled={ending}>Vorschau beenden</button>
	</div>
</div>
