<script>
	import { crossfade } from 'svelte/transition'
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()
	let activeTab = $state('posts')
	
	// Reactive state for each tab's data
	let publications = $state(data.publications)
	let posts = $state(data.posts)
	let presets = $state(data.presets)
	
	// Update data when props change
	$effect(() => {
		publications = data.publications
		posts = data.posts
		presets = data.presets
	})
	
	// Publications table configuration
	const publicationColumns = [
		{ key: 'name', header: 'Publication Name' },
		{ key: 'slug', header: 'Slug' },
		{ key: 'projectName', header: 'Project' },
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
					// Remove from local state without page reload
					publications = publications.filter(p => p.id !== publication.id)
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
					// Remove from local state without page reload
					posts = posts.filter(p => p.id !== post.id)
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
					// Remove from local state without page reload
					presets = presets.filter(p => p.id !== preset.id)
				} else {
					console.error('Failed to delete preset')
				}
			} catch (error) {
				console.error('Error deleting preset:', error)
			}
		}
	}

	const [send, receive] = crossfade({
    duration: 150
  })
</script>

<svelte:head>
	<title>Posts - Rowera CMS</title>
	<meta name="description" content="Manage your publications, posts, and presets" />
</svelte:head>

<nav class="tabs">
    <button onclick={() => activeTab = 'posts'} class:active={activeTab === 'posts'}>
        {#if activeTab === 'posts'}
          <span class="active-pill" in:receive={{ key: 'tabs-pill' }} out:send={{ key: 'tabs-pill' }} />
        {/if}
        Posts
    </button>
    <button onclick={() => activeTab = 'publications'} class:active={activeTab === 'publications'}>
        {#if activeTab === 'publications'}
          <span class="active-pill" in:receive={{ key: 'tabs-pill' }} out:send={{ key: 'tabs-pill' }} />
        {/if}
        Publications
    </button>
    <button onclick={() => activeTab = 'presets'} class:active={activeTab === 'presets'}>
        {#if activeTab === 'presets'}
          <span class="active-pill" in:receive={{ key: 'tabs-pill' }} out:send={{ key: 'tabs-pill' }} />
        {/if}
        Presets
    </button>
</nav>

{#if activeTab === 'publications'}
	<CrudTable 
		items={publications}
		columns={publicationColumns}
		title="Publications"
		createUrl="/posts/publications/new"
		editUrl={(item) => `/posts/publications/${item.id}/edit`}
		onDelete={handleDeletePublication}
	/>
{:else if activeTab === 'posts'}
	<CrudTable 
		items={posts}
		columns={postColumns}
		title="Posts"
		createUrl="/posts/new"
		editUrl={(item) => `/posts/${item.id}/edit`}
		onDelete={handleDeletePost}
	/>
{:else if activeTab === 'presets'}
	<CrudTable 
		items={presets}
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
		gap: .25rem;
	}
	
	.tabs button {
    position: relative;
    z-index: 0;
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

/* moving active background */
.active-pill {
    position: absolute;
    inset: 0;
    border-radius: .25rem;
    background: var(--accent-color);
    pointer-events: none;
    z-index: -1;
}
	
	.page-header h1 {
		margin: 0;
		color: #495057;
	}
</style>