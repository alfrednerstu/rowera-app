<script>
	// This will eventually load from the database
	let stats = {
		postsCount: 0,
		pagesCount: 0,
		partialsCount: 0,
		feedsCount: 0
	}
</script>

<svelte:head>
	<title>Rowera CMS</title>
	<meta name="description" content="Rowera - Semantic CMS" />
</svelte:head>

<h1>Rowera CMS</h1>

<section class="dashboard-overview">
	<article class="stat-card">
		<h2>Posts</h2>
		<p class="stat-number">{stats.postsCount}</p>
		<p>Total posts across all feeds</p>
	</article>
	
	<article class="stat-card">
		<h2>Pages</h2>
		<p class="stat-number">{stats.pagesCount}</p>
		<p>Published pages</p>
	</article>
	
	<article class="stat-card">
		<h2>Partials</h2>
		<p class="stat-number">{stats.partialsCount}</p>
		<p>Reusable components</p>
	</article>
	
	<article class="stat-card">
		<h2>Feeds</h2>
		<p class="stat-number">{stats.feedsCount}</p>
		<p>Active content feeds</p>
	</article>
</section>

<section class="quick-actions">
	<h2>Quick Actions</h2>
	<nav class="action-buttons">
		<a href="/posts/new" class="btn btn-primary">New Post</a>
		<a href="/pages/new" class="btn btn-primary">New Page</a>
		<a href="/partials/new" class="btn btn-secondary">Create Partial</a>
	</nav>
</section>

<style>
	h1 {
		margin-bottom: 2rem;
		color: #495057;
	}
	
	.dashboard-overview {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}
	
	.stat-card {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		border: 1px solid #e9ecef;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}
	
	.stat-card h2 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #6c757d;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	
	.stat-number {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0;
		color: #495057;
	}
	
	.stat-card p:last-child {
		margin: 0;
		color: #6c757d;
		font-size: 0.9rem;
	}
	
	.quick-actions h2 {
		margin-bottom: 1rem;
		color: #495057;
	}
	
	.action-buttons {
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
</style>
