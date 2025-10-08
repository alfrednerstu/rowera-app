<script>
	// Parts documentation page - explains all building blocks of the CMS
</script>

<svelte:head>
	<title>Parts - Rowera CMS Primer</title>
	<meta name="description" content="Understanding the building blocks of Rowera CMS" />
</svelte:head>

<main>
	<header>
		<h1>Parts</h1>
		<p>
			Understanding the building blocks that make up the Rowera CMS. Each part serves a specific
			purpose in organizing and structuring your content.
		</p>
	</header>

	<section class="hierarchy">
		<h2>Content Hierarchy</h2>
		<p>
			Rowera organizes content in a hierarchical structure, from the largest container (Project) down
			to the smallest building block (Primitive).
		</p>
		<pre class="hierarchy-diagram">
Project
├── Pages (one-off pages)
├── Publications
│   ├── Posts (blog posts, articles)
│   └── Presets (templates for posts)
└── Packets
    ├── Pieces (reusable content items)
    └── Presets (templates for pieces)

Content is built from:
├── Partials (reusable components)
│   └── Made of Primitives
└── Primitives (semantic HTML elements)
		</pre>
	</section>

	<section class="parts-list">
		<article class="part-card">
			<header>
				<h2>Project</h2>
				<span class="level-badge">Top Level</span>
			</header>
			<p>
				The highest level container for all your content. A project represents a complete website or
				application. It contains pages, publications, packets, and presentations.
			</p>
			<dl>
				<dt>Contains:</dt>
				<dd>Pages, Publications, Packets, Presentations</dd>
				<dt>Example:</dt>
				<dd>My Portfolio, Company Blog, Documentation Site</dd>
			</dl>
		</article>

		<article class="part-card">
			<header>
				<h2>Page</h2>
				<span class="level-badge">Content</span>
			</header>
			<p>
				Standalone, one-off pages within a project. Pages are unique content pieces like "About",
				"Contact", or "Home" that don't fit into a publication or packet structure.
			</p>
			<dl>
				<dt>Contains:</dt>
				<dd>Partials and Primitives</dd>
				<dt>Example:</dt>
				<dd>About Us, Contact, Home, Privacy Policy</dd>
			</dl>
		</article>

		<article class="part-card">
			<header>
				<h2>Publication</h2>
				<span class="level-badge">Container</span>
			</header>
			<p>
				Groups posts under a project. Think of it as a blog or news section. Publications can have
				their own presets (templates) that define the structure for all posts within them.
			</p>
			<dl>
				<dt>Contains:</dt>
				<dd>Posts, Presets</dd>
				<dt>Example:</dt>
				<dd>Blog, News, Articles, Updates</dd>
			</dl>
		</article>

		<article class="part-card">
			<header>
				<h2>Post</h2>
				<span class="level-badge">Content</span>
			</header>
			<p>
				Content items within a publication. Posts are typically time-based entries like blog posts or
				news articles. They can use presets to maintain consistent structure.
			</p>
			<dl>
				<dt>Contains:</dt>
				<dd>Partials and Primitives</dd>
				<dt>Uses:</dt>
				<dd>Preset (optional)</dd>
				<dt>Example:</dt>
				<dd>Blog Post: "Getting Started with Rowera"</dd>
			</dl>
		</article>

		<article class="part-card">
			<header>
				<h2>Packet</h2>
				<span class="level-badge">Container</span>
			</header>
			<p>
				Groups pieces under a project. Packets organize reusable content items that don't follow a
				publication/blog structure. Like publications, packets can have presets.
			</p>
			<dl>
				<dt>Contains:</dt>
				<dd>Pieces, Presets</dd>
				<dt>Example:</dt>
				<dd>Team Members, Products, Testimonials</dd>
			</dl>
		</article>

		<article class="part-card">
			<header>
				<h2>Piece</h2>
				<span class="level-badge">Content</span>
			</header>
			<p>
				Individual content items within a packet. Pieces are reusable content blocks like team member
				profiles, product listings, or testimonials that follow a consistent structure.
			</p>
			<dl>
				<dt>Contains:</dt>
				<dd>Partials and Primitives</dd>
				<dt>Uses:</dt>
				<dd>Preset (optional)</dd>
				<dt>Example:</dt>
				<dd>Team Member: "Jane Doe", Product: "Widget Pro"</dd>
			</dl>
		</article>

		<article class="part-card">
			<header>
				<h2>Preset</h2>
				<span class="level-badge">Template</span>
			</header>
			<p>
				Templates that define the structure for posts or pieces. Presets ensure consistency across
				multiple content items by providing a predefined layout and set of components.
			</p>
			<dl>
				<dt>Defines structure for:</dt>
				<dd>Posts or Pieces</dd>
				<dt>Contains:</dt>
				<dd>Parts (layout structure)</dd>
				<dt>Example:</dt>
				<dd>Blog Post Template, Product Page Template</dd>
			</dl>
		</article>

		<article class="part-card">
			<header>
				<h2>Partial</h2>
				<span class="level-badge">Component</span>
			</header>
			<p>
				Reusable components made of primitives. Create a partial once and use it across multiple
				pages, posts, or pieces. Partials help maintain consistency and reduce repetition.
			</p>
			<dl>
				<dt>Made of:</dt>
				<dd>Primitives</dd>
				<dt>Used in:</dt>
				<dd>Pages, Posts, Pieces</dd>
				<dt>Example:</dt>
				<dd>Card, Hero Section, Call-to-Action, Navigation Menu</dd>
			</dl>
		</article>

		<article class="part-card">
			<header>
				<h2>Primitive</h2>
				<span class="level-badge">Building Block</span>
			</header>
			<p>
				The fundamental building blocks based on semantic HTML elements. Each primitive represents a
				single HTML tag like headings, paragraphs, images, or buttons with their associated fields.
			</p>
			<dl>
				<dt>Based on:</dt>
				<dd>Semantic HTML elements</dd>
				<dt>Used in:</dt>
				<dd>Partials, Pages, Posts, Pieces</dd>
				<dt>Example:</dt>
				<dd>Heading, Paragraph, Image, Button</dd>
			</dl>
			<p>
				<a href="/primer/primitives">View all primitives →</a>
			</p>
		</article>

		<article class="part-card">
			<header>
				<h2>Presentation</h2>
				<span class="level-badge">Styling</span>
			</header>
			<p>
				Visual style definitions that can be applied to your project. Presentations define CSS
				variables and global styles to control the look and feel of your content.
			</p>
			<dl>
				<dt>Contains:</dt>
				<dd>CSS variables, Global styles</dd>
				<dt>Applied to:</dt>
				<dd>Project</dd>
				<dt>Example:</dt>
				<dd>Dark Theme, Light Theme, Brand Colors</dd>
			</dl>
		</article>
	</section>

	<section class="workflow">
		<h2>Typical Workflow</h2>
		<ol>
			<li>
				<strong>Create primitives</strong> (or use the built-in semantic HTML primitives)
			</li>
			<li>
				<strong>Build partials</strong> from primitives to create reusable components
			</li>
			<li>
				<strong>Create presets</strong> to define templates for posts or pieces
			</li>
			<li>
				<strong>Create pages, posts, or pieces</strong> using partials and primitives
			</li>
			<li>
				<strong>Apply presentations</strong> to style your content
			</li>
		</ol>
	</section>
</main>

<style>
	main {
		max-width: 64rem;
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
		max-width: 48rem;
	}

	section {
		margin-bottom: 3rem;
	}

	h2 {
		margin: 0 0 1rem 0;
		font-size: 1.75rem;
	}

	.hierarchy {
		background: var(--surface-color);
		padding: 2rem;
		border-radius: 0.5rem;
	}

	.hierarchy-diagram {
		margin: 1.5rem 0 0 0;
		padding: 1.5rem;
		background: var(--base-color);
		border-radius: 0.25rem;
		font-family: 'Fira Mono', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
		overflow-x: auto;
	}

	.parts-list {
		display: grid;
		gap: 1.5rem;
	}

	.part-card {
		border: 1px solid var(--quad-color);
		border-radius: 0.5rem;
		padding: 2rem;
		background: var(--base-color);
	}

	.part-card > header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.part-card h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.level-badge {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		background: var(--surface-color);
		border-radius: 0.25rem;
		opacity: 0.75;
	}

	.part-card > p {
		margin: 0 0 1.5rem 0;
		opacity: 0.875;
		line-height: 1.6;
	}

	dl {
		margin: 0;
		background: var(--surface-color);
		padding: 1rem;
		border-radius: 0.25rem;
	}

	dt {
		font-weight: 600;
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
		opacity: 0.75;
	}

	dd {
		margin: 0 0 1rem 0;
		opacity: 0.875;
	}

	dd:last-child {
		margin-bottom: 0;
	}

	.workflow {
		background: var(--surface-color);
		padding: 2rem;
		border-radius: 0.5rem;
	}

	.workflow ol {
		margin: 0;
		padding-left: 1.5rem;
	}

	.workflow li {
		margin-bottom: 0.75rem;
		line-height: 1.6;
	}

	.workflow li:last-child {
		margin-bottom: 0;
	}
</style>
