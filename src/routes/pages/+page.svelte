<script>
	import CrudTable from '$lib/components/CrudTable.svelte'
	
	let { data } = $props()
	let pages = $state(data.pages)
	
	// Update pages when data changes
	$effect(() => {
		pages = data.pages
	})
	
	const columns = [
		{ key: 'name', header: 'Page Name' },
		{ key: 'slug', header: 'Slug' },
		{ key: 'projectName', header: 'Project' },
		{ 
			key: 'createdAt', 
			header: 'Created',
			render: (item) => new Date(item.createdAt).toLocaleDateString()
		}
	]
	
	async function handleDelete(page) {
		if (confirm(`Are you sure you want to delete "${page.name}"?`)) {
			try {
				const response = await fetch(`/api/pages/${page.id}`, {
					method: 'DELETE'
				})
				
				if (response.ok) {
					// Remove from local state without page reload
					pages = pages.filter(p => p.id !== page.id)
				} else {
					console.error('Failed to delete page')
				}
			} catch (error) {
				console.error('Error deleting page:', error)
			}
		}
	}
</script>

<svelte:head>
	<title>Pages - Rowera CMS</title>
	<meta name="description" content="Manage your pages" />
</svelte:head>

<CrudTable 
	items={pages}
	{columns}
	title="Pages"
	createUrl="/pages/new"
	editUrl={(item) => `/pages/${item.id}/edit`}
	onDelete={handleDelete}
/>