<script>
	import { page } from '$app/state'
	
	let { activeRoute = '/packets' } = $props()
</script>

<nav class="tabs">
	<a href="/packets/pieces" class:active={activeRoute === '/packets/pieces'}>
		Pieces
	</a>
	<a href="/packets" class:active={activeRoute === '/packets'}>
		Packets
	</a>
	<a href="/packets/presets" class:active={activeRoute === '/packets/presets'}>
		Presets
	</a>
</nav>

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
</style>