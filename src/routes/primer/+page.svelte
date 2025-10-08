<script>
	// Primer landing page - overview of CMS documentation
</script>

<svelte:head>
	<title>Primer - Rowera CMS</title>
	<meta name="description" content="Learn how to use Rowera CMS with our comprehensive primer" />
</svelte:head>

<main>
	<article>
		<header>
			<h1>Primer</h1>
			<p>Your guide to building with Rowera CMS</p>
		</header>

		<section>
			<h2>Getting Started</h2>
			<p>
				Rowera is a semantic HTML-first content management system. Build pages, posts, and pieces
				using primitives – reusable building blocks based on semantic HTML elements.
			</p>
		</section>

		<section>
			<h2>Core Concepts</h2>

			<article>
				<h3><a href="/primer/primitives">Primitives</a></h3>
				<p>
					The fundamental building blocks of your content. Each primitive represents a semantic HTML
					element like headings, paragraphs, images, buttons, and more.
				</p>
			</article>

			<article>
				<h3>Partials</h3>
				<p>
					Reusable components made up of multiple primitives. Create once, use everywhere.
				</p>
			</article>

			<article>
				<h3>Presets</h3>
				<p>
					Page templates that define the structure for your posts and pieces.
				</p>
			</article>

			<article>
				<h3>Projects</h3>
				<p>
					Top-level containers for organizing your content into distinct websites or applications.
				</p>
			</article>
		</section>

		<section>
			<h2>Documentation</h2>
			<nav>
				<ul>
					<li><a href="/primer/parts">Parts - Building Blocks Overview</a></li>
					<li><a href="/primer/primitives">Primitives Reference</a></li>
					<li><a href="/primer/presentation">Presentation</a></li>
					<li><a href="/primer/preferences">Preferences</a></li>
				</ul>
			</nav>
		</section>
	</article>
</main>

<style>
	main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 2rem;
	}

	article > header {
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--quad-color);
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2.5rem;
	}

	article > header p {
		margin: 0;
		font-size: 1.25rem;
		opacity: 0.75;
	}

	section {
		margin-bottom: 3rem;
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.75rem;
	}

	h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	section > article {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--surface-color);
		border-radius: 0.5rem;
	}

	section > article p {
		margin: 0;
		opacity: 0.875;
	}

	nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	nav li {
		margin-bottom: 0.5rem;
	}

	nav a {
		display: block;
		padding: 0.75rem 1rem;
		background: var(--surface-color);
		border-radius: 0.25rem;
		text-decoration: none;
		transition: background 0.2s ease;
	}

	nav a:hover {
		background: var(--tertiary-color);
	}
</style>
