<script>
	import Header from './Header.svelte'

	//import '@fontsource-variable/schibsted-grotesk';
	import '@fontsource/schibsted-grotesk/500.css';
	// Supports weights 300-900
	import '@fontsource-variable/tiktok-sans';

	import '../app.css'

	let { children } = $props()
</script>

<Header />

<main>
		{@render children()}
</main>


<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 2rem;
		max-width: 48rem;
		margin: 0 auto;
		width: 100%;
	}
</style>