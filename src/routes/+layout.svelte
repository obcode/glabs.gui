<script>
	import '../app.css';
	import Nav from '$lib/Nav.svelte';
	import Footer from '$lib/Footer.svelte';
	import { themeChange } from 'theme-change';
	import { onMount } from 'svelte';

	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 * @property {import('./$types').LayoutData} [data]
	 */

	/** @type {Props} */
	let { children, data } = $props();

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
