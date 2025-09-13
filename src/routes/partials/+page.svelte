<script>
	// This will eventually load from the database
	let partials = []
</script>

<header class="page-header">
	<h1>Partials</h1>
	<nav class="header-actions">
		<a href="/partials/new" class="btn btn-primary">New Partial</a>
		<a href="/elements" class="btn btn-secondary">Element Library</a>
	</nav>
</header>

{#if partials.length === 0}
	<section class="empty-state">
		<h2>No partials yet</h2>
		<p>Create reusable semantic components that can be used across posts and pages.</p>
		<nav class="empty-actions">
			<a href="/partials/new" class="btn btn-primary">Create First Partial</a>
			<a href="/elements" class="btn btn-secondary">Browse Elements</a>
		</nav>
	</section>
{:else}
	<section class="partials-list">
		{#each partials as partial}
			<article class="partial-item">
				<h3><a href="/partials/{partial.id}">{partial.name}</a></h3>
				<p class="partial-description">{partial.description}</p>
				<p class="partial-meta">
					{partial.elements.length} elements • {partial.updatedAt}
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
	
	.btn-secondary {
		background: #6c757d;
		color: white;
	}
	
	.btn-secondary:hover {
		background: #545b62;
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
	
	.partials-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}
	
	.partial-item {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid #e9ecef;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		transition: box-shadow 0.2s ease;
	}
	
	.partial-item:hover {
		box-shadow: 0 4px 8px rgba(0,0,0,0.15);
	}
	
	.partial-item h3 {
		margin: 0 0 0.5rem 0;
	}
	
	.partial-item h3 a {
		color: #495057;
		text-decoration: none;
	}
	
	.partial-item h3 a:hover {
		color: #007bff;
	}
	
	.partial-description {
		margin: 0 0 1rem 0;
		color: #6c757d;
		font-size: 0.9rem;
		line-height: 1.4;
	}
	
	.partial-meta {
		margin: 0;
		color: #6c757d;
		font-size: 0.8rem;
	}
</style>