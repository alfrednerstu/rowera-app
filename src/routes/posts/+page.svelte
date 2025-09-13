<script>
	// This will eventually load from the database
	let posts = []
	let feeds = []
</script>

<header class="page-header">
	<h1>Posts</h1>
	<nav class="header-actions">
		<a href="/posts/new" class="btn btn-primary">New Post</a>
		<a href="/feeds" class="btn btn-secondary">Manage Feeds</a>
	</nav>
</header>

{#if posts.length === 0}
	<section class="empty-state">
		<h2>No posts yet</h2>
		<p>Get started by creating your first post or setting up a feed.</p>
		<nav class="empty-actions">
			<a href="/posts/new" class="btn btn-primary">Create First Post</a>
			<a href="/feeds/new" class="btn btn-secondary">Create Feed</a>
		</nav>
	</section>
{:else}
	<section class="posts-list">
		{#each posts as post}
			<article class="post-item">
				<h3><a href="/posts/{post.id}">{post.title}</a></h3>
				<p class="post-meta">
					{post.feed.name} • {post.publishedAt ? 'Published' : 'Draft'} • {post.updatedAt}
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
	
	.posts-list {
		background: white;
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}
	
	.post-item {
		padding: 1.5rem;
		border-bottom: 1px solid #e9ecef;
	}
	
	.post-item:last-child {
		border-bottom: none;
	}
	
	.post-item h3 {
		margin: 0 0 0.5rem 0;
	}
	
	.post-item h3 a {
		color: #495057;
		text-decoration: none;
	}
	
	.post-item h3 a:hover {
		color: #007bff;
	}
	
	.post-meta {
		margin: 0;
		color: #6c757d;
		font-size: 0.9rem;
	}
</style>