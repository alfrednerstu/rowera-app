<script>
	import PacketsNavigation from '$lib/components/PacketsNavigation.svelte'
	import { page } from '$app/state'

	let { children } = $props()

	$effect(() => {
		// This ensures the active route is updated when navigating
		page.url.pathname
	})
</script>

<svelte:head>
	<title>Packets - Rowera CMS</title>
	<meta name="description" content="Manage your packets, pieces, and presets" />
</svelte:head>

<PacketsNavigation activeRoute={page.url.pathname} />

{@render children()}
