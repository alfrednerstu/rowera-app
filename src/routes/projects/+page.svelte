<script>
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()
	let activeTab = $state('projects')
	
	// Projects table configuration
	const projectColumns = [
		{ key: 'name', header: 'Project Name' },
		{ key: 'slug', header: 'Slug' },
		{ key: 'productName', header: 'Product' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	// Pieces table configuration
	const pieceColumns = [
		{ key: 'name', header: 'Piece Name' },
		{ key: 'slug', header: 'Slug' },
		{ key: 'projectName', header: 'Project' },
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
		{ key: 'projectName', header: 'Project' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	async function handleDeleteProject(project) {
		if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
			try {
				const response = await fetch(`/api/projects/${project.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					window.location.reload()
				} else {
					console.error('Failed to delete project')
				}
			} catch (error) {
				console.error('Error deleting project:', error)
			}
		}
	}
	
	async function handleDeletePiece(piece) {
		if (confirm(`Are you sure you want to delete "${piece.name}"?`)) {
			try {
				const response = await fetch(`/api/pieces/${piece.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					window.location.reload()
				} else {
					console.error('Failed to delete piece')
				}
			} catch (error) {
				console.error('Error deleting piece:', error)
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
	<title>Projects - Rowera CMS</title>
	<meta name="description" content="Manage your projects, pieces, and shared presets" />
</svelte:head>

<nav class="tabs">
	<button onclick={() => activeTab = 'pieces'} class:active={activeTab === 'pieces'}>
		Pieces
	</button>
	<button onclick={() => activeTab = 'projects'} class:active={activeTab === 'projects'}>
		Projects
	</button>
	
	<button onclick={() => activeTab = 'presets'} class:active={activeTab === 'presets'}>
		Presets
	</button>
</nav>

{#if activeTab === 'projects'}
	<CrudTable 
		items={data.projects}
		columns={projectColumns}
		title="Projects"
		createUrl="/projects/new"
		editUrl={(item) => `/projects/${item.id}/edit`}
		onDelete={handleDeleteProject}
	/>
{:else if activeTab === 'pieces'}
	<CrudTable 
		items={data.pieces}
		columns={pieceColumns}
		title="Pieces"
		createUrl="/projects/pieces/new"
		editUrl={(item) => `/projects/pieces/${item.id}/edit`}
		onDelete={handleDeletePiece}
	/>
{:else if activeTab === 'presets'}
	<CrudTable 
		items={data.presets}
		columns={presetColumns}
		title="Presets"
		createUrl="/projects/presets/new"
		editUrl={(item) => `/projects/presets/${item.id}/edit`}
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