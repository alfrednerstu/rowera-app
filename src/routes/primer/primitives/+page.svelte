<script>
	let { data } = $props()

	let searchQuery = $state('')
	let selectedCategory = $state('all')

	const categories = {
		all: 'All Primitives',
		sectioning: 'Content Sectioning',
		text: 'Text Content',
		interactive: 'Interactive',
		media: 'Media',
		inline: 'Inline'
	}

	const categoryMap = {
		'Header': 'sectioning',
		'Nav': 'sectioning',
		'Main': 'sectioning',
		'Section': 'sectioning',
		'Article': 'sectioning',
		'Aside': 'sectioning',
		'Footer': 'sectioning',
		'Heading': 'text',
		'Paragraph': 'text',
		'List': 'text',
		'Blockquote': 'text',
		'Button': 'interactive',
		'Link': 'interactive',
		'Accordion': 'interactive',
		'Dialog': 'interactive',
		'Image': 'media',
		'Video': 'media',
		'Audio': 'media',
		'Code': 'inline',
		'Time': 'inline'
	}

	let filteredPrimitives = $derived(
		data.primitives.filter(prim => {
			const matchesSearch = prim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				prim.description.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesCategory = selectedCategory === 'all' || categoryMap[prim.name] === selectedCategory
			return matchesSearch && matchesCategory
		})
	)

	function parseVariants(tags) {
		const variantMatch = tags.match(/\{variant:([^}]+)\}/)
		return variantMatch ? variantMatch[1].split(',') : null
	}

	function hasRepeatable(tags) {
		return tags.includes('{repeatable}')
	}

	function getExampleOutput(tags, fields) {
		let example = tags

		// Handle variants - show first option and store the variant value
		const variants = parseVariants(tags)
		let variantValue = null
		if (variants) {
			variantValue = variants[0]
			example = example.replace(/\{variant:[^}]+\}/g, variantValue)
		}

		// Handle repeatable sections
		if (hasRepeatable(tags)) {
			const repeatableMatch = example.match(/\{repeatable\}(.*?)\{\/repeatable\}/s)
			if (repeatableMatch) {
				// Show 2 examples of repeatable content
				const content = repeatableMatch[1]
				example = example.replace(/\{repeatable\}.*?\{\/repeatable\}/s, content + content)
			}
		}

		// Replace field placeholders with example text
		fields.forEach(field => {
			const placeholder = `{${field.name}}`
			let replacement = ''

			if (field.type === 'variant' && variantValue) {
				// For variant fields, use the actual variant value
				replacement = variantValue
			} else {
				switch (field.type) {
					case 'text':
						replacement = field.label
						break
					case 'textarea':
						replacement = 'Content goes here'
						break
					case 'url':
						replacement = 'https://example.com'
						break
					default:
						replacement = field.label
				}
			}

			example = example.replaceAll(placeholder, replacement)
		})

		return example
	}
</script>

<svelte:head>
	<title>Primitives Reference - Rowera CMS</title>
	<meta name="description" content="Complete reference of all semantic HTML primitives in Rowera CMS" />
</svelte:head>

<main>
	<aside class="sidebar">
		<nav>
			<h2>Contents</h2>
			<ul>
				{#each filteredPrimitives as primitive}
					<li>
						<a href="#{primitive.name.toLowerCase()}">{primitive.name}</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>

	<div class="content">
		<header>
			<h1>Primitives Reference</h1>
			<p>
				Primitives are the fundamental building blocks of your content. Each primitive represents
				a semantic HTML element that you can use to construct pages, posts, and pieces.
			</p>
		</header>

		<section class="controls">
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="Search primitives..."
				aria-label="Search primitives"
			/>

			<nav class="category-filter">
				{#each Object.entries(categories) as [key, label]}
					<button
						class:active={selectedCategory === key}
						onclick={() => selectedCategory = key}
					>
						{label}
					</button>
				{/each}
			</nav>
		</section>

		<section class="primitives-list">
			{#if filteredPrimitives.length === 0}
				<p class="no-results">No primitives found matching your search.</p>
			{:else}
				{#each filteredPrimitives as primitive}
					<article class="primitive-card" id={primitive.name.toLowerCase()}>
						<header>
							<h2>{primitive.name}</h2>
							<span class="category-badge">{categories[categoryMap[primitive.name]]}</span>
						</header>

						<p class="description">{primitive.description}</p>

						{#if parseVariants(primitive.tags)}
							<section class="variants">
								<h3>Variants</h3>
								<ul>
									{#each parseVariants(primitive.tags) as variant}
										<li><code>{variant}</code></li>
									{/each}
								</ul>
							</section>
						{/if}

						<section class="fields">
							<h3>Fields</h3>
							<ul>
								{#each primitive.fields as field}
									<li>
										<strong>{field.label}</strong>
										<span class="field-type">{field.type}</span>
										{#if field.optional}
											<span class="optional-badge">optional</span>
										{/if}
										{#if hasRepeatable(primitive.tags) && primitive.tags.includes(`{${field.name}}`)}
											<span class="repeatable-badge">repeatable</span>
										{/if}
										{#if field.description}
											<p class="field-description">{field.description}</p>
										{/if}
									</li>
								{/each}
							</ul>
						</section>

						<section class="example">
							<h3>Example Output</h3>
							<pre><code>{getExampleOutput(primitive.tags, primitive.fields)}</code></pre>
						</section>
					</article>
				{/each}
			{/if}
		</section>
	</div>
</main>

<style>
	main {
		display: flex;
		gap: 2rem;
		max-width: 80rem;
		margin: 0 auto;
		padding: 2rem;
	}

	.sidebar {
		flex: 0 0 16rem;
		position: sticky;
		top: 2rem;
		align-self: flex-start;
		max-height: calc(100vh - 4rem);
		overflow-y: auto;
	}

	.sidebar nav {
		padding: 1rem;
		background: var(--surface-color);
		border-radius: 0.5rem;
		border: 1px solid var(--quad-color);
	}

	.sidebar h2 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		opacity: 0.75;
	}

	.sidebar ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.sidebar li {
		margin-bottom: 0.5rem;
	}

	.sidebar a {
		display: block;
		padding: 0.5rem 0.75rem;
		color: var(--text-color);
		text-decoration: none;
		border-radius: 0.25rem;
		transition: background 0.2s ease;
		font-size: 0.875rem;
	}

	.sidebar a:hover {
		background: var(--quad-color);
	}

	.content {
		flex: 1;
		min-width: 0;
	}

	header {
		margin-bottom: 3rem;
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2.5rem;
	}

	header > p {
		margin: 0;
		font-size: 1.125rem;
		opacity: 0.75;
		max-width: 48rem;
	}

	.controls {
		margin-bottom: 2rem;
	}

	input[type="search"] {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid var(--quad-color);
		border-radius: 0.5rem;
		font-size: 1rem;
		margin-bottom: 1rem;
	}

	input[type="search"]:focus {
		outline: none;
		border-color: var(--accent-color);
	}

	.category-filter {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.category-filter button {
		padding: 0.5rem 1rem;
		border: 1px solid var(--quad-color);
		background: var(--base-color);
		border-radius: 0.25rem;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.875rem;
	}

	.category-filter button:hover {
		background: var(--surface-color);
	}

	.category-filter button.active {
		background: var(--accent-color);
		color: var(--base-color);
		border-color: var(--accent-color);
	}

	.primitives-list {
		display: grid;
		gap: 2rem;
	}

	.no-results {
		text-align: center;
		padding: 3rem;
		opacity: 0.5;
	}

	.primitive-card {
		border: 1px solid var(--quad-color);
		border-radius: 0.5rem;
		padding: 2rem;
		background: var(--base-color);
	}

	.primitive-card > header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--quad-color);
	}

	.primitive-card h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.category-badge {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		background: var(--surface-color);
		border-radius: 0.25rem;
		opacity: 0.75;
	}

	.description {
		margin: 0 0 1.5rem 0;
		opacity: 0.875;
	}

	.primitive-card section {
		margin-bottom: 1.5rem;
	}

	.primitive-card section:last-child {
		margin-bottom: 0;
	}

	.primitive-card h3 {
		margin: 0 0 0.75rem 0;
		font-size: 1rem;
		font-weight: 600;
		opacity: 0.75;
	}

	.variants ul,
	.fields ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.variants li {
		display: inline-block;
		margin-right: 0.5rem;
	}

	.fields li {
		padding: 0.75rem;
		background: var(--surface-color);
		border-radius: 0.25rem;
		margin-bottom: 0.5rem;
	}

	.fields li:last-child {
		margin-bottom: 0;
	}

	.field-type {
		font-size: 0.75rem;
		padding: 0.125rem 0.375rem;
		background: var(--tertiary-color);
		border-radius: 0.25rem;
		margin-left: 0.5rem;
		opacity: 0.75;
	}

	.optional-badge,
	.repeatable-badge {
		font-size: 0.75rem;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		margin-left: 0.5rem;
	}

	.optional-badge {
		background: var(--quad-color);
		opacity: 0.75;
	}

	.repeatable-badge {
		background: var(--accent-color);
		color: var(--base-color);
	}

	.field-description {
		margin: 0.5rem 0 0 0;
		font-size: 0.875rem;
		opacity: 0.75;
	}

	.example pre {
		margin: 0;
		padding: 1rem;
		background: var(--surface-color);
		border-radius: 0.25rem;
		overflow-x: auto;
	}

	.example code {
		font-family: 'Fira Mono', monospace;
		font-size: 0.875rem;
		line-height: 1.5;
	}
</style>
