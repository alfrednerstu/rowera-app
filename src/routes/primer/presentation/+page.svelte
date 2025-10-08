<script>
	// Presentation documentation page
</script>

<svelte:head>
	<title>Presentation - Rowera CMS Primer</title>
	<meta name="description" content="Understanding presentations and styling in Rowera CMS" />
</svelte:head>

<main>
	<header>
		<h1>Presentation</h1>
		<p>
			Learn how to style your content using presentations, CSS variables, and global styles.
		</p>
	</header>

	<section>
		<p><em>Documentation coming soon...</em></p>
	</section>
</main>

<style>
	main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--quad-color);
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2.5rem;
	}

	header > p {
		margin: 0;
		font-size: 1.125rem;
		opacity: 0.75;
	}

	section {
		margin-bottom: 3rem;
	}

	em {
		opacity: 0.5;
	}
</style>
