<script>
	// This will eventually load from the database
	let presentations = []
	let activePresentationId = null
</script>

<header class="page-header">
	<h1>Presentation</h1>
	<nav class="header-actions">
		<a href="/presentation/new" class="btn btn-primary">New Style</a>
	</nav>
</header>

{#if presentations.length === 0}
	<section class="empty-state">
		<h2>No presentation styles yet</h2>
		<p>Create visual themes and styles that can be applied to your content.</p>
		<nav class="empty-actions">
			<a href="/presentation/new" class="btn btn-primary">Create First Style</a>
		</nav>
	</section>
{:else}
	<section class="presentations-grid">
		{#each presentations as presentation}
			<article class="presentation-card" class:active={presentation.id === activePresentationId}>
				<header class="card-header">
					<h3>{presentation.name}</h3>
					{#if presentation.isActive}
						<span class="status-badge active">Active</span>
					{:else}
						<span class="status-badge">Inactive</span>
					{/if}
				</header>
				
				<div class="style-preview">
					<!-- This would show a preview of the styles -->
					<div class="preview-sample">
						<h4>Sample Heading</h4>
						<p>Sample paragraph text with styled content.</p>
					</div>
				</div>
				
				<footer class="card-actions">
					<a href="/presentation/{presentation.id}" class="btn btn-sm btn-secondary">Edit</a>
					{#if !presentation.isActive}
						<button class="btn btn-sm btn-primary">Activate</button>
					{/if}
				</footer>
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
		border: none;
		border-radius: 4px;
		font-weight: 500;
		transition: all 0.2s ease;
		cursor: pointer;
		font-size: 0.9rem;
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
	
	.btn-sm {
		padding: 0.5rem 1rem;
		font-size: 0.8rem;
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
	
	.presentations-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 2rem;
	}
	
	.presentation-card {
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
		overflow: hidden;
		transition: all 0.2s ease;
	}
	
	.presentation-card:hover {
		box-shadow: 0 4px 8px rgba(0,0,0,0.1);
	}
	
	.presentation-card.active {
		border-color: #007bff;
		box-shadow: 0 2px 8px rgba(0,123,255,0.2);
	}
	
	.card-header {
		padding: 1.5rem 1.5rem 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.card-header h3 {
		margin: 0;
		color: #495057;
	}
	
	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 500;
		background: #e9ecef;
		color: #6c757d;
	}
	
	.status-badge.active {
		background: #d1ecf1;
		color: #0c5460;
	}
	
	.style-preview {
		padding: 1rem 1.5rem;
		background: #f8f9fa;
		border-top: 1px solid #e9ecef;
		border-bottom: 1px solid #e9ecef;
	}
	
	.preview-sample h4 {
		margin: 0 0 0.5rem 0;
		color: #495057;
		font-size: 1.1rem;
	}
	
	.preview-sample p {
		margin: 0;
		color: #6c757d;
		font-size: 0.9rem;
	}
	
	.card-actions {
		padding: 1rem 1.5rem;
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}
</style>