<script>
	import { page } from '$app/state'
	import { crossfade } from 'svelte/transition'

	let { children } = $props()

	const isActive = (path) => page.url.pathname === path

	const [send, receive] = crossfade({
		duration: 150
	})
</script>

<svelte:head>
	<title>Publications - Rowera CMS</title>
	<meta name="description" content="Manage your publications, posts, and presets" />
</svelte:head>

<nav class="tabs">
	<a href="/publications/posts" class:active={isActive('/publications/posts')}>
		{#if isActive('/publications/posts')}
			<span class="active-pill" in:receive={{ key: 'tabs-pill' }} out:send={{ key: 'tabs-pill' }} />
		{/if}
		Posts
	</a>
	<a href="/publications" class:active={isActive('/publications')}>
		{#if isActive('/publications')}
			<span class="active-pill" in:receive={{ key: 'tabs-pill' }} out:send={{ key: 'tabs-pill' }} />
		{/if}
		Publications
	</a>
	<a href="/publications/presets" class:active={isActive('/publications/presets')}>
		{#if isActive('/publications/presets')}
			<span class="active-pill" in:receive={{ key: 'tabs-pill' }} out:send={{ key: 'tabs-pill' }} />
		{/if}
		Presets
	</a>
</nav>

{@render children()}

<style>
	.tabs {
		display: flex;
		width: max-content;
		align-items: flex-start;
		margin-bottom: 1.5rem;
		background: var(--surface-color);
		border-radius: .5rem;
		border: 1px solid var(--quad-color);
		overflow: hidden;
		padding: .25rem;
		gap: .25rem;
	}

	.tabs a {
		position: relative;
		z-index: 0;
		padding: .25rem .5rem;
		color: var(--secondary-color);
		background: none;
		font-weight: 500;
		transition: all 0.2s ease;
		border-radius: .25rem;
		text-decoration: none;
	}

	.tabs a:hover {
		color: #495057;
		background: var(--surface-color);
	}

	.tabs a.active {
		background: var(--accent-color);
		color: var(--base-color);
	}

	/* moving active background */
	.active-pill {
		position: absolute;
		inset: 0;
		border-radius: .25rem;
		background: var(--accent-color);
		pointer-events: none;
		z-index: -1;
	}
</style>
