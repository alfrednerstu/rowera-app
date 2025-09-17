<script>
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()
	let partials = $state(data.partials)
	
	// Update partials when data changes
	$effect(() => {
		partials = data.partials
	})
	
	const columns = [
		{ key: 'name', header: 'Partial Name' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	async function handleDelete(partial) {
		if (confirm(`Are you sure you want to delete "${partial.name}"?`)) {
			try {
				const response = await fetch(`/api/partials/${partial.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					// Remove from local state without page reload
					partials = partials.filter(p => p.id !== partial.id)
				} else {
					console.error('Failed to delete partial')
				}
			} catch (error) {
				console.error('Error deleting partial:', error)
			}
		}
	}
</script>

<svelte:head>
	<title>Partials - Rowera CMS</title>
	<meta name="description" content="Manage your reusable partials" />
</svelte:head>

<CrudTable 
	items={partials}
	{columns}
	title="Partials"
	createUrl="/partials/new"
	editUrl={(item) => `/partials/${item.id}/edit`}
	onDelete={handleDelete}
/>

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