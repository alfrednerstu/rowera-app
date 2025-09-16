<script>
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()
	let activeTab = $state('posts')
	
	// Publications table configuration
	const publicationColumns = [
		{ key: 'name', header: 'Publication Name' },
		{ key: 'slug', header: 'Slug' },
		{ key: 'productName', header: 'Product' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	// Posts table configuration
	const postColumns = [
		{ key: 'title', header: 'Post Title' },
		{ key: 'slug', header: 'Slug' },
		{ key: 'publicationName', header: 'Publication' },
		{ key: 'presetName', header: 'Preset' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	// Presets table configuration
	const presetColumns = [
		{ key: 'name', header: 'Preset Name' },
		{ key: 'publicationName', header: 'Publication' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	async function handleDeletePublication(publication) {
		if (confirm(`Are you sure you want to delete "${publication.name}"?`)) {
			try {
				const response = await fetch(`/api/publications/${publication.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					window.location.reload()
				} else {
					console.error('Failed to delete publication')
				}
			} catch (error) {
				console.error('Error deleting publication:', error)
			}
		}
	}
	
	async function handleDeletePost(post) {
		if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
			try {
				const response = await fetch(`/api/posts/${post.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					window.location.reload()
				} else {
					console.error('Failed to delete post')
				}
			} catch (error) {
				console.error('Error deleting post:', error)
			}
		}
	}
	
	async function handleDeletePreset(preset) {
		if (confirm(`Are you sure you want to delete "${preset.name}"?`)) {
			try {
				const response = await fetch(`/api/presets/${preset.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					window.location.reload()
				} else {
					console.error('Failed to delete preset')
				}
			} catch (error) {
				console.error('Error deleting preset:', error)
			}
		}
	}
</script>

<svelte:head>
	<title>Posts - Rowera CMS</title>
	<meta name="description" content="Manage your publications, posts, and presets" />
</svelte:head>

<nav class="tabs">
	<button onclick={() => activeTab = 'posts'} class:active={activeTab === 'posts'}>
		Posts
	</button>
	<button onclick={() => activeTab = 'publications'} class:active={activeTab === 'publications'}>
		Publications
	</button>
	<button onclick={() => activeTab = 'presets'} class:active={activeTab === 'presets'}>
		Presets
	</button>
</nav>

{#if activeTab === 'publications'}
	<CrudTable 
		items={data.publications}
		columns={publicationColumns}
		title="Publications"
		createUrl="/posts/publications/new"
		editUrl={(item) => `/posts/publications/${item.id}/edit`}
		onDelete={handleDeletePublication}
	/>
{:else if activeTab === 'posts'}
	<CrudTable 
		items={data.posts}
		columns={postColumns}
		title="Posts"
		createUrl="/posts/new"
		editUrl={(item) => `/posts/${item.id}/edit`}
		onDelete={handleDeletePost}
	/>
{:else if activeTab === 'presets'}
	<CrudTable 
		items={data.presets}
		columns={presetColumns}
		title="Presets"
		createUrl="/posts/presets/new"
		editUrl={(item) => `/posts/presets/${item.id}/edit`}
		onDelete={handleDeletePreset}
	/>
{/if}

<style>
	.tabs {
		display: flex;
		width: max-content;
		align-items: flex-start;
		margin-bottom: 1.5rem;
		background: var(--surface-color);
		border-radius: .5rem;
		border: 1px solid var(--quad-color);
		overflow: hidden;
		padding: .25rem;
	}
	
	.tabs button {
		padding: .25rem .5rem;	
		color: var(--secondary-color);
		background: none;
		font-weight: 500;
		transition: all 0.2s ease;
		border-radius: .25rem;
	}
	
	.tabs button:hover {
		color: #495057;
		background: var(--surface-color);
	}
	
	.tabs button.active {
		background: var(--accent-color);
		color: var(--base-color);
	}
	
	.page-header h1 {
		margin: 0;
		color: #495057;
	}
	
</style>