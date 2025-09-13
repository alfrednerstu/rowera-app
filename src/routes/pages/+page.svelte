<script>
	// This will eventually load from the database
	let pages = []
</script>

<header class="page-header">
	<h1>Pages</h1>
	<nav class="header-actions">
		<a href="/pages/new" class="btn btn-primary">New Page</a>
	</nav>
</header>

{#if pages.length === 0}
	<section class="empty-state">
		<h2>No pages yet</h2>
		<p>Create standalone pages for your site like About, Contact, or landing pages.</p>
		<nav class="empty-actions">
			<a href="/pages/new" class="btn btn-primary">Create First Page</a>
		</nav>
	</section>
{:else}
	<section class="pages-list">
		{#each pages as page}
			<article class="page-item">
				<h3><a href="/pages/{page.id}">{page.title}</a></h3>
				<p class="page-meta">
					{page.slug} • {page.publishedAt ? 'Published' : 'Draft'} • {page.updatedAt}
				</p>
			</article>
		{/each}
	</section>
{/if}

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e9ecef;
	}
	
	.page-header h1 {
		margin: 0;
		color: #495057;
	}
	
	.header-actions {
		display: flex;
		gap: 1rem;
	}
	
	.btn {
		padding: 0.75rem 1.5rem;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
		transition: all 0.2s ease;
	}
	
	.btn-primary {
		background: #007bff;
		color: white;
	}
	
	.btn-primary:hover {
		background: #0056b3;
	}
	
	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}
	
	.empty-state h2 {
		margin-bottom: 1rem;
		color: #495057;
	}
	
	.empty-state p {
		color: #6c757d;
		margin-bottom: 2rem;
	}
	
	.empty-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
	
	.pages-list {
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}
	
	.page-item {
		padding: 1.5rem;
		border-bottom: 1px solid #e9ecef;
	}
	
	.page-item:last-child {
		border-bottom: none;
	}
	
	.page-item h3 {
		margin: 0 0 0.5rem 0;
	}
	
	.page-item h3 a {
		color: #495057;
		text-decoration: none;
	}
	
	.page-item h3 a:hover {
		color: #007bff;
	}
	
	.page-meta {
		margin: 0;
		color: #6c757d;
		font-size: 0.9rem;
	}
</style>