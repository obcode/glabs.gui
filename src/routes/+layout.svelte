<script lang="ts">
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
	import Footer from '$lib/Footer.svelte';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children?: Snippet; data?: LayoutData } = $props();

	onMount(() => {
		themeChange(false);
	});
</script>

<svelte:head><title>glabs</title></svelte:head>

<Nav />
<div class="px-3 pb-8 sm:px-4 lg:px-8">
	{@render children?.()}
	<Footer guiVersion={data?.guiVersion} buildTime={data?.buildTime} serverInfo={data?.serverInfo} />
</div>
