<script>
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()
	// If we reach this page, user is already confirmed as admin by the page loader
	let primitives = $state(data.primitives)
	
	// Update primitives when data changes
	$effect(() => {
		primitives = data.primitives
	})
	
	const columns = [
		{ key: 'name', header: 'Name' },
		{ key: 'description', header: 'Description' },
		{
			key: 'tags',
			header: 'HTML Tags',
			render: (item) => item.tags.substring(0, 50) + (item.tags.length > 50 ? '...' : '')
		},
		{
			key: 'createdAt',
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	async function handleDelete(primitive) {
		if (confirm(`Are you sure you want to delete "${primitive.name}"?`)) {
			try {
				const response = await fetch(`/api/primitives/${primitive.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					// Remove from local state without page reload
					primitives = primitives.filter(p => p.id !== primitive.id)
				} else {
					const error = await response.json()
					alert(error.error || 'Failed to delete primitive')
				}
			} catch (error) {
				console.error('Error deleting primitive:', error)
				alert('Error deleting primitive')
			}
		}
	}
</script>

<svelte:head>
	<title>Primitives - Rowera CMS</title>
	<meta name="description" content="Manage your primitive building blocks" />
</svelte:head>

<CrudTable 
	items={primitives}
	{columns}
	title="Primitives"
	createLabel="New Primitive"
	createUrl="/primitives/new"
	editUrl={(item) => `/primitives/${item.id}/edit`}
	onDelete={handleDelete}
/>

