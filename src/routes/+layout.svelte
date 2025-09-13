<script>
	import Header from './Header.svelte'
	let { children } = $props()
</script>

<div class="app-layout">
	<Header />
	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	.app-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	.content {
		flex: 1;
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}
</style>