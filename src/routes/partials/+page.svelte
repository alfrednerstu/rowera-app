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

