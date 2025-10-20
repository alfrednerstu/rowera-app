<script>
	// This will eventually load from the database
	let presentations = []
	let activePresentationId = null
</script>

<header class="page-header">
	<h1>Presentation</h1>
	<nav class="header-actions">
		<button><a href="/presentation/new">New Style</a></button>
	</nav>
</header>

{#if presentations.length === 0}
	<section class="empty-state">
		<h2>No presentation styles yet</h2>
		<p>Create visual themes and styles that can be applied to your content.</p>
		<nav class="empty-actions">
			<button><a href="/presentation/new">Create First Style</a></button>
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
					<button><a href="/presentation/{presentation.id}">Edit</a></button>
					{#if !presentation.isActive}
						<button>Activate</button>
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
		margin-bottom: 1rem;
	}

	.header-actions {
		display: flex;
		gap: 1rem;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: var(--surface-color);
		border-radius: 8px;
		border: 1px solid var(--quad-color);
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
		background: var(--surface-color);
		border-radius: 8px;
		border: 1px solid var(--quad-color);
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.presentation-card:hover {
		box-shadow: 0 4px 8px var(--surface-color);
	}

	.presentation-card.active {
		border-color: var(--accent-color);
		box-shadow: 0 2px 8px var(--accent-tertiary-color);
	}

	.card-header {
		padding: 1.5rem 1.5rem 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 500;
		background: var(--quad-color);
		color: var(--secondary-color);
	}

	.status-badge.active {
		background: var(--accent-tertiary-color);
		color: var(--accent-color);
	}

	.style-preview {
		padding: 1rem 1.5rem;
		background: var(--quint-color);
		border-top: 1px solid var(--quad-color);
		border-bottom: 1px solid var(--quad-color);
	}

	.preview-sample h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
	}

	.preview-sample p {
		margin: 0;
		font-size: 0.9rem;
		opacity: 0.75;
	}

	.card-actions {
		padding: 1rem 1.5rem;
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}
</style>