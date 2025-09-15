<script>
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()
	// If we reach this page, user is already confirmed as admin by the page loader
	
	const columns = [
		{ key: 'name', header: 'Primitive Name' },
		{ key: 'tagName', header: 'HTML Tag' },
		{ 
			key: 'defaultContent', 
			header: 'Default Content',
			render: (item) => item.defaultContent || '-'
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
					window.location.reload()
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
	items={data.primitives}
	{columns}
	title="Primitives"
	createLabel="New Primitive"
	createUrl="/primitives/new"
	editUrl={(item) => `/primitives/${item.id}/edit`}
	onDelete={handleDelete}
/>

