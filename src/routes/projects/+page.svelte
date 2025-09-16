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

<header class="page-header">
	<h1>Projects & Pieces</h1>
</header>

<nav class="tabs">
	<button onclick={() => activeTab = 'projects'} class:active={activeTab === 'projects'}>
		Projects
	</button>
	<button onclick={() => activeTab = 'pieces'} class:active={activeTab === 'pieces'}>
		Pieces
	</button>
	<button onclick={() => activeTab = 'presets'} class:active={activeTab === 'presets'}>
		Shared Presets
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
		title="Project Presets"
		createUrl="/projects/presets/new"
		editUrl={(item) => `/projects/presets/${item.id}/edit`}
		onDelete={handleDeletePreset}
	/>
{/if}

<style>
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e9ecef;
	}
	
	.page-header h1 {
		margin: 0;
		color: #495057;
	}
	
	.tabs {
		display: flex;
		border-bottom: 1px solid #e9ecef;
		margin-bottom: 2rem;
	}
	
	.tabs button {
		padding: 1rem 2rem;
		border: none;
		background: none;
		cursor: pointer;
		font-weight: 500;
		color: #6c757d;
		border-bottom: 3px solid transparent;
		transition: all 0.2s ease;
	}
	
	.tabs button:hover {
		color: #495057;
		background: #f8f9fa;
	}
	
	.tabs button.active {
		color: #007bff;
		border-bottom-color: #007bff;
	}
</style>