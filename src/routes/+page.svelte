<script lang="ts">
	// Gerüst-Landing. Der Config-Editor (Kurse, Assignments, YAML-Export) und das
	// Auth-Gate gegen glabs-web folgen in den nächsten Schritten.
	const features = [
		{
			icon: '📝',
			title: 'Config geführt anlegen',
			text: 'Kurse und Assignments im Browser bearbeiten, statt YAML von Hand zu pflegen.'
		},
		{
			icon: '⬇️',
			title: 'YAML herunterladen',
			text: 'Die kanonische Kurs-Konfiguration exportieren und mit dem glabs-CLI weiterverwenden.'
		},
		{
			icon: '🦊',
			title: 'GitLab-Operationen',
			text: 'Mit hinterlegtem Personal Access Token Repos direkt aus der Oberfläche verwalten.'
		}
	];
</script>

<main class="mx-auto max-w-4xl py-12">
	<section class="text-center">
		<h1 class="text-4xl font-black tracking-tight sm:text-5xl">
			<span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
				glabs
			</span>
			<span class="text-base-content/80">Web</span>
		</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-base-content/70">
			Der Web-Editor für GitLab-Studierenden-Repos. Kurs-Konfigurationen geführt anlegen, als YAML
			exportieren und – mit hinterlegtem Token – GitLab-Operationen direkt im Browser ausführen.
		</p>
		<div class="mt-6 flex items-center justify-center gap-3">
			<a href="/courses" class="btn btn-primary">Zu den Kursen →</a>
		</div>
	</section>

	<section class="mt-12 grid gap-4 sm:grid-cols-3">
		{#each features as f (f.title)}
			<div class="card border border-base-200 bg-base-100 shadow-sm">
				<div class="card-body">
					<div class="text-3xl">{f.icon}</div>
					<h2 class="card-title text-base">{f.title}</h2>
					<p class="text-sm text-base-content/70">{f.text}</p>
				</div>
			</div>
		{/each}
	</section>
</main>
